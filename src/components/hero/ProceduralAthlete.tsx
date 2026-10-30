import { useMemo, useRef, type RefObject } from 'react'
import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Quality } from '../../hooks/useDeviceProfile'
import { createBallTexture, createNumberTexture } from './textures'

type ProceduralAthleteProps = {
  celebration?: boolean
  quality: Quality
  offsetX?: number
}

const skin = '#a96f50'
const skinDark = '#7f4f38'
const hair = '#16110f'
const kit = '#e9e5da'
const kitShade = '#cfc9bc'
const shorts = '#111113'
const gold = '#c9a24b'
const boot = '#d8b76e'

function Boot({ side }: { side: number }) {
  return (
    <group rotation={[0, side * 0.04, 0]}>
      <RoundedBox args={[0.195, 0.095, 0.31]} radius={0.038} smoothness={4} position={[0, -0.055, 0.075]} castShadow>
        <meshPhysicalMaterial color={boot} roughness={0.3} metalness={0.55} clearcoat={0.45} />
      </RoundedBox>
      <RoundedBox args={[0.205, 0.035, 0.32]} radius={0.015} smoothness={2} position={[0, -0.11, 0.075]} castShadow>
        <meshPhysicalMaterial color="#171513" roughness={0.6} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, -0.035, 0.222]} rotation={[0.2, 0, 0]} castShadow>
        <sphereGeometry args={[0.06, 14, 10]} />
        <meshPhysicalMaterial color={boot} roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.04, -0.06]} castShadow>
        <cylinderGeometry args={[0.078, 0.092, 0.14, 12]} />
        <meshStandardMaterial color="#f1ede4" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Leg({
  side,
  lowQuality,
  legRef,
  kneeRef,
}: {
  side: number
  lowQuality: boolean
  legRef: RefObject<THREE.Group | null>
  kneeRef: RefObject<THREE.Group | null>
}) {
  const segments = lowQuality ? 12 : 20

  return (
    <group ref={legRef} position={[side * 0.155, 1.09, 0]} rotation={[0, 0, side * 0.045]}>
      <mesh position={[0, -0.16, 0]} castShadow>
        <capsuleGeometry args={[0.095, 0.22, 6, segments]} />
        <meshStandardMaterial color={skin} roughness={0.62} />
      </mesh>
      <group ref={kneeRef} position={[0, -0.37, 0]}>
        <mesh position={[0, -0.19, 0]} castShadow>
          <capsuleGeometry args={[0.077, 0.23, 6, segments]} />
          <meshStandardMaterial color="#f0ece2" roughness={0.78} />
        </mesh>
        <mesh position={[0, -0.075, 0]}>
          <cylinderGeometry args={[0.081, 0.081, 0.045, segments]} />
          <meshStandardMaterial color={gold} metalness={0.45} roughness={0.36} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.073, segments, 12]} />
          <meshStandardMaterial color="#efece3" roughness={0.74} />
        </mesh>
        <group position={[0, -0.36, 0]}>
          <Boot side={side} />
        </group>
      </group>
    </group>
  )
}

function Arm({
  side,
  lowQuality,
  shoulderRef,
  elbowRef,
}: {
  side: number
  lowQuality: boolean
  shoulderRef: RefObject<THREE.Group | null>
  elbowRef: RefObject<THREE.Group | null>
}) {
  const segments = lowQuality ? 12 : 18
  const isLeft = side < 0

  return (
    <group
      ref={shoulderRef}
      position={[side * 0.335, 1.64, 0]}
      rotation={[0.04, 0, isLeft ? -0.1 : 0.1]}
    >
      <mesh position={[0, 0.015, 0]} castShadow>
        <sphereGeometry args={[0.13, segments, 12]} />
        <meshStandardMaterial color={kit} roughness={0.62} />
      </mesh>
      <mesh position={[0, -0.13, 0]} castShadow>
        <capsuleGeometry args={[0.076, 0.16, 6, segments]} />
        <meshStandardMaterial color={skin} roughness={0.61} />
      </mesh>
      <mesh position={[0, -0.215, 0]}>
        <cylinderGeometry args={[0.082, 0.08, 0.045, segments]} />
        <meshStandardMaterial color={gold} metalness={0.42} roughness={0.35} />
      </mesh>
      <group ref={elbowRef} position={[0, -0.29, 0]} rotation={[-0.12, 0, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.061, 0.17, 6, segments]} />
          <meshStandardMaterial color={skin} roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.27, 0]} castShadow>
          <sphereGeometry args={[0.07, segments, 12]} />
          <meshPhysicalMaterial color={skin} roughness={0.58} clearcoat={0.12} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.045, segments, 10]} />
          <meshStandardMaterial color={skinDark} roughness={0.72} />
        </mesh>
      </group>
    </group>
  )
}

function Head({ lowQuality }: { lowQuality: boolean }) {
  const segments = lowQuality ? 16 : 32

  return (
    <group position={[0, 1.98, 0]} rotation={[0.025, -0.1, 0]}>
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.115, 0.2, segments]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.11, 0]} castShadow>
        <sphereGeometry args={[0.12, segments, 16]} />
        <meshStandardMaterial color={skin} roughness={0.65} />
      </mesh>

      <group position={[0, 0.03, 0]}>
        <mesh scale={[0.19, 0.235, 0.2]} castShadow>
          <sphereGeometry args={[1, segments, segments]} />
          <meshPhysicalMaterial color={skin} roughness={0.52} clearcoat={0.16} clearcoatRoughness={0.55} />
        </mesh>
        <mesh scale={[0.15, 0.13, 0.16]} position={[0, -0.14, 0.018]} castShadow>
          <sphereGeometry args={[1, segments, 20]} />
          <meshStandardMaterial color={skin} roughness={0.58} />
        </mesh>

        <mesh position={[-0.19, -0.01, 0]} scale={[0.05, 0.085, 0.045]}>
          <sphereGeometry args={[1, segments, 12]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        <mesh position={[0.19, -0.01, 0]} scale={[0.05, 0.085, 0.045]}>
          <sphereGeometry args={[1, segments, 12]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>

        <mesh position={[0, -0.005, 0.195]} scale={[0.035, 0.055, 0.048]} castShadow>
          <sphereGeometry args={[1, segments, 12]} />
          <meshPhysicalMaterial color={skin} roughness={0.5} clearcoat={0.15} />
        </mesh>

        <mesh position={[-0.069, 0.055, 0.174]} scale={[0.033, 0.027, 0.018]}>
          <sphereGeometry args={[1, 16, 10]} />
          <meshStandardMaterial color="#170f0c" roughness={0.28} />
        </mesh>
        <mesh position={[0.069, 0.055, 0.174]} scale={[0.033, 0.027, 0.018]}>
          <sphereGeometry args={[1, 16, 10]} />
          <meshStandardMaterial color="#170f0c" roughness={0.28} />
        </mesh>
        <mesh position={[-0.072, 0.098, 0.165]} rotation={[0, 0, -0.12]} scale={[0.06, 0.012, 0.012]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#26150f" roughness={0.8} />
        </mesh>
        <mesh position={[0.072, 0.098, 0.165]} rotation={[0, 0, 0.12]} scale={[0.06, 0.012, 0.012]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#26150f" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.078, 0.174]} scale={[0.072, 0.014, 0.01]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#6b3d31" roughness={0.72} />
        </mesh>

        <mesh position={[0, 0.13, -0.012]} scale={[0.2, 0.145, 0.205]} castShadow>
          <sphereGeometry args={[1, segments, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={hair} roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.22, 0.03]} rotation={[-0.32, 0, 0]} scale={[0.16, 0.055, 0.1]} castShadow>
          <sphereGeometry args={[1, segments, 14]} />
          <meshStandardMaterial color={hair} roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.04, 0.12]} rotation={[0.2, 0, 0]} scale={[0.18, 0.045, 0.08]}>
          <sphereGeometry args={[1, 24, 10]} />
          <meshStandardMaterial color={hair} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

export function ProceduralAthlete({
  celebration = false,
  quality,
  offsetX = 0.32,
}: ProceduralAthleteProps) {
  const rootRef = useRef<THREE.Group>(null)
  const torsoRef = useRef<THREE.Group>(null)
  const leftShoulder = useRef<THREE.Group>(null)
  const rightShoulder = useRef<THREE.Group>(null)
  const leftElbow = useRef<THREE.Group>(null)
  const rightElbow = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftKnee = useRef<THREE.Group>(null)
  const rightKnee = useRef<THREE.Group>(null)
  const ballRef = useRef<THREE.Group>(null)
  const lowQuality = quality === 'low'
  const segments = lowQuality ? 16 : 32
  const numberTexture = useMemo(() => createNumberTexture('7'), [])
  const ballTexture = useMemo(() => createBallTexture(), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const pointer = state.pointer
    const smoothing = 1 - Math.exp(-5.5 * delta)
    const breath = Math.sin(t * 1.35)
    const sway = Math.sin(t * 0.48)
    const celebrationEase = 1 - Math.exp(-4.2 * delta)

    if (!rootRef.current) return

    const idleY = breath * 0.006
    const jump = celebration ? Math.abs(Math.sin(t * 2.7)) * 0.09 : 0
    rootRef.current.position.y = THREE.MathUtils.lerp(
      rootRef.current.position.y,
      idleY + jump,
      0.12,
    )
    rootRef.current.position.x = THREE.MathUtils.lerp(
      rootRef.current.position.x,
      offsetX + pointer.x * 0.025,
      0.06,
    )
    rootRef.current.rotation.y = THREE.MathUtils.lerp(
      rootRef.current.rotation.y,
      pointer.x * 0.09 + Math.sin(t * 0.2) * 0.045,
      0.045,
    )

    if (torsoRef.current) {
      torsoRef.current.rotation.z = sway * 0.007
      torsoRef.current.rotation.x = -0.01 + breath * 0.006
      torsoRef.current.scale.y = 1 + breath * 0.004
      torsoRef.current.rotation.y = pointer.x * 0.03
    }

    if (leftShoulder.current && rightShoulder.current) {
      const leftTarget = celebration ? -2.18 : -0.1 + sway * 0.01
      const rightTarget = celebration ? 2.18 : 0.1 - sway * 0.01
      leftShoulder.current.rotation.z = THREE.MathUtils.damp(
        leftShoulder.current.rotation.z,
        leftTarget,
        6,
        delta,
      )
      rightShoulder.current.rotation.z = THREE.MathUtils.damp(
        rightShoulder.current.rotation.z,
        rightTarget,
        6,
        delta,
      )
      leftShoulder.current.rotation.x = THREE.MathUtils.lerp(
        leftShoulder.current.rotation.x,
        celebration ? -0.24 : 0.04 + breath * 0.04,
        smoothing,
      )
      rightShoulder.current.rotation.x = THREE.MathUtils.lerp(
        rightShoulder.current.rotation.x,
        celebration ? -0.24 : 0.04 - breath * 0.04,
        smoothing,
      )
    }

    if (leftElbow.current && rightElbow.current) {
      leftElbow.current.rotation.x = THREE.MathUtils.lerp(
        leftElbow.current.rotation.x,
        celebration ? -0.08 : -0.17,
        celebrationEase,
      )
      rightElbow.current.rotation.x = THREE.MathUtils.lerp(
        rightElbow.current.rotation.x,
        celebration ? -0.08 : -0.2,
        celebrationEase,
      )
    }

    if (leftLeg.current && rightLeg.current && leftKnee.current && rightKnee.current) {
      leftLeg.current.rotation.z = THREE.MathUtils.lerp(
        leftLeg.current.rotation.z,
        celebration ? -0.08 : -0.045 + sway * 0.008,
        smoothing,
      )
      rightLeg.current.rotation.z = THREE.MathUtils.lerp(
        rightLeg.current.rotation.z,
        celebration ? 0.08 : 0.045 - sway * 0.008,
        smoothing,
      )
      leftKnee.current.rotation.x = THREE.MathUtils.lerp(
        leftKnee.current.rotation.x,
        celebration ? 0.14 : 0.015,
        smoothing,
      )
      rightKnee.current.rotation.x = THREE.MathUtils.lerp(
        rightKnee.current.rotation.x,
        celebration ? 0.14 : 0.015,
        smoothing,
      )
    }

    if (ballRef.current) {
      ballRef.current.rotation.y += delta * 0.32
      ballRef.current.rotation.x += delta * 0.08
      ballRef.current.position.y = 0.166 + (celebration ? Math.sin(t * 3.1) * 0.02 : 0)
    }
  })

  return (
    <group ref={rootRef} position={[offsetX, 0, 0]} scale={1.02}>
      {/* Shorts / hips */}
      <RoundedBox args={[0.46, 0.3, 0.31]} radius={0.09} smoothness={4} position={[0, 1.12, 0]} castShadow>
        <meshStandardMaterial color={shorts} roughness={0.68} />
      </RoundedBox>
      <mesh position={[-0.225, 1.12, 0.01]}>
        <boxGeometry args={[0.012, 0.23, 0.18]} />
        <meshStandardMaterial color={gold} metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[0.225, 1.12, 0.01]}>
        <boxGeometry args={[0.012, 0.23, 0.18]} />
        <meshStandardMaterial color={gold} metalness={0.55} roughness={0.32} />
      </mesh>

      <Leg side={-1} lowQuality={lowQuality} legRef={leftLeg} kneeRef={leftKnee} />
      <Leg side={1} lowQuality={lowQuality} legRef={rightLeg} kneeRef={rightKnee} />

      {/* Torso */}
      <group ref={torsoRef} position={[0, 0, 0]}>
        <mesh position={[0, 1.15, -0.01]} scale={[0.24, 0.12, 0.15]} castShadow>
          <sphereGeometry args={[1, segments, 14]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        <RoundedBox
          args={[0.56, 0.6, 0.3]}
          radius={0.13}
          smoothness={5}
          position={[0, 1.48, 0]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color={kit}
            roughness={0.6}
            clearcoat={0.15}
            clearcoatRoughness={0.6}
          />
        </RoundedBox>
        <mesh position={[-0.293, 1.48, 0]} scale={[0.02, 0.4, 0.13]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={kitShade} roughness={0.7} />
        </mesh>
        <mesh position={[0.293, 1.48, 0]} scale={[0.02, 0.4, 0.13]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={kitShade} roughness={0.7} />
        </mesh>

        {/* Gold collar, side trims and crest */}
        <mesh position={[0, 1.766, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.011, 8, segments]} />
          <meshStandardMaterial color={gold} metalness={0.55} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.48, 0.155]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.26, 0.3]} />
          <meshBasicMaterial map={numberTexture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, 1.48, -0.155]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.26, 0.3]} />
          <meshBasicMaterial map={numberTexture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.16, 1.66, 0.152]}>
          <circleGeometry args={[0.027, 20]} />
          <meshStandardMaterial color={gold} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.21, 1.54, 0.151]}>
          <planeGeometry args={[0.055, 0.085]} />
          <meshStandardMaterial color="#6e1e24" roughness={0.7} />
        </mesh>

        <Arm
          side={-1}
          lowQuality={lowQuality}
          shoulderRef={leftShoulder}
          elbowRef={leftElbow}
        />
        <Arm
          side={1}
          lowQuality={lowQuality}
          shoulderRef={rightShoulder}
          elbowRef={rightElbow}
        />
        <Head lowQuality={lowQuality} />
      </group>

      {/* Ball */}
      <group ref={ballRef} position={[0.54, 0.166, 0.38]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.18, lowQuality ? 20 : 32, lowQuality ? 14 : 24]} />
          <meshPhysicalMaterial
            map={ballTexture}
            roughness={0.42}
            metalness={0.08}
            clearcoat={0.38}
            clearcoatRoughness={0.28}
          />
        </mesh>
      </group>
    </group>
  )
}
