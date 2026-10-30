import { Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Quality } from '../../hooks/useDeviceProfile'
import { LensGlow } from '../hero/LightingRig'
import { RonaldoModel } from '../hero/RonaldoModel'

type CelebrationCanvasProps = {
  celebrating: boolean
  celebrationKey: number
  inView: boolean
  quality: Quality
  reduced: boolean
}

function CelebrationLights({
  celebrating,
  high,
  reduced,
}: {
  celebrating: boolean
  high: boolean
  reduced: boolean
}) {
  const keyRef = useRef<THREE.SpotLight>(null)
  const rimRef = useRef<THREE.SpotLight>(null)

  useFrame((_, delta) => {
    if (reduced) return
    const target = celebrating ? 240 : 165
    const rimTarget = celebrating ? 150 : 90
    if (keyRef.current) {
      keyRef.current.intensity = THREE.MathUtils.damp(
        keyRef.current.intensity,
        target,
        3.2,
        delta,
      )
    }
    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.damp(
        rimRef.current.intensity,
        rimTarget,
        3.2,
        delta,
      )
    }
  })

  return (
    <>
      <ambientLight intensity={0.18} color="#ccd4de" />
      <spotLight
        ref={keyRef}
        position={[2.8, 6.2, 3.8]}
        angle={0.42}
        penumbra={0.9}
        intensity={165}
        color="#fff2d8"
        castShadow={high}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0004}
      />
      <spotLight
        ref={rimRef}
        position={[-3.8, 4, -2.6]}
        angle={0.6}
        penumbra={1}
        intensity={90}
        color="#a9c2de"
      />
      <pointLight position={[0, 1.2, 2.6]} intensity={12} color="#e7bb70" distance={6} />
      <pointLight position={[0, 3.8, -2]} intensity={8} color="#f0d58a" distance={5} />

      <Environment resolution={high ? 128 : 64} frames={1} background={false}>
        <color attach="background" args={['#060505']} />
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#fff2d9"
          position={[2.6, 4.6, 3]}
          rotation={[-0.4, 0.4, 0]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#9fb7d3"
          position={[-4, 3, -2]}
          rotation={[0, -0.7, 0]}
          scale={[3, 2.5, 1]}
        />
        <Lightformer
          form="circle"
          intensity={1.6}
          color="#e8c47a"
          position={[0, 1, 5]}
          scale={[2, 2, 1]}
        />
      </Environment>
    </>
  )
}

function CameraShake({
  celebrating,
  reduced,
}: {
  celebrating: boolean
  reduced: boolean
}) {
  useFrame((state, delta) => {
    const easing = 1 - Math.exp(-3 * delta)
    const time = state.clock.elapsedTime
    const pointer = reduced ? { x: 0, y: 0 } : state.pointer
    const shake = celebrating && !reduced ? Math.sin(time * 46) * 0.006 : 0
    const targetZ = celebrating ? 5.35 : 4.8
    const targetY = (celebrating ? 1.55 : 1.44) + pointer.y * 0.08 + shake
    const lookY = celebrating ? 1.52 : 1.08

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      pointer.x * 0.14 + shake,
      easing,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      easing,
    )
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      easing,
    )
    state.camera.lookAt(0, lookY, 0)
  })
  return null
}

function Stage({ celebrating, reduced }: { celebrating: boolean; reduced: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const ringTwoRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (reduced) return
    const time = state.clock.elapsedTime
    const pulse = celebrating ? 1.8 + Math.sin(time * 5) * 0.25 : 1
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (celebrating ? 0.4 : 0.09)
      ringRef.current.scale.setScalar(pulse)
    }
    if (ringTwoRef.current) {
      ringTwoRef.current.rotation.z -= delta * (celebrating ? 0.28 : 0.06)
      ringTwoRef.current.scale.setScalar(celebrating ? 1.35 : 1)
    }
  })

  return (
    <group>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[1.36, 1.45, 0.16, 64]} />
        <meshPhysicalMaterial
          color="#131314"
          metalness={0.5}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.165, 0]}>
        <torusGeometry args={[1.36, 0.012, 8, 80]} />
        <meshPhysicalMaterial
          color="#c9a24b"
          metalness={1}
          roughness={0.24}
          emissive="#7b5a1d"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.17, 0]}>
        <ringGeometry args={[1.5, 1.515, 96]} />
        <meshBasicMaterial color="#c9a24b" transparent opacity={0.36} toneMapped={false} />
      </mesh>
      <mesh ref={ringTwoRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.17, 0]}>
        <ringGeometry args={[1.78, 1.79, 96]} />
        <meshBasicMaterial color="#f0d58a" transparent opacity={0.16} toneMapped={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[4.6, 64]} />
        <meshStandardMaterial color="#080808" roughness={0.6} metalness={0.25} />
      </mesh>
    </group>
  )
}

function Bokeh({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const count = 90
    const positions = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 12
      positions[index * 3 + 1] = 1 + Math.random() * 4
      positions[index * 3 + 2] = -2.5 - Math.random() * 5
    }
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return buffer
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    if (!ref.current || reduced) return
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#e6c47c"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

function LightBeams() {
  return (
    <group>
      {[-1.9, 0, 1.9].map((x, index) => (
        <mesh
          key={x}
          position={[x, 3.4, -1.2]}
          rotation={[0.2, 0, index === 1 ? 0 : x > 0 ? -0.18 : 0.18]}
        >
          <coneGeometry args={[0.55, 5.6, 24, 1, true]} />
          <meshBasicMaterial
            color="#f0d58a"
            transparent
            opacity={0.018}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function CelebrationCanvas({
  celebrating,
  celebrationKey,
  inView,
  quality,
  reduced,
}: CelebrationCanvasProps) {
  const high = quality === 'high'

  return (
    <Canvas
      className="celebration-canvas-el"
      shadows={high}
      dpr={high ? [1, 1.7] : [1, 1.3]}
      frameloop={inView ? 'always' : 'never'}
      camera={{ position: [0, 1.44, 4.8], fov: 33, near: 0.1, far: 40 }}
      gl={{
        antialias: high,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.03
        gl.outputColorSpace = THREE.SRGBColorSpace
      }}
      aria-hidden="true"
    >
      <color attach="background" args={['#070606']} />
      <fog attach="fog" args={['#070606', 7, 18]} />

      <CameraShake celebrating={celebrating} reduced={reduced} />
      <CelebrationLights celebrating={celebrating} high={high} reduced={reduced} />
      <Stage celebrating={celebrating} reduced={reduced} />
      <Bokeh reduced={reduced} />
      <LightBeams />
      <LensGlow position={[0, 2.1, -3.2]} scale={8} color="#c9a24b" opacity={0.12} />

      <group position={[0, 0.17, 0]}>
        <RonaldoModel
          celebration={celebrating}
          celebrationKey={celebrationKey}
          quality={quality}
          offsetX={0}
        />
      </group>
    </Canvas>
  )
}
