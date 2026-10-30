# 3D models in this project

Both runtime models are community uploads used under **CC BY 4.0**. Their
attribution (author, licence, source) lives in `src/data/credits.ts` and renders
in the site footer; anyone redistributing this project must keep those credits.

| File | Used by | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `cristiano-ronaldo.glb` | Hero + SIUUU celebration athlete | [Sketchfab — “cristiano ronaldo”](https://sketchfab.com/3d-models/cristiano-ronaldo-710d1b01b0624135861feb3f0bb7048a) | aleganda | CC BY 4.0 |
| `ballon-dor.glb` | Ballon d’Or trophy exhibit | [Sketchfab — “Ballon D'or”](https://sketchfab.com/3d-models/ballon-dor-87088ae6bebf49fc9b3ab4881b926e73) | MirAl00 | CC BY 4.0 |

## What the loaders do

The two GLB files are standard glTF 2.0 (no Draco, no required extensions), so
drei's `useGLTF` handles them directly.

**`cristiano-ronaldo.glb`** (`src/components/hero/RonaldoModel.tsx`) is detected
at runtime via a `HEAD` request, so removing the file silently restores the
original procedural athlete. The model is skinned (435-bone Rigify deform rig,
including fingers and eyes), and the loader normalises it using **posed vertex
bounds** rather than raw geometry, so it is scaled to 1.95 scene units, centred,
and grounded at Y = 0. The Sketchfab export faces −Z, so it is rotated 180° to
face the camera. If bounds or scale are unusable the error boundary restores the
procedural figure.

The GLB embeds its original Portugal kit, gold boots, face and eye textures.
The face map is already open-mouthed, so no derived texture or material swap is
used.

### Posing and the celebration timeline

The GLB includes one 3.98 s animation, but that clip turns the figure away from
the camera, spins 180° and contains a backflip. It is not played. Instead
`src/components/hero/skeletonPose.ts` poses the Rigify deform bones directly
through six targets:

| Pose | Purpose |
| --- | --- |
| `idle` | Relaxed hero stance, arms hanging with a soft elbow bend |
| `pre` | Crouched wind-up with the arms swept back |
| `launch` | Body extended, arms sweeping overhead, legs starting to spread |
| `apex` | Reference SIUUU: hands pressed together overhead, chest forward, face to camera, wide V legs, both feet airborne |
| `land` | Wide, knees-bent landing with arms out for balance |
| `hold` | Upright recovery before blending back to idle |

The celebration timeline runs for **3.6 s** (`celebrationTiming.ts`), shared by
the UI timer and the 3D sampler. The loader measures the lowest vertex of every
pose once, so the boots plant cleanly at the start, on landing and at rest; the
model group then lifts 0.58 scene units at the apex. The group is never left in
the bind pose: `buildRigPose` mounts the idle target immediately, and the
component blends between targets every frame.

Bone names are the sanitised Rigify deform names embedded in the GLB (Sketchfab
strips the dots, so `DEF-upper_arm.L` becomes `DEF-upper_armL`). The exact map
lives in `skeletonPose.ts`. If a replacement rig does not expose those deform
bones, the loader throws and the procedural athlete is used instead.

**`ballon-dor.glb`** (`src/components/trophies/TrophyModels.tsx`) is loaded with
`useGLTF` when the Ballon d’Or exhibit is active. The upload includes a large
black display backdrop, so the loader hides any single mesh that dwarfs the
rest, then normalises the trophy itself to 1.2 scene units and grounds it; the
procedural form is the loading and error fallback.

## Swapping either model

- `cristiano-ronaldo.glb`: replace the file, or set `VITE_CR7_MODEL_URL` in
  `.env.local` to any reachable GLB (skips the runtime probe). A replacement with
  a different native facing needs `MODEL_FACING_OFFSET` in `RonaldoModel.tsx`
  adjusted; a different skeleton needs the role map in `skeletonPose.ts` updated.
- `ballon-dor.glb`: replace the file at the same path (update `BALLON_MODEL_URL`
  in `TrophyModels.tsx` if you rename it).

Recommended export shape for either file: GLB 2.0, Y-up, facing +Z, real-world
scale in metres, feet/base at Y = 0, textures WebP/KTX2, ≤ ~80k triangles for
the hero. Only use models you are licensed to use — and keep CC BY attribution.
