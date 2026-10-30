import { Component, Suspense, useMemo, type ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { TrophyModel } from '../../data/trophies'

const BALLON_MODEL_URL = '/models/ballon-dor.glb'
export const BALLON_TARGET_HEIGHT = 1.2

const hasFiniteBounds = (box: THREE.Box3) =>
  !box.isEmpty() &&
  Number.isFinite(box.min.x + box.min.y + box.min.z + box.max.x + box.max.y + box.max.z)

class TrophyModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    console.warn('The Ballon d’Or model could not be loaded. Using the procedural form.', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function BallonScene() {
  const gltf = useGLTF(BALLON_MODEL_URL)

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.updateMatrixWorld(true)

    // The upload includes a huge black display backdrop. Normalising the whole
    // scene against it shrinks the trophy to a speck, so measure each mesh and
    // set aside anything that dwarfs the rest of the file.
    const entries: { mesh: THREE.Mesh; box: THREE.Box3; maxDimension: number }[] = []
    clone.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return
      const mesh = object as THREE.Mesh
      mesh.geometry.computeBoundingBox()
      if (!mesh.geometry.boundingBox) return
      const box = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld)
      const dimensions = box.getSize(new THREE.Vector3())
      entries.push({
        mesh,
        box,
        maxDimension: Math.max(dimensions.x, dimensions.y, dimensions.z),
      })
    })

    if (!entries.length) {
      throw new Error('The Ballon d’Or model has no measurable geometry.')
    }

    entries.sort((a, b) => b.maxDimension - a.maxDimension)
    let hiddenScenery = 0
    if (entries.length > 1 && entries[0].maxDimension > entries[1].maxDimension * 4) {
      const backdrop = entries[0].mesh
      backdrop.visible = false
      backdrop.parent?.remove(backdrop)
      entries.shift()
      hiddenScenery = 1
    }

    const bounds = new THREE.Box3()
    entries.forEach((entry) => bounds.union(entry.box))
    const size = bounds.getSize(new THREE.Vector3())

    if (!hasFiniteBounds(bounds) || !Number.isFinite(size.y) || size.y <= 0.001) {
      throw new Error('The Ballon d’Or model has no measurable geometry.')
    }

    const scale = BALLON_TARGET_HEIGHT / size.y
    if (!Number.isFinite(scale) || scale <= 0 || scale > 600 || scale < 1 / 600) {
      throw new Error(`The Ballon d’Or model has an unusable scale factor: ${scale}`)
    }

    clone.scale.setScalar(scale)
    const scaledMin = bounds.min.clone().multiplyScalar(scale)
    const scaledMax = bounds.max.clone().multiplyScalar(scale)
    clone.position.x -= (scaledMin.x + scaledMax.x) / 2
    clone.position.y -= scaledMin.y
    clone.position.z -= (scaledMin.z + scaledMax.z) / 2

    clone.traverse((object) => {
      if (object instanceof THREE.Mesh && object.visible) {
        object.castShadow = true
        object.receiveShadow = true
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.envMapIntensity = 1.8
            material.needsUpdate = true
          }
        })
      }
    })

    console.info('[cr7-trophy] Ballon d’Or GLB active', {
      dimensionsMetres: { w: +size.x.toFixed(2), h: +size.y.toFixed(2), d: +size.z.toFixed(2) },
      scale: +scale.toFixed(4),
      hiddenSceneryMeshes: hiddenScenery,
    })
    return clone
  }, [gltf.scene])

  return <primitive object={scene} />
}

function BallonGlb() {
  return (
    <TrophyModelErrorBoundary fallback={<Ballon />}>
      <Suspense fallback={<Ballon />}>
        <BallonScene />
      </Suspense>
    </TrophyModelErrorBoundary>
  )
}

function PolishedMetal({
  color,
  roughness = 0.16,
}: {
  color: string
  roughness?: number
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={roughness}
      clearcoat={0.55}
      clearcoatRoughness={0.18}
      envMapIntensity={1.6}
    />
  )
}

function StoneBase({ radius = 0.3, height = 0.14 }: { radius?: number; height?: number }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.14, height, 32]} />
        <meshPhysicalMaterial
          color="#111214"
          roughness={0.34}
          metalness={0.4}
          clearcoat={0.5}
          clearcoatRoughness={0.35}
        />
      </mesh>
      <mesh position={[0, height + 0.012, 0]}>
        <cylinderGeometry args={[radius * 0.92, radius * 0.98, 0.024, 32]} />
        <PolishedMetal color="#c9a24b" roughness={0.24} />
      </mesh>
    </group>
  )
}

function Stem({ height = 0.28, radius = 0.055 }: { height?: number; radius?: number }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius * 1.2, height, 20]} />
        <PolishedMetal color="#c9a24b" roughness={0.2} />
      </mesh>
      <mesh position={[0, height * 0.55, 0]}>
        <sphereGeometry args={[radius * 1.35, 20, 14]} />
        <PolishedMetal color="#e5c77e" roughness={0.16} />
      </mesh>
    </group>
  )
}

function Ballon() {
  const y = 0.82

  return (
    <group>
      <StoneBase radius={0.34} height={0.26} />
      <mesh position={[0, y, 0]} castShadow>
        <sphereGeometry args={[0.37, 64, 48]} />
        <PolishedMetal color="#d6ae56" roughness={0.13} />
      </mesh>

      {/* Stylised panel seams, not a reproduction of any official design. */}
      <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.369, 0.0045, 6, 72]} />
        <PolishedMetal color="#8c6b2c" roughness={0.35} />
      </mesh>
      <mesh position={[0, y, 0]} rotation={[0, 0, 0.65]}>
        <torusGeometry args={[0.369, 0.0045, 6, 72]} />
        <PolishedMetal color="#8c6b2c" roughness={0.35} />
      </mesh>
      <mesh position={[0, y, 0]} rotation={[0.65, 0, 0]}>
        <torusGeometry args={[0.369, 0.0045, 6, 72]} />
        <PolishedMetal color="#8c6b2c" roughness={0.35} />
      </mesh>

      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.22, 0.19, 24]} />
        <PolishedMetal color="#c9a24b" roughness={0.22} />
      </mesh>
      <pointLight position={[0.5, 1.7, 0.8]} intensity={3} color="#e7c06c" distance={3.5} />
    </group>
  )
}

function Champions() {
  const cupProfile = useMemo(
    () =>
      [
        new THREE.Vector2(0.08, 0),
        new THREE.Vector2(0.24, 0.03),
        new THREE.Vector2(0.3, 0.12),
        new THREE.Vector2(0.31, 0.2),
        new THREE.Vector2(0.24, 0.25),
        new THREE.Vector2(0.28, 0.38),
        new THREE.Vector2(0.42, 0.62),
        new THREE.Vector2(0.5, 0.82),
        new THREE.Vector2(0.53, 0.9),
        new THREE.Vector2(0.48, 0.92),
      ],
    [],
  )

  return (
    <group>
      <StoneBase radius={0.36} height={0.2} />
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.22, 0.34, 24]} />
        <PolishedMetal color="#d7dce2" roughness={0.18} />
      </mesh>

      <group position={[0, 0.52, 0]}>
        <mesh castShadow>
          <latheGeometry args={[cupProfile, 64]} />
          <meshPhysicalMaterial
            color="#e2e6eb"
            metalness={1}
            roughness={0.13}
            clearcoat={0.65}
            clearcoatRoughness={0.15}
            envMapIntensity={1.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.52, 0.46, 0]}>
            <mesh position={[side * -0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.024, 0.024, 0.17, 12]} />
              <PolishedMetal color="#dfe3e8" />
            </mesh>
            <mesh scale={[1, 1.18, 1]} castShadow>
              <torusGeometry args={[0.21, 0.03, 12, 40]} />
              <PolishedMetal color="#dfe3e8" roughness={0.15} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 0.87, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.018, 8, 72]} />
          <PolishedMetal color="#b8c0c9" roughness={0.28} />
        </mesh>
      </group>

      <mesh position={[0, 0.51, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 0.08, 32]} />
        <PolishedMetal color="#c9a24b" roughness={0.24} />
      </mesh>
    </group>
  )
}

function Euro() {
  const cupProfile = useMemo(
    () =>
      [
        new THREE.Vector2(0.07, 0),
        new THREE.Vector2(0.2, 0.02),
        new THREE.Vector2(0.26, 0.1),
        new THREE.Vector2(0.17, 0.24),
        new THREE.Vector2(0.2, 0.38),
        new THREE.Vector2(0.32, 0.58),
        new THREE.Vector2(0.39, 0.76),
        new THREE.Vector2(0.43, 0.88),
        new THREE.Vector2(0.39, 0.9),
      ],
    [],
  )

  return (
    <group>
      <StoneBase radius={0.34} height={0.16} />
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.25, 0.14, 32]} />
        <PolishedMetal color="#c9a24b" roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.24, 20]} />
        <PolishedMetal color="#d8dde2" roughness={0.2} />
      </mesh>

      <group position={[0, 0.48, 0]}>
        <mesh castShadow>
          <latheGeometry args={[cupProfile, 64]} />
          <meshPhysicalMaterial
            color="#e7e9ec"
            metalness={1}
            roughness={0.12}
            clearcoat={0.7}
            clearcoatRoughness={0.16}
            envMapIntensity={1.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.87, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.41, 0.02, 8, 64]} />
          <PolishedMetal color="#c9a24b" roughness={0.26} />
        </mesh>
        <mesh position={[0.27, 0.62, 0.21]} rotation={[0.35, 0.6, 0.2]}>
          <boxGeometry args={[0.16, 0.13, 0.015]} />
          <PolishedMetal color="#c9a24b" roughness={0.35} />
        </mesh>
      </group>

      <mesh position={[0, 0.46, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.25, 0.08, 32]} />
        <meshPhysicalMaterial color="#141517" roughness={0.32} metalness={0.4} />
      </mesh>
    </group>
  )
}

function League() {
  const cupProfile = useMemo(
    () =>
      [
        new THREE.Vector2(0.07, 0),
        new THREE.Vector2(0.23, 0.03),
        new THREE.Vector2(0.28, 0.12),
        new THREE.Vector2(0.24, 0.22),
        new THREE.Vector2(0.32, 0.48),
        new THREE.Vector2(0.44, 0.7),
        new THREE.Vector2(0.48, 0.8),
        new THREE.Vector2(0.44, 0.82),
      ],
    [],
  )

  return (
    <group>
      <StoneBase radius={0.35} height={0.18} />
      <group position={[0, 0.2, 0]}>
        <Stem height={0.24} radius={0.06} />
      </group>
      <group position={[0, 0.47, 0]}>
        <mesh castShadow>
          <latheGeometry args={[cupProfile, 64]} />
          <meshPhysicalMaterial
            color="#d2aa52"
            metalness={1}
            roughness={0.14}
            clearcoat={0.6}
            clearcoatRoughness={0.18}
            envMapIntensity={1.7}
            side={THREE.DoubleSide}
          />
        </mesh>

        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.47, 0.42, 0]}
            rotation={[0, 0, side * 0.12]}
            scale={[1, 1.3, 1]}
            castShadow
          >
            <torusGeometry args={[0.17, 0.026, 10, 36]} />
            <PolishedMetal color="#d2aa52" roughness={0.18} />
          </mesh>
        ))}

        <mesh position={[0, 0.79, 0]} castShadow>
          <sphereGeometry args={[0.11, 24, 18]} />
          <PolishedMetal color="#e8c979" roughness={0.14} />
        </mesh>
        <mesh position={[0, 0.92, 0]} castShadow>
          <coneGeometry args={[0.065, 0.16, 18]} />
          <PolishedMetal color="#e8c979" roughness={0.14} />
        </mesh>
      </group>
    </group>
  )
}

function Nations() {
  const bowlProfile = useMemo(
    () =>
      [
        new THREE.Vector2(0.08, 0),
        new THREE.Vector2(0.26, 0.04),
        new THREE.Vector2(0.32, 0.16),
        new THREE.Vector2(0.46, 0.34),
        new THREE.Vector2(0.52, 0.42),
        new THREE.Vector2(0.46, 0.43),
        new THREE.Vector2(0.34, 0.28),
        new THREE.Vector2(0.2, 0.12),
      ],
    [],
  )

  return (
    <group>
      <StoneBase radius={0.34} height={0.17} />
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.21, 0.28, 24]} />
        <PolishedMetal color="#c9a24b" roughness={0.22} />
      </mesh>

      <group position={[0, 0.47, 0]}>
        <mesh castShadow>
          <latheGeometry args={[bowlProfile, 64]} />
          <meshPhysicalMaterial
            color="#dfe3e6"
            metalness={1}
            roughness={0.15}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
            envMapIntensity={1.7}
            side={THREE.DoubleSide}
          />
        </mesh>

        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.5, 0.23, 0]}
            rotation={[0, 0, side * 0.25]}
            scale={[1, 0.8, 1]}
            castShadow
          >
            <torusGeometry args={[0.19, 0.028, 10, 36]} />
            <PolishedMetal color="#dfe3e6" roughness={0.16} />
          </mesh>
        ))}

        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.19, 32, 22]} />
          <PolishedMetal color="#c9a24b" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.4, 0]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.245, 0.008, 6, 48]} />
          <PolishedMetal color="#e3c477" roughness={0.25} />
        </mesh>
      </group>
    </group>
  )
}

function Record() {
  const shape = useMemo(() => {
    const seven = new THREE.Shape()
    seven.moveTo(-0.34, 0.86)
    seven.lineTo(0.38, 0.86)
    seven.lineTo(0.38, 0.67)
    seven.lineTo(0.09, 0.08)
    seven.lineTo(-0.16, 0.08)
    seven.lineTo(0.1, 0.67)
    seven.lineTo(-0.34, 0.67)
    seven.closePath()
    return seven
  }, [])

  const settings = useMemo(
    () => ({
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      curveSegments: 12,
    }),
    [],
  )

  return (
    <group>
      <StoneBase radius={0.42} height={0.2} />
      <group position={[0, 0.36, -0.1]}>
        <mesh castShadow>
          <extrudeGeometry args={[shape, settings]} />
          <PolishedMetal color="#d6ae56" roughness={0.14} />
        </mesh>

        <mesh position={[0, 0.48, -0.42]} rotation={[1.15, 0.2, 0]}>
          <torusGeometry args={[0.72, 0.011, 8, 80]} />
          <PolishedMetal color="#c9a24b" roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.48, -0.42]} rotation={[1.55, -0.35, 0.2]}>
          <torusGeometry args={[0.84, 0.006, 8, 80]} />
          <PolishedMetal color="#f0d58a" roughness={0.3} />
        </mesh>

        <pointLight position={[0.8, 0.9, 0.8]} intensity={3.5} color="#f0d58a" distance={3} />
      </group>

      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.3, 0.36, 0.05, 32]} />
        <PolishedMetal color="#c9a24b" roughness={0.22} />
      </mesh>
    </group>
  )
}

export function TrophyModel({ kind, accent }: { kind: TrophyModel; accent: string }) {
  switch (kind) {
    case 'ballon':
      return <BallonGlb />
    case 'champions':
      return <Champions />
    case 'euro':
      return <Euro />
    case 'league':
      return <League />
    case 'nations':
      return <Nations />
    case 'record':
      return <Record />
    default:
      return (
        <group>
          <StoneBase radius={0.34} height={0.18} />
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.3, 48, 32]} />
            <PolishedMetal color={accent} />
          </mesh>
        </group>
      )
  }
}
