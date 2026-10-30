import { Environment, Lightformer } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { Quality } from '../../hooks/useDeviceProfile'
import { createGlowTexture } from './textures'

type LightingRigProps = {
  quality: Quality
}

/**
 * A small, self-contained studio environment. Everything is generated in the
 * scene, so the site keeps working offline and never requests a remote HDRI.
 */
export function LightingRig({ quality }: LightingRigProps) {
  const high = quality === 'high'
  const { scene } = useThree()

  useEffect(() => {
    const previousIntensity = scene.environmentIntensity

    scene.environmentIntensity = high ? 0.8 : 0.55

    return () => {
      scene.environmentIntensity = previousIntensity
    }
  }, [high, scene])

  return (
    <>
      <ambientLight intensity={0.16} color="#cfd7df" />
      <hemisphereLight args={['#a9bccd', '#080808', 0.42]} />

      {/* Hard key light, upper right, like a stadium floodlight. */}
      <spotLight
        position={[4.6, 7.2, 5.4]}
        angle={0.42}
        penumbra={0.82}
        intensity={high ? 190 : 130}
        color="#fff3dd"
        castShadow={high}
        shadow-mapSize-width={high ? 1024 : 512}
        shadow-mapSize-height={high ? 1024 : 512}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      {/* Cool rim light from behind, separating the figure from the stadium. */}
      <spotLight
        position={[-5.4, 4.2, -3.4]}
        angle={0.7}
        penumbra={1}
        intensity={high ? 95 : 60}
        color="#9db7d6"
      />

      {/* Warm gold bounce, low and close. */}
      <pointLight position={[1.7, 1.35, 2.8]} intensity={high ? 26 : 16} color="#e9bb6c" distance={7} />

      {/* Narrow back edge to catch the shoulders and hair. */}
      <spotLight
        position={[1.4, 5.4, -5.2]}
        angle={0.3}
        penumbra={0.9}
        intensity={high ? 70 : 44}
        color="#f0d9ac"
      />

      <Environment resolution={high ? 128 : 64} frames={1} background={false}>
        <color attach="background" args={['#050505']} />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#fff4dd"
          position={[3, 5, 4]}
          rotation={[-0.5, 0.4, 0]}
          scale={[5, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#8ea6c0"
          position={[-5, 3, -2]}
          rotation={[0, -0.7, 0]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="circle"
          intensity={1.8}
          color="#e4c27b"
          position={[0, 1.2, 5]}
          scale={[2.4, 2.4, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.7}
          color="#6f7784"
          position={[-2, 7, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[7, 7, 1]}
        />
      </Environment>
    </>
  )
}

/**
 * A soft additive sprite used to suggest lens bloom without the cost of a
 * full post-processing pass.
 */
export function LensGlow({
  position,
  scale = 6,
  color = '#c9a24b',
  opacity = 0.16,
}: {
  position: [number, number, number]
  scale?: number
  color?: string
  opacity?: number
}) {
  const texture = useMemo(() => {
    const glow = createGlowTexture('rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.24)')
    glow.needsUpdate = true
    return glow
  }, [])

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  return (
    <mesh position={position} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={color}
        toneMapped={false}
      />
    </mesh>
  )
}
