import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Quality } from '../../hooks/useDeviceProfile'
import { LensGlow, LightingRig } from './LightingRig'
import { RonaldoModel } from './RonaldoModel'
import { StadiumEnvironment } from './StadiumEnvironment'

type HeroSceneProps = {
  quality: Quality
  isMobile: boolean
  reduced: boolean
  revealed: boolean
}

function CameraRig({
  isMobile,
  reduced,
  revealed,
}: Pick<HeroSceneProps, 'isMobile' | 'reduced' | 'revealed'>) {
  const { camera } = useThree()
  const lookAt = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const pointer = reduced ? { x: 0, y: 0 } : state.pointer
    const baseZ = isMobile ? 6.35 : 5.55
    const targetZ = baseZ + (revealed ? 0 : 0.85)
    const targetX = isMobile ? 0.02 : 0.16 + pointer.x * 0.22
    const targetY = 1.5 + (reduced ? 0 : pointer.y * 0.07)
    const smoothing = 1 - Math.exp(-2.2 * delta)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, smoothing)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, smoothing)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, smoothing)

    lookAt.set(isMobile ? 0.03 : 0.2, isMobile ? 1.02 : 1.08, 0)
    camera.lookAt(lookAt)
  })

  return null
}

function GoldDust({ reduced, quality }: { reduced: boolean; quality: Quality }) {
  const pointsRef = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const count = quality === 'high' ? 150 : 48
    const positions = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const radius = 1.1 + Math.random() * 5.5
      const angle = Math.random() * Math.PI * 2
      positions[index * 3] = Math.cos(angle) * radius + 0.2
      positions[index * 3 + 1] = Math.random() * 4.2
      positions[index * 3 + 2] = Math.sin(angle) * radius
    }

    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return buffer
  }, [quality])

  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useFrame((state) => {
    if (!pointsRef.current || reduced) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.018
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.14) * 0.12
  })

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#e6c47c"
        size={quality === 'high' ? 0.026 : 0.04}
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

export function HeroScene({ quality, isMobile, reduced, revealed }: HeroSceneProps) {
  return (
    <>
      <color attach="background" args={['#060606']} />
      <fog attach="fog" args={['#060606', 10, 28]} />

      <CameraRig isMobile={isMobile} reduced={reduced} revealed={revealed} />
      <LightingRig quality={quality} />
      <StadiumEnvironment quality={quality} reduced={reduced} />

      <LensGlow
        position={[0.35, 2.2, -3.4]}
        scale={9}
        color="#c9a24b"
        opacity={0.11}
      />
      <LensGlow
        position={[-2.4, 3.4, -5.2]}
        scale={7}
        color="#9db7d6"
        opacity={0.07}
      />
      <GoldDust quality={quality} reduced={reduced} />

      <RonaldoModel quality={quality} offsetX={isMobile ? 0.09 : 0.38} />
    </>
  )
}
