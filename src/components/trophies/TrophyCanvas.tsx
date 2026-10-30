import { Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Trophy } from '../../data/trophies'
import type { Quality } from '../../hooks/useDeviceProfile'
import { LensGlow } from '../hero/LightingRig'
import { BALLON_TARGET_HEIGHT, TrophyModel } from './TrophyModels'

type TrophyCanvasProps = {
  trophy: Trophy
  quality: Quality
  reduced: boolean
  active: boolean
}

const PEDESTAL_TOP_Y = 0.57
const DEFAULT_TROPHY_SCALE = 1
const BALLON_TROPHY_SCALE = 0.72
// The Ballon d'Or GLB is normalised before this display scale.
const BALLON_DISPLAY_HEIGHT = BALLON_TARGET_HEIGHT * BALLON_TROPHY_SCALE
// Centre the gold arc on the trophy instead of the pedestal rim so the globe
// sits inside the ring rather than breaking through the top of it.
const BALLON_RING_Y = PEDESTAL_TOP_Y + BALLON_DISPLAY_HEIGHT / 2

function TrophyLighting({ high }: { high: boolean }) {
  return (
    <>
      <ambientLight intensity={0.12} color="#c9d2dc" />
      <hemisphereLight args={['#c2ccd8', '#080706', 0.3]} />

      <spotLight
        position={[2.6, 5.4, 3.2]}
        angle={0.46}
        penumbra={0.9}
        intensity={high ? 160 : 100}
        color="#fff3dd"
        castShadow={high}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0005}
      />
      <spotLight
        position={[-3.2, 3.4, -1.4]}
        angle={0.6}
        penumbra={1}
        intensity={high ? 80 : 50}
        color="#b5c9e2"
      />
      <pointLight position={[1.4, 2.4, 2.1]} intensity={high ? 18 : 10} color="#e8c176" distance={6} />
      <pointLight position={[0, 0.65, 2.4]} intensity={high ? 9 : 5} color="#d8b66d" distance={4} />

      <Environment resolution={high ? 128 : 64} frames={1} background={false}>
        <color attach="background" args={['#060505']} />
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#fff1d5"
          position={[2.4, 4, 3]}
          rotation={[-0.4, 0.5, 0]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#9eb8d5"
          position={[-4, 2.4, -1]}
          rotation={[0, -0.8, 0]}
          scale={[3, 2.5, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.1}
          color="#f0d58a"
          position={[0, 1.2, 4.5]}
          scale={[2, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#6e737b"
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[6, 6, 1]}
        />
      </Environment>
    </>
  )
}

function Dust({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const count = 80
    const positions = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.5 + Math.random() * 2.3
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = 0.3 + Math.random() * 2.2
      positions[index * 3 + 2] = Math.sin(angle) * radius
    }
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return buffer
  }, [])

  useEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  useFrame((state) => {
    if (!ref.current || reduced) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#e4c57e"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

function Pedestal({ high, ringY }: { high: boolean; ringY: number }) {
  return (
    <group>
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <cylinderGeometry args={[0.98, 1.06, 0.07, 64]} />
        <meshPhysicalMaterial color="#0e0f10" metalness={0.55} roughness={0.36} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 0.315, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.78, 0.5, 64]} />
        <meshPhysicalMaterial
          color="#161617"
          metalness={0.45}
          roughness={0.28}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </mesh>
      <mesh position={[0, ringY, 0]}>
        <torusGeometry args={[0.71, 0.012, 8, 72]} />
        <meshPhysicalMaterial
          color="#c9a24b"
          metalness={1}
          roughness={0.24}
          emissive="#6a501d"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[0, 0.072, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.94, 0.008, 6, 80]} />
        <meshBasicMaterial color="#c9a24b" transparent opacity={0.38} toneMapped={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[1.22, 1.235, 96]} />
        <meshBasicMaterial color="#c9a24b" transparent opacity={0.22} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[1.62, 1.628, 96]} />
        <meshBasicMaterial color="#c9a24b" transparent opacity={0.09} toneMapped={false} />
      </mesh>

      {high ? null : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
          <circleGeometry args={[2.4, 48]} />
          <meshBasicMaterial color="#080808" toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

// The exhibit turntable mounts only the trophy GLB. The aleganda athlete mesh
// belongs to the hero and celebration canvases, so it is never loaded here.
function TrophyFigure({
  trophy,
  reduced,
  displayScale,
}: {
  trophy: Trophy
  reduced: boolean
  displayScale: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const easing = 1 - Math.exp(-4.5 * delta)
    const scale = THREE.MathUtils.lerp(group.current.scale.x, displayScale, easing)
    group.current.scale.setScalar(scale)

    if (reduced) {
      group.current.rotation.y = 0.42
      group.current.position.y = PEDESTAL_TOP_Y
      return
    }

    const pointer = state.pointer
    group.current.rotation.y += delta * 0.24
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * -0.04,
      easing,
    )
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      pointer.x * 0.06,
      easing,
    )
    group.current.position.y =
      PEDESTAL_TOP_Y + Math.sin(state.clock.elapsedTime * 0.8) * 0.008
  })

  return (
    <group ref={group} position={[0, PEDESTAL_TOP_Y, 0]} scale={displayScale}>
      <TrophyModel kind={trophy.model} accent={trophy.accent} />
    </group>
  )
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, delta) => {
    const camera = state.camera
    const easing = 1 - Math.exp(-2.4 * delta)
    const pointer = reduced ? { x: 0, y: 0 } : state.pointer
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.34, easing)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.42 + pointer.y * 0.1, easing)
    camera.lookAt(0, 1.13, 0)
  })
  return null
}

export default function TrophyCanvas({
  trophy,
  quality,
  reduced,
  active,
}: TrophyCanvasProps) {
  const high = quality === 'high'
  const isBallon = trophy.model === 'ballon'
  const displayScale = isBallon ? BALLON_TROPHY_SCALE : DEFAULT_TROPHY_SCALE
  const ringY = isBallon ? BALLON_RING_Y : PEDESTAL_TOP_Y

  return (
    <Canvas
      className="trophy-canvas-el"
      shadows={high}
      dpr={high ? [1, 1.7] : [1, 1.3]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 1.42, 4.5], fov: 32, near: 0.1, far: 40 }}
      gl={{
        antialias: high,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.04
        gl.outputColorSpace = THREE.SRGBColorSpace
      }}
      aria-hidden="true"
    >
      <color attach="background" args={['#070606']} />
      <fog attach="fog" args={['#070606', 6, 16]} />

      <CameraRig reduced={reduced} />
      <TrophyLighting high={high} />
      <Pedestal high={high} ringY={ringY} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        {high ? (
          <MeshReflectorMaterial
            blur={[280, 80]}
            resolution={256}
            mixBlur={1}
            mixStrength={9}
            roughness={0.82}
            depthScale={1.1}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.3}
            color="#0a0908"
            metalness={0.55}
            mirror={0.34}
          />
        ) : (
          <meshStandardMaterial color="#0a0908" roughness={0.55} metalness={0.35} />
        )}
      </mesh>

      <Suspense fallback={null}>
        <TrophyFigure trophy={trophy} reduced={reduced} displayScale={displayScale} />
      </Suspense>

      <Dust reduced={reduced} />
      <LensGlow position={[0, 1.9, -2.4]} scale={7} color="#c9a24b" opacity={0.1} />
      <LensGlow position={[-2.2, 2.8, -3]} scale={5} color="#9eb8d5" opacity={0.05} />
    </Canvas>
  )
}
