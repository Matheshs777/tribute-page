import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Quality } from '../../hooks/useDeviceProfile'
import { LensGlow } from './LightingRig'
import { createGlowTexture, createPitchTexture, createStandsTexture } from './textures'

type StadiumEnvironmentProps = {
  quality: Quality
  reduced: boolean
}

const FLOODLIGHTS: Array<[number, number, number]> = [
  [-9.5, 0, -7.2],
  [9.5, 0, -7.2],
  [-10.5, 0, 4.8],
  [10.5, 0, 4.8],
]

/**
 * A deliberately graphic, cinematic stadium: a stylised pitch, a glowing
 * terrace bowl and four floodlights. Built from a handful of primitives so it
 * loads instantly and remains readable on low-power devices.
 */
export function StadiumEnvironment({ quality, reduced }: StadiumEnvironmentProps) {
  const high = quality === 'high'
  const ballastRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  const pitchTexture = useMemo(() => createPitchTexture(high ? 1024 : 512), [high])
  const crowdTexture = useMemo(() => createStandsTexture(high ? 2048 : 1024, high ? 512 : 256), [high])
  const floorGlow = useMemo(
    () => createGlowTexture('rgba(201, 162, 75, 0.6)', 'rgba(201, 162, 75, 0.16)'),
    [],
  )

  useEffect(() => {
    return () => {
      pitchTexture.dispose()
      crowdTexture.dispose()
      floorGlow.dispose()
    }
  }, [crowdTexture, floorGlow, pitchTexture])

  const crowd = useMemo(() => {
    const count = high ? 720 : 240
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const warm = new THREE.Color('#f2d8a1')
    const cool = new THREE.Color('#a9c3dd')

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = 7.8 + Math.random() * 7.6
      const height = 0.45 + Math.random() * 4.3
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = height
      positions[index * 3 + 2] = Math.sin(angle) * radius

      const color = Math.random() > 0.32 ? warm : cool
      const brightness = 0.35 + Math.random() * 0.65
      colors[index * 3] = color.r * brightness
      colors[index * 3 + 1] = color.g * brightness
      colors[index * 3 + 2] = color.b * brightness
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geometry
  }, [high])

  useEffect(() => {
    return () => {
      crowd.dispose()
    }
  }, [crowd])

  useFrame((state, delta) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    if (ballastRef.current) {
      ballastRef.current.rotation.y += delta * 0.012
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.045
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.22 + Math.sin(t * 0.9) * 0.06
    }
  })

  return (
    <group>
      {/* Dark surround so there is no visible horizon edge. */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.08} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#050505" roughness={0.96} metalness={0.05} />
      </mesh>

      {/* Stylised playing surface. */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[34, 34]} />
        <meshStandardMaterial
          map={pitchTexture}
          color="#b7b39f"
          roughness={0.86}
          metalness={0.06}
        />
      </mesh>

      {/* Warm pool of light under the figure. */}
      <mesh rotation-x={-Math.PI / 2} position={[0.3, 0.008, 0.4]}>
        <planeGeometry args={[6.4, 6.4]} />
        <meshBasicMaterial
          map={floorGlow}
          transparent
          opacity={0.32}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Painted circle, a deliberately non-official graphic device. */}
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} position={[0.3, 0.018, 0.25]}>
        <ringGeometry args={[1.32, 1.345, 96]} />
        <meshBasicMaterial
          color="#c9a24b"
          transparent
          opacity={0.26}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0.3, 0.017, 0.25]}>
        <ringGeometry args={[1.62, 1.628, 96]} />
        <meshBasicMaterial
          color="#c9a24b"
          transparent
          opacity={0.1}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* The terrace bowl. BackSide means the camera stands inside it. */}
      <mesh position={[0, 4.2, 0]}>
        <cylinderGeometry args={[19, 12.5, 11, 64, 1, true]} />
        <meshBasicMaterial
          map={crowdTexture}
          side={THREE.BackSide}
          toneMapped={false}
          fog
        />
      </mesh>

      {/* Roof edge. */}
      <mesh position={[0, 9.1, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[16.8, 0.26, 8, 80]} />
        <meshStandardMaterial color="#070708" roughness={0.55} metalness={0.7} />
      </mesh>

      {/* The crowd sparkle layer. */}
      <points geometry={crowd} frustumCulled={false}>
        <pointsMaterial
          size={high ? 0.048 : 0.07}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      {/* Four floodlights, kept as silhouettes with a hot lens flare. */}
      <group ref={ballastRef}>
        {FLOODLIGHTS.map(([x, , z], index) => {
          const angle = Math.atan2(x, z)
          return (
            <group key={index} position={[x, 0, z]} rotation={[0, angle, 0]}>
              <mesh position={[0, 3.6, 0]} castShadow={false}>
                <cylinderGeometry args={[0.075, 0.13, 7.2, 8]} />
                <meshStandardMaterial color="#0b0c0e" roughness={0.5} metalness={0.8} />
              </mesh>
              <mesh position={[0, 7.25, 0]}>
                <boxGeometry args={[3.1, 0.22, 0.52]} />
                <meshStandardMaterial color="#08090a" roughness={0.4} metalness={0.75} />
              </mesh>
              <mesh position={[0, 7.36, 0]}>
                <boxGeometry args={[2.75, 0.12, 0.34]} />
                <meshBasicMaterial color="#fff6dc" toneMapped={false} />
              </mesh>
              <LensGlow
                position={[0, 7.4, 0]}
                scale={4.2}
                color="#ffecc4"
                opacity={0.24}
              />
            </group>
          )
        })}
      </group>
    </group>
  )
}
