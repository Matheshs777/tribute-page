# CR7 — THE LEGEND

An independent, cinematic 3D tribute to Cristiano Ronaldo: career, records, trophies, mindset and the moments that defined an era.

> **Not an official website.** This is a non-commercial fan project. It is not affiliated with, endorsed by, or sponsored by Cristiano Ronaldo, his representatives, any club, league, federation, or governing body. Photographs are used under their respective licences and credited in the interface. The 3D athlete and Ballon d'Or exhibit are community-made CC BY 4.0 models credited in the footer; every other trophy form is an original abstract interpretation. Nothing here is an official replica.

---

## Quick start

Requirements: **Node.js 20+** and npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build and preview:

```bash
npm run typecheck  # TypeScript project build, no emit
npm run build      # tsc -b + vite build -> dist/
npm run preview    # serve dist/ locally
```

Other scripts:

```bash
npm run assets:optimize   # rebuild public/assets/images + OG card from .raw-assets/
```

No environment variables are required. See [3D model integration](#3d-model-integration) for the optional `VITE_CR7_MODEL_URL`.

---

## The experience

| Section | What it does |
| --- | --- |
| **Boot + intro** | Bounded asset/font preload, then a short cinematic title sequence with a visible **Skip intro** control. The intro is limited to the first load per browser session and is skipped entirely under reduced motion. |
| **Hero — The Legend** | Full-viewport R3F scene: community CC BY 4.0 athlete model (`cristiano-ronaldo.glb`), stadium atmosphere, volumetric-style lighting and dust. Live career headline figures. The procedural figure remains the automatic fallback if the GLB is missing or invalid. |
| **Journey** | Seven sourced career chapters. Desktop uses a GSAP ScrollTrigger-pinned horizontal track; tablet/mobile becomes a vertical editorial stack. Chapter jumps work in both layouts. |
| **Trophy Room** | 3D exhibit viewer with six curated honours. The Ballon d'Or exhibit uses a community CC BY 4.0 model; the rest are original procedural forms. Clearly labelled as a curated room, not a full cabinet. |
| **Numbers** | Animated counters, goals by club, goals by year and career milestones, all with a reference date and source note. |
| **Mindset** | Editorial reading of the career's recurring principles, explicitly framed as interpretation rather than quotation. |
| **Moments** | Filterable editorial gallery with accessible lightbox, keyboard navigation and focus restoration. |
| **SIUUU** | Interactive 3D celebration and particle burst on desktop; an archive still on mobile to keep GPU cost down. Synthesised crowd/impact audio only after an explicit user action. |
| **Legacy / footer** | Interactive road-to-1,000 tracker with animated goal count, bar, marker and percentage, sources, full photography + 3D model credits, method/disclaimer, official links, replay intro and back-to-top. |

---

## Stack

- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Three.js** with **React Three Fiber 9** and **Drei**
- **GSAP + ScrollTrigger** for the pinned timeline and intro
- **Motion for React** (`motion/react`) for the hero entrance, scroll reveals, image parallax and the spring-driven 1,000-goal tracker
- **Lenis** for smooth scrolling (disabled under reduced motion)
- **Tailwind CSS 3** base/utilities plus modular hand-written CSS
- **Sharp** (dev only) for the asset pipeline
- Local **Anton** and **Manrope Variable** font packages — no third-party font requests

---

## Project structure

```text
.
├── public/
│   ├── assets/
│   │   ├── images/              # 18 optimised WebP photographs
│   │   └── og-cr7.jpg           # generated social card
│   ├── models/
│   │   ├── README.md            # GLB contract
│   │   └── .gitkeep
│   └── favicon.svg
├── scripts/
│   └── optimize-assets.mjs      # .raw-assets -> WebP + OG card
├── src/
│   ├── components/
│   │   ├── hero/                # HeroCanvas, HeroScene, ProceduralAthlete,
│   │   │                        # RonaldoModel, LightingRig, StadiumEnvironment,
│   │   │                        # textures
│   │   ├── trophies/            # TrophyCanvas, TrophyModels
│   │   ├── celebration/         # CelebrationCanvas
│   │   ├── ui/                  # Counter, Dialog, Icons, Reveal, SectionHeading
│   │   ├── App sections…        # Hero, Journey, TrophyRoom, Numbers, Mindset,
│   │   │                        # Moments, Celebration, Footer, Navigation,
│   │   │                        # CinematicIntro, LoadingScreen
│   │   └── SceneBoundary.tsx    # WebGL/error boundary
│   ├── context/SoundContext.tsx # Web Audio, opt-in only
│   ├── data/                    # site, career, stats, trophies, moments, credits
│   ├── hooks/                   # device profile, media query, reduced motion,
│   │                            # in-view, smooth scroll
│   ├── styles/                  # modular CSS imported after Tailwind
│   ├── App.tsx                  # boot gate + intro sequencing
│   ├── index.css                # Tailwind directives
│   └── main.tsx                 # fonts + styles + render
├── .env.example
├── index.html
├── tailwind.config.ts
├── tsconfig*.json
└── vite.config.ts
```

### Data is the single source of truth

Career chapters, statistics, trophy exhibits, moments and photo credits live in `src/data/`. Components read from those files. The career-goal total is a single exported constant (`CAREER_GOALS`) shared by the hero, Numbers, Trophy Room and footer. The 1,000-goal target, remaining total and percentage are derived from the same file, so the displayed figures cannot drift between sections.

---

## Data, sources and dates

Figures were checked against public records and are dated in the interface:

- **Career statistics:** 23 October 2026
  - 985 senior goals (requested display figure, reported 29 October 2026; club and international split dated 23 October 2026)
  - 1,342 senior appearances
  - 291 assists
  - 234 Portugal caps
  - 140 UEFA Champions League goals
  - 5 Ballon d'Or awards
- **Trophy totals:** 9 September 2026
  - 35 senior team trophies
  - 8 domestic league titles

Sources linked in the footer and data files:

- Wikipedia — [Cristiano Ronaldo career statistics](https://en.wikipedia.org/wiki/Cristiano_Ronaldo)
- Wikipedia — [List of career achievements](https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo)
- [UEFA — international scoring record](https://www.uefa.com/euro2024/news/026a-1297500e1b34-a17bbbcad258-1000--cristiano-ronaldo-all-time-leading-scorer-in-men-s-internationa/)
- [Opta Analyst — international career](https://theanalyst.com/players/13574/cristiano-ronaldo/national/career)
- [ESPN — road to 1,000 goals](https://www.espn.com/football/story/_/id/46751020/cristiano-ronaldo-goal-tracker-road-1000-career-goals)
- [Fabrizio Romano — 985 career goals, 29 October 2026](https://x.com/FabrizioRomano/status/2115892342003507326)

The six trophy exhibits are a **curated selection**, not a complete cabinet. The room states this in the interface. Individual honours (Ballon d'Or, scoring records) are deliberately separated from the 35 senior team trophies.

No quotes are invented. The Mindset section is labelled as editorial interpretation.

---

## 3D model integration

Two community GLB models ship with the project under **CC BY 4.0**, with author,
licence and source embedded in the files and credited in the footer:

| Model | File | Used in |
| --- | --- | --- |
| “cristiano ronaldo” athlete (aleganda) | `public/models/cristiano-ronaldo.glb` | Hero figure + SIUUU celebration stage |
| “Ballon D'or” trophy (MirAl00) | `public/models/ballon-dor.glb` | Ballon d'Or exhibit in the trophy room |

Both are standard glTF 2.0 (no Draco required). See [`public/models/README.md`](public/models/README.md) for integration details.

The athlete GLB embeds its original Portugal kit, gold boots, face and eye
textures. Its face map is already open-mouthed, so the celebration uses the
model's own materials rather than a derived texture.

### How the athlete loads

1. On load the app sends a `HEAD` request to `/models/cristiano-ronaldo.glb` (skipped when `VITE_CR7_MODEL_URL` is set).
2. If the response is OK and looks like a model (`gltf`, `model`, `octet-stream`, or `Content-Length > 10 KB`), `RonaldoModel` loads it with Drei's `useGLTF`.
3. The loader measures **posed vertex bounds** (skeleton-aware, so bind poses with large joint translations are handled), scales the figure to 1.95 scene units, centres it and grounds it at Y = 0. It also rotates the export 180° to face the camera.
4. If loading fails or bounds/scale are unusable, the error boundary and Suspense fallback restore the procedural figure.
5. The GLB ships a 435-bone Rigify deform rig and one 3.98 s animation. That clip turns the figure away from the camera and includes a backflip, so the site does not play it. Instead, `skeletonPose.ts` poses the deform bones through six targets — `idle`, `pre`, `launch`, `apex`, `land` and `hold` — and the celebration timeline blends them over 3.6 s. The loader measures each pose's lowest vertex once so the boots plant cleanly at the start, on landing and at rest, while the group lifts 0.58 units at the apex. The original materials, kit and textures are untouched.
6. If the rig's expected deform bones are missing, the loader throws and the procedural figure is used. The model is never left in its bind pose.

### Optional explicit URL

```bash
# .env.local
VITE_CR7_MODEL_URL=/models/cristiano-ronaldo.glb
```

When this is set, the runtime probe is skipped and the URL is loaded directly.

### Swapping models

Replace either file at the same path (or point `VITE_CR7_MODEL_URL` at another GLB). Recommended export shape: GLB 2.0, Y-up, facing +Z, real-world scale in metres, feet/base at Y = 0, ≤ ~80k triangles for the hero. The athlete pose engine expects the sanitised Rigify deform names listed in `skeletonPose.ts`; adjust `MODEL_FACING_OFFSET` in `RonaldoModel.tsx` if a replacement is authored facing another direction. CC BY 4.0 credit must be kept for any community model you redistribute.

---

## Asset structure and photography

All photographs in `public/assets/images/` are Wikimedia Commons files that were cropped, resized and converted to WebP. The originals are kept in `.raw-assets/` (excluded from git) so the pipeline is reproducible:

```bash
npm run assets:optimize
```

That script reads `.raw-assets/`, writes 1600 px-wide WebP files to `public/assets/images/`, and regenerates `public/assets/og-cr7.jpg` from the Portugal 2016 photograph. It is destructive for the images directory — confirm `.raw-assets/` is complete before running.

### Photo credits

| Photograph(s) | Credit | Licence |
| --- | --- | --- |
| Alvalade stadium | Vitor Oliveira | CC BY-SA 2.0 |
| Man Utd 2008 | Tsutomu Takasu / gowestphoto | CC BY 2.0 |
| Real Madrid action, 2010 portrait | Dagur Brynjólfsson | CC BY-SA 2.0 |
| Ballon d'Or | Anish Morarji | CC BY 2.0 |
| Euro 2016 | Chensiyuan | CC BY-SA 4.0 |
| Juventus 2019 | IamAlwaysHere / derivative by Danyele | CC BY-SA 4.0 |
| Man Utd 2021 | Ardfern | CC BY-SA 4.0 |
| Al Nassr 2023 | Meghdad Madadi | CC BY 4.0 |
| Celebration 2025 | YantsImages | CC BY-SA 4.0 |
| Portugal 2026 | Bryan Berlin | CC BY-SA 4.0 |
| Euro 2012 training | Roger Gorączniak | CC BY 3.0 |
| Stamford Bridge tunnel | Nate Loper | CC BY 2.0 |
| Wembley floodlights | Chris Downer | CC BY-SA 2.0 |

Each source page is linked from the footer credits and from the relevant chapter/gallery item. CC BY-SA derivatives remain subject to ShareAlike; check each source page before redistributing.

### 3D model credits

| Model | Credit | Licence |
| --- | --- | --- |
| “cristiano ronaldo” athlete | aleganda (Sketchfab) | CC BY 4.0 |
| “Ballon D'or” trophy | MirAl00 (Sketchfab) | CC BY 4.0 |

The athlete is fully rigged — a 435-bone Rigify deform skeleton with finger and
eye bones — and the site poses it in code; its single baked clip is not used.
The face map is already open-mouthed. A dedicated facial rig (jaw/blendshapes)
and purpose-made animation clips remain the main 3D assets still missing.

### Assets still needed for a fully licensed production

1. **Officially licensed Carrasco/FIFA Ballon d'Or trophy assets or marks** — the exhibit form is a fan-made CC BY 4.0 model, and the remaining five forms are original abstract interpretations; nothing here is an official replica.
2. **Animation clips and a facial rig for the athlete** (`Idle`, `Siuuu`/celebration, jaw/blendshapes) — the current figure is posed in code from its deform skeleton and uses its original open-mouth face map.
3. **Optional licensed match footage or a hero film** — the current hero and chapter visuals are stills plus real-time 3D.
4. **Optional licensed ambient audio/commentary** — the current soundtrack is synthesised in the browser and starts only after user interaction.
5. **Any official marks, crests, kits or competition branding** — intentionally absent; only add with written permission.
6. **A licensee-reviewed likeness write-up** — the athlete GLB is a community fan model; if this site is ever used commercially, verify the model's provenance and any likeness/rights constraints.
7. **Additional high-resolution editorial photography** — the 18 Commons images are sufficient for the current build; more would deepen the archive.

Unused but already downloaded photographs (`cr7-boots`, `cr7-madrid-back`, `cr7-man-utd-celebration`, `cr7-real-madrid-2010`, `cr7-world-cup-2018`) are listed in `src/data/credits.ts` for future chapters.

---

## Accessibility, motion and performance

- Visible skip link, landmark structure, one `<h1>`, labelled sections and controls.
- Accessible modal lightbox: focus trap, Escape/arrow keys, focus returned to the originating card; mobile menu does the same.
- `prefers-reduced-motion`: no intro, no Lenis smooth scroll, no pinned horizontal timeline, no counters animation, no particle bursts; content is immediately visible.
- WebGL detection with `failIfMajorPerformanceCaveat`, per-scene error boundaries and static fallbacks for hero, trophy room and celebration.
- Hero, trophy and celebration canvases are lazy-loaded; trophy/celebration mount only near the viewport; each uses a demand frameloop where possible.
- Device profile caps DPR (1.4 low / 1.8 high), lowers shadow and environment quality on mobile, tablets, low-memory or Save-Data devices.
- All photography loads lazily except the preloaded hero still; fonts are self-hosted; no analytics, cookies or third-party runtime requests.
- Session storage uses one key, `cr7-intro-seen-v1`, solely to avoid replaying the intro on every reload.

---

## Verification

The final build was validated with:

```bash
npm run typecheck
npm run build
```

Manual Playwright QA covered: intro/skip, hero counters, pinned timeline and chapter jumps, trophy switching, animated numbers, gallery filtering/lightbox/keyboard/focus restore, SIUUU interaction, audio toggle, mobile menu, footer details, nav landing offsets, reduced-motion mode, WebGL-disabled fallbacks, and no horizontal overflow at 1440/1280/1024/768/390/360 px.

There is no automated test runner in this repository; Playwright was used as an external QA harness.

---

## Licence and attribution

Original code and design: fan project by the repository author. Third-party libraries retain their own licences. Photography is credited above and in the site footer. “Cristiano Ronaldo”, “CR7”, club names and competition names are used descriptively; no official association is implied.
