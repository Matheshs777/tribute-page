import * as THREE from 'three'
import { CELEBRATION_DURATION_MS } from './celebrationTiming'

/**
 * Procedural posing for the Rigify-rigged Portugal athlete.
 *
 * The supplied GLB ships one 3.98 s clip, but that performance turns its back
 * to the camera, spins 180° and includes a backflip. The tribute needs the
 * front-on SIUUU from the reference image, so the deform skeleton is posed
 * directly instead of playing the clip.
 *
 * Each limb is "aimed": the bone is rotated so the vector from it to its child
 * bone points at a target world direction. The model is turned to face the
 * camera before these poses are built, so the directions below are written in
 * screen space:
 *
 *   +X = the athlete's left / screen right   (viewer facing the figure)
 *   +Y = up
 *   +Z = toward the camera
 *
 * Rotations are computed in the bone's parent space, so they work with the
 * Rigify rig's arbitrary bind axes.
 */

export const FIGURE_POSES = ['idle', 'pre', 'launch', 'apex', 'land', 'hold'] as const

export type FigurePose = (typeof FIGURE_POSES)[number]

type PoseRole =
  | 'spine1'
  | 'spine2'
  | 'spine3'
  | 'spine4'
  | 'neck'
  | 'head'
  | 'leftUpperArm'
  | 'leftForearm'
  | 'leftHand'
  | 'rightUpperArm'
  | 'rightForearm'
  | 'rightHand'
  | 'leftThigh'
  | 'leftShin'
  | 'leftFoot'
  | 'rightThigh'
  | 'rightShin'
  | 'rightFoot'

/**
 * Bone names are the sanitised Rigify deform names embedded in the GLB
 * (Sketchfab strips the dots: `DEF-upper_arm.L` becomes `DEF-upper_armL`).
 */
const RIG_BONES: Record<PoseRole, string> = {
  spine1: 'DEF-spine001_63',
  spine2: 'DEF-spine002_62',
  spine3: 'DEF-spine003_61',
  spine4: 'DEF-spine004_60',
  neck: 'DEF-spine005_59',
  head: 'DEF-spine006_58',
  leftUpperArm: 'DEF-upper_armL_305',
  leftForearm: 'DEF-forearmL_302',
  leftHand: 'DEF-handL_299',
  rightUpperArm: 'DEF-upper_armR_435',
  rightForearm: 'DEF-forearmR_432',
  rightHand: 'DEF-handR_429',
  leftThigh: 'DEF-thighL_132',
  leftShin: 'DEF-shinL_129',
  leftFoot: 'DEF-footL_126',
  rightThigh: 'DEF-thighR_153',
  rightShin: 'DEF-shinR_150',
  rightFoot: 'DEF-footR_147',
}

/**
 * These roles are enough to build every pose. The remaining roles are optional
 * so a slightly different Rigify export still animates instead of falling back
 * to the procedural figure.
 */
const REQUIRED_ROLES: PoseRole[] = [
  'spine1',
  'spine2',
  'spine3',
  'neck',
  'head',
  'leftUpperArm',
  'leftForearm',
  'rightUpperArm',
  'rightForearm',
  'leftThigh',
  'leftShin',
  'rightThigh',
  'rightShin',
]

type PoseSpec = {
  /** Rotations around the screen-space X axis, applied before the aims. */
  arch?: [PoseRole, number][]
  aims?: [PoseRole, [number, number, number]][]
}

const POSE_SPECS: Record<FigurePose, PoseSpec> = {
  /**
   * Relaxed standing pose. Arms hang naturally with a slight outward flare and
   * a soft elbow bend; legs stay close to the bind stance.
   */
  idle: {
    aims: [
      ['leftUpperArm', [0.16, -0.98, 0.03]],
      ['leftForearm', [0.07, -0.995, 0.04]],
      ['rightUpperArm', [-0.16, -0.98, 0.03]],
      ['rightForearm', [-0.07, -0.995, 0.04]],
      ['leftThigh', [0.04, -0.999, 0.01]],
      ['leftShin', [0.02, -0.999, 0.02]],
      ['rightThigh', [-0.04, -0.999, 0.01]],
      ['rightShin', [-0.02, -0.999, 0.02]],
    ],
  },

  /**
   * Wind-up: a shallow crouch, arms swept back and knees loaded, ready to
   * launch.
   */
  pre: {
    arch: [
      ['spine1', 0.04],
      ['spine2', 0.05],
      ['spine3', 0.03],
    ],
    aims: [
      ['leftUpperArm', [0.24, -0.93, -0.18]],
      ['leftForearm', [0.12, -0.97, -0.12]],
      ['rightUpperArm', [-0.24, -0.93, -0.18]],
      ['rightForearm', [-0.12, -0.97, -0.12]],
      ['leftThigh', [0.18, -0.96, 0.18]],
      ['leftShin', [0.12, -0.98, -0.16]],
      ['rightThigh', [-0.18, -0.96, 0.18]],
      ['rightShin', [-0.12, -0.98, -0.16]],
    ],
  },

  /**
   * Take-off: the body extends, the arms sweep out and up, and the legs begin
   * to spread. The group lift is applied by the celebration timeline.
   */
  launch: {
    arch: [
      ['spine1', -0.02],
      ['spine2', -0.03],
      ['spine3', -0.02],
      ['neck', 0.04],
      ['head', 0.03],
    ],
    aims: [
      ['leftUpperArm', [0.6, 0.79, 0.1]],
      ['leftForearm', [0.22, 0.97, 0.06]],
      ['rightUpperArm', [-0.6, 0.79, 0.1]],
      ['rightForearm', [-0.22, 0.97, 0.06]],
      ['leftThigh', [0.24, -0.96, 0.1]],
      ['leftShin', [0.18, -0.98, -0.06]],
      ['rightThigh', [-0.24, -0.96, 0.1]],
      ['rightShin', [-0.18, -0.98, -0.06]],
    ],
  },

  /**
   * The reference pose: hands pressed together overhead, chest forward, face
   * to camera, legs in a wide V with softly bent knees and both feet airborne.
   */
  apex: {
    arch: [
      ['spine1', -0.05],
      ['spine2', -0.06],
      ['spine3', -0.06],
      ['spine4', -0.04],
      ['neck', 0.1],
      ['head', 0.08],
    ],
    aims: [
      ['leftUpperArm', [0.16, 0.987, 0.02]],
      ['leftForearm', [-0.52, 0.854, 0.04]],
      ['rightUpperArm', [-0.16, 0.987, 0.02]],
      ['rightForearm', [0.52, 0.854, 0.04]],
      ['leftThigh', [0.5, -0.855, 0.14]],
      ['leftShin', [0.42, -0.897, -0.14]],
      ['rightThigh', [-0.5, -0.855, 0.14]],
      ['rightShin', [-0.42, -0.897, -0.14]],
    ],
  },

  /**
   * Landing: knees absorb the drop, feet plant wide, arms come out for balance.
   * The group offset is measured from the posed feet so the boots touch the
   * stage.
   */
  land: {
    arch: [
      ['spine1', -0.03],
      ['spine2', -0.04],
      ['spine3', -0.03],
      ['neck', 0.06],
      ['head', 0.05],
    ],
    aims: [
      ['leftUpperArm', [0.42, -0.9, 0.12]],
      ['leftForearm', [0.28, -0.955, 0.08]],
      ['rightUpperArm', [-0.42, -0.9, 0.12]],
      ['rightForearm', [-0.28, -0.955, 0.08]],
      ['leftThigh', [0.48, -0.87, 0.12]],
      ['leftShin', [0.42, -0.9, -0.12]],
      ['rightThigh', [-0.48, -0.87, 0.12]],
      ['rightShin', [-0.42, -0.9, -0.12]],
    ],
  },

  /**
   * Recovery: upright and proud, arms easing back down, ready to blend into
   * the idle stance.
   */
  hold: {
    arch: [
      ['spine1', -0.02],
      ['spine2', -0.03],
      ['spine3', -0.02],
      ['neck', 0.04],
      ['head', 0.03],
    ],
    aims: [
      ['leftUpperArm', [0.52, -0.84, 0.12]],
      ['leftForearm', [0.3, -0.95, 0.08]],
      ['rightUpperArm', [-0.52, -0.84, 0.12]],
      ['rightForearm', [-0.3, -0.95, 0.08]],
      ['leftThigh', [0.14, -0.99, 0.02]],
      ['leftShin', [0.08, -0.996, 0]],
      ['rightThigh', [-0.14, -0.99, 0.02]],
      ['rightShin', [-0.08, -0.996, 0]],
    ],
  },
}

export type RigPose = {
  bones: THREE.Bone[]
  targets: Record<FigurePose, Map<string, THREE.Quaternion>>
}

const _boneWorldPos = new THREE.Vector3()
const _childWorldPos = new THREE.Vector3()
const _boneDir = new THREE.Vector3()
const _desiredDir = new THREE.Vector3()
const _worldRotation = new THREE.Quaternion()
const _parentRotation = new THREE.Quaternion()
const _localRotation = new THREE.Quaternion()
const _scratch = new THREE.Vector3()
const _worldAxisX = new THREE.Vector3(1, 0, 0)

/**
 * Rotate a bone around a world-space axis. Used for the spine arch, where the
 * exact local bind axes of the Rigify skeleton are not meaningful.
 */
function rotateBoneWorldX(bone: THREE.Bone, angle: number) {
  if (!bone.parent) return
  bone.parent.matrixWorld.decompose(_scratch, _parentRotation, _scratch)
  _worldRotation.setFromAxisAngle(_worldAxisX, angle)
  _localRotation
    .copy(_parentRotation)
    .invert()
    .multiply(_worldRotation)
    .multiply(_parentRotation)
  bone.quaternion.premultiply(_localRotation)
}

function aimBone(bone: THREE.Bone, target: [number, number, number]) {
  const child = bone.children.find((entry) => (entry as THREE.Bone).isBone)
  if (!child || !bone.parent) return

  _boneWorldPos.setFromMatrixPosition(bone.matrixWorld)
  _childWorldPos.setFromMatrixPosition(child.matrixWorld)
  _boneDir.copy(_childWorldPos).sub(_boneWorldPos)
  if (_boneDir.lengthSq() < 1e-10) return
  _boneDir.normalize()

  _desiredDir.set(target[0], target[1], target[2]).normalize()
  if (_boneDir.dot(_desiredDir) > 0.99995) return

  _worldRotation.setFromUnitVectors(_boneDir, _desiredDir)
  bone.parent.matrixWorld.decompose(_scratch, _parentRotation, _scratch)

  // qLocal' = parent⁻¹ · worldDelta · parent · qLocal
  _localRotation
    .copy(_parentRotation)
    .invert()
    .multiply(_worldRotation)
    .multiply(_parentRotation)
  bone.quaternion.premultiply(_localRotation)
}

export function buildRigPose(root: THREE.Object3D): RigPose | null {
  root.updateMatrixWorld(true)

  const byName = new Map<string, THREE.Bone>()
  root.traverse((object) => {
    if ((object as THREE.Bone).isBone) byName.set(object.name, object as THREE.Bone)
  })

  const byRole = new Map<PoseRole, THREE.Bone>()
  for (const [role, name] of Object.entries(RIG_BONES) as [PoseRole, string][]) {
    const bone = byName.get(name)
    if (bone) byRole.set(role, bone)
  }

  if (REQUIRED_ROLES.some((role) => !byRole.has(role))) return null

  const bones = [...byRole.values()]
  const rest = new Map<string, THREE.Quaternion>()
  bones.forEach((bone) => rest.set(bone.uuid, bone.quaternion.clone()))

  const reset = () => {
    bones.forEach((bone) => bone.quaternion.copy(rest.get(bone.uuid)!))
  }

  const targets = {} as Record<FigurePose, Map<string, THREE.Quaternion>>

  for (const pose of FIGURE_POSES) {
    reset()
    root.updateMatrixWorld(true)

    const targetMap = new Map(rest)
    const spec = POSE_SPECS[pose]

    for (const [role, angle] of spec.arch ?? []) {
      const bone = byRole.get(role)
      if (!bone) continue
      rotateBoneWorldX(bone, angle)
      root.updateMatrixWorld(true)
      targetMap.set(bone.uuid, bone.quaternion.clone())
    }

    for (const [role, direction] of spec.aims ?? []) {
      const bone = byRole.get(role)
      if (!bone) continue
      aimBone(bone, direction)
      root.updateMatrixWorld(true)
      targetMap.set(bone.uuid, bone.quaternion.clone())
    }

    targets[pose] = targetMap
  }

  reset()
  root.updateMatrixWorld(true)

  // Mount in the idle stance so the very first rendered frame is never the raw
  // bind pose. The component then blends between targets at runtime.
  bones.forEach((bone) => {
    const target = targets.idle.get(bone.uuid)
    if (target) bone.quaternion.copy(target)
  })
  root.updateMatrixWorld(true)

  return { bones, targets }
}

type TimelineKey = {
  at: number
  pose: FigurePose
  /** Height above the grounded pose, in scene units. */
  lift: number
}

/**
 * A single celebration. The group's Y is the interpolated ground offset for
 * the current pose plus this lift, so the feet plant cleanly at the start, on
 * landing and at the end while the apex reads as a genuine jump.
 */
const CELEBRATION_TIMELINE: TimelineKey[] = [
  { at: 0, pose: 'idle', lift: 0 },
  { at: 240, pose: 'pre', lift: 0 },
  { at: 480, pose: 'launch', lift: 0.1 },
  { at: 760, pose: 'apex', lift: 0.58 },
  { at: 1750, pose: 'apex', lift: 0.58 },
  { at: 2100, pose: 'land', lift: 0 },
  { at: 2450, pose: 'hold', lift: 0 },
  { at: 2900, pose: 'idle', lift: 0 },
  { at: CELEBRATION_DURATION_MS, pose: 'idle', lift: 0 },
]

export type CelebrationSample = {
  pose: FigurePose
  /** Target Y for the model group, including the grounded pose offset. */
  y: number
}

/**
 * Sample the celebration timeline. `groundOffsets` is measured from the posed
 * mesh at load time (see RonaldoModel), which keeps the boots on the stage
 * instead of relying on a hard-coded offset for every pose.
 */
export function sampleCelebration(
  phaseMs: number,
  groundOffsets: Record<FigurePose, number>,
): CelebrationSample {
  const t = THREE.MathUtils.clamp(phaseMs, 0, CELEBRATION_DURATION_MS)

  let index = 0
  while (
    index < CELEBRATION_TIMELINE.length - 2 &&
    t >= CELEBRATION_TIMELINE[index + 1].at
  ) {
    index += 1
  }

  const from = CELEBRATION_TIMELINE[index]
  const to = CELEBRATION_TIMELINE[index + 1] ?? from
  const span = Math.max(1, to.at - from.at)
  const raw = THREE.MathUtils.clamp((t - from.at) / span, 0, 1)
  const eased = raw * raw * (3 - 2 * raw)

  const ground = THREE.MathUtils.lerp(
    groundOffsets[from.pose],
    groundOffsets[to.pose],
    eased,
  )
  const lift = THREE.MathUtils.lerp(from.lift, to.lift, eased)

  return { pose: to.pose, y: ground + lift }
}
