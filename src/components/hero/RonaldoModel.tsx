import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { ProceduralAthlete } from './ProceduralAthlete'
import {
  FIGURE_POSES,
  buildRigPose,
  sampleCelebration,
  type FigurePose,
} from './skeletonPose'
import { CELEBRATION_DURATION_MS } from './celebrationTiming'
import type { Quality } from '../../hooks/useDeviceProfile'

const DEFAULT_MODEL_URL = '/models/cristiano-ronaldo.glb'
const configuredUrl = (import.meta.env.VITE_CR7_MODEL_URL as string | undefined)?.trim()

/**
 * The supplied Sketchfab export is authored facing −Z. This turns it to face
 * the camera. A replacement athlete model may need a different offset.
 */
const MODEL_FACING_OFFSET = Math.PI

const sampledVertex = new THREE.Vector3()
const sampledBounds = new THREE.Box3()

const hasFiniteBounds = (box: THREE.Box3) =>
  !box.isEmpty() &&
  Number.isFinite(box.min.x + box.min.y + box.min.z + box.max.x + box.max.y + box.max.z)

/**
 * True posed bounds. `Box3.setFromObject` only follows node matrices, so it
 * measures the raw geometry box and misses everything a skeleton does to a
 * bind pose — which is exactly the case for exported character GLBs. This
 * samples real vertex positions instead: bone-transformed for skinned meshes,
 * world-transformed for static ones.
 */
function measureSkinnedBounds(root: THREE.Object3D): THREE.Box3 {
  root.updateMatrixWorld(true)
  sampledBounds.makeEmpty()
  root.traverse((object) => {
    if (!(object as THREE.Mesh).isMesh) return
    const mesh = object as THREE.Mesh
    const position = mesh.geometry.getAttribute('position') as THREE.BufferAttribute | null
    if (!position) return

    if (mesh instanceof THREE.SkinnedMesh && mesh.skeleton && mesh.skeleton.bones.length > 0) {
      const total = position.count
      const stride = Math.max(1, Math.floor(total / 1200))
      for (let index = 0; index < total; index += stride) {
        mesh.getVertexPosition(index, sampledVertex)
        sampledVertex.applyMatrix4(mesh.matrixWorld)
        sampledBounds.expandByPoint(sampledVertex)
      }
      return
    }

    mesh.geometry.computeBoundingBox()
    sampledBounds.union(mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld))
  })

  return sampledBounds
}

function useOptionalModel() {
  const [url, setUrl] = useState<string | null>(configuredUrl || null)

  useEffect(() => {
    if (configuredUrl) return
    let cancelled = false

    fetch(DEFAULT_MODEL_URL, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) return
        const type = response.headers.get('content-type') ?? ''
        const length = Number(response.headers.get('content-length') ?? 0)
        const looksLikeModel =
          type.includes('gltf') ||
          type.includes('octet-stream') ||
          type.includes('model') ||
          length > 10_000
        if (looksLikeModel && !cancelled) setUrl(DEFAULT_MODEL_URL)
      })
      .catch(() => {
        // The procedural tribute figure is the intentional fallback.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return url
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    console.warn('The supplied athlete model could not be loaded. Using the procedural figure.', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

type GLBAthleteProps = {
  url: string
  celebration: boolean
  celebrationKey?: number
  quality: Quality
  offsetX: number
}

function GLBAthlete({
  url,
  celebration,
  celebrationKey = 0,
  quality,
  offsetX,
}: GLBAthleteProps) {
  const gltf = useGLTF(url)
  const group = useRef<THREE.Group>(null)
  const baseY = useRef(0)
  const phase = useRef(0)
  const timelineKey = useRef('')

  const clonedScene = useMemo(() => {
    const scene = SkeletonUtils.clone(gltf.scene)

    // The new export is authored facing −Z. Turn it to face the camera so the
    // tribute reads as a portrait and the SIUUU lands straight-on.
    scene.rotation.y = MODEL_FACING_OFFSET

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = quality === 'high'
        object.receiveShadow = true
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.envMapIntensity = quality === 'high' ? 1.05 : 0.6
            material.needsUpdate = true
          }
        })
      }
    })

    const bounds = measureSkinnedBounds(scene)
    if (!hasFiniteBounds(bounds)) {
      throw new Error('The athlete model has no measurable geometry.')
    }

    const size = bounds.getSize(new THREE.Vector3())
    const targetHeight = 1.95
    const scale = size.y > 0 ? targetHeight / size.y : 1
    if (!Number.isFinite(scale) || scale <= 0 || scale > 600 || scale < 1 / 600) {
      throw new Error(`The athlete model has an unusable scale factor: ${scale}`)
    }

    scene.scale.setScalar(scale)

    const scaledMin = bounds.min.clone().multiplyScalar(scale)
    const scaledMax = bounds.max.clone().multiplyScalar(scale)
    scene.position.x -= (scaledMin.x + scaledMax.x) / 2
    scene.position.y -= scaledMin.y
    scene.position.z -= (scaledMin.z + scaledMax.z) / 2

    console.info(
      '[cr7-model] GLB athlete active',
      {
        dimensionsMetres: { w: +size.x.toFixed(2), h: +size.y.toFixed(2), d: +size.z.toFixed(2) },
        scale: +scale.toFixed(4),
      },
    )
    return scene
  }, [gltf.scene, quality])

  const rigPose = useMemo(() => buildRigPose(clonedScene), [clonedScene])

  /**
   * Measure the lowest vertex of each pose once, so the celebration can plant
   * the boots at the start, on landing and at rest instead of clipping through
   * the stage. The offset is the group Y that puts that pose's feet at 0.
   */
  const groundOffsets = useMemo(() => {
    if (!rigPose) return null

    const offsets = {} as Record<FigurePose, number>

    for (const pose of FIGURE_POSES) {
      for (const bone of rigPose.bones) {
        const target = rigPose.targets[pose].get(bone.uuid)
        if (target) bone.quaternion.copy(target)
      }
      clonedScene.updateMatrixWorld(true)
      const bounds = measureSkinnedBounds(clonedScene)
      offsets[pose] = hasFiniteBounds(bounds) ? -bounds.min.y : 0
    }

    for (const bone of rigPose.bones) {
      const target = rigPose.targets.idle.get(bone.uuid)
      if (target) bone.quaternion.copy(target)
    }
    clonedScene.updateMatrixWorld(true)

    return offsets
  }, [rigPose, clonedScene])

  useFrame((state, delta) => {
    if (!group.current) return

    const key = `${celebration ? 1 : 0}:${celebrationKey}`
    if (key !== timelineKey.current) {
      timelineKey.current = key
      phase.current = 0
    }

    let pose: FigurePose = 'idle'
    let targetY = groundOffsets?.idle ?? 0

    if (celebration && groundOffsets) {
      phase.current = Math.min(CELEBRATION_DURATION_MS, phase.current + delta * 1000)
      const sample = sampleCelebration(phase.current, groundOffsets)
      pose = sample.pose
      targetY = sample.y
    } else {
      phase.current = 0
    }

    const targetYaw = celebration ? 0 : 0.14 + state.pointer.x * 0.08
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetYaw,
      celebration ? 4 : 1.8,
      delta,
    )

    baseY.current = THREE.MathUtils.damp(
      baseY.current,
      targetY,
      celebration ? 26 : 7,
      delta,
    )
    const bob = celebration ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.005
    group.current.position.y = baseY.current + bob

    if (!rigPose) return
    const targets = rigPose.targets[pose]
    const blend = 1 - Math.exp(-(celebration ? 14 : 7) * delta)
    for (const bone of rigPose.bones) {
      const target = targets.get(bone.uuid)
      if (target) bone.quaternion.slerp(target, blend)
    }
  })

  if (!rigPose || !groundOffsets) {
    throw new Error('The athlete model does not expose the expected Rigify deform bones.')
  }

  return (
    <group
      ref={group}
      position={[offsetX, 0, 0]}
      rotation={[0, celebration ? 0 : 0.14, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

type RonaldoModelProps = {
  celebration?: boolean
  celebrationKey?: number
  quality: Quality
  offsetX?: number
}

export function RonaldoModel({
  celebration = false,
  celebrationKey = 0,
  quality,
  offsetX = 0.32,
}: RonaldoModelProps) {
  const url = useOptionalModel()
  const fallback = (
    <ProceduralAthlete celebration={celebration} quality={quality} offsetX={offsetX} />
  )

  if (!url) return fallback

  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLBAthlete
          url={url}
          celebration={celebration}
          celebrationKey={celebrationKey}
          quality={quality}
          offsetX={offsetX}
        />
      </Suspense>
    </ModelErrorBoundary>
  )
}
