import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import type { Quality } from '../../hooks/useDeviceProfile'
import { HeroScene } from './HeroScene'

type HeroCanvasProps = {
  quality: Quality
  isMobile: boolean
  reduced: boolean
  revealed: boolean
  active: boolean
}

export default function HeroCanvas({
  quality,
  isMobile,
  reduced,
  revealed,
  active,
}: HeroCanvasProps) {
  const high = quality === 'high'

  return (
    <Canvas
      className="hero-canvas-el"
      shadows={high}
      dpr={high ? [1, 1.8] : [1, 1.35]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0.15, 1.5, 6.4], fov: isMobile ? 38 : 33, near: 0.1, far: 80 }}
      gl={{
        antialias: high,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.02
        gl.outputColorSpace = THREE.SRGBColorSpace
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <HeroScene
          quality={quality}
          isMobile={isMobile}
          reduced={reduced}
          revealed={revealed}
        />
      </Suspense>
    </Canvas>
  )
}
