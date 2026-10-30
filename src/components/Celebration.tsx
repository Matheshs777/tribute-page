import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useSound } from '../context/SoundContext'
import { TUNNEL_CREDIT } from '../data/credits'
import { useDeviceProfile } from '../hooks/useDeviceProfile'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { CELEBRATION_DURATION_MS } from './hero/celebrationTiming'
import { SceneBoundary } from './SceneBoundary'
import { ArrowUpRight } from './ui/Icons'

const CelebrationCanvas = lazy(() => import('./celebration/CelebrationCanvas'))

const PARTICLE_COLORS = ['#f0d58a', '#c9a24b', '#f4f1e9', '#b5414b']

function CelebrationStill() {
  return (
    <div className="siuuu-still">
      <img
        src="/assets/images/cr7-celebration-2025.webp"
        alt="Cristiano Ronaldo celebrates a goal for Portugal during World Cup qualifying in September 2025."
        loading="lazy"
        decoding="async"
      />
      <span className="siuuu-still-mark display" aria-hidden="true">
        7
      </span>
      <span className="siuuu-still-note">Still frame · YantsImages</span>
    </div>
  )
}

export function Celebration() {
  const [celebrating, setCelebrating] = useState(false)
  const [burst, setBurst] = useState(0)
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const { enabled, toggleSound, playCrowd } = useSound()
  const { webgl, quality, isMobile } = useDeviceProfile()
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLElement>(
    { threshold: 0.01, rootMargin: '260px' },
    false,
  )

  useEffect(() => {
    if (inView) setMounted(true)
  }, [inView])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const particles = useMemo(() => {
    if (reduced) return []
    return Array.from({ length: 42 }, (_, index) => {
      const angle = (index / 42) * Math.PI * 2 + Math.random() * 0.5
      const distance = 120 + Math.random() * 360
      return {
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 40,
        size: 3 + Math.random() * 7,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.12,
        color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
      }
    })
  }, [burst, reduced])

  const fire = () => {
    setCount((current) => current + 1)
    setBurst((current) => current + 1)
    setCelebrating(true)
    if (enabled) playCrowd()

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(
      () => setCelebrating(false),
      CELEBRATION_DURATION_MS,
    )
  }

  return (
    <section
      ref={ref}
      id="siuuu"
      className={`siuuu ${celebrating ? 'is-celebrating' : ''}`}
      aria-labelledby="siuuu-title"
    >
      <div className="siuuu-bg" aria-hidden="true">
        <img src="/assets/images/stadium-tunnel.webp" alt="" loading="lazy" decoding="async" />
        <div className="siuuu-bg-shade" />
      </div>
      <a
        className="siuuu-bg-credit"
        href={TUNNEL_CREDIT.sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        Tunnel photograph · {TUNNEL_CREDIT.artist}
        <ArrowUpRight className="icon-xs" />
      </a>

      <div className="siuuu-flash" aria-hidden="true" />
      <div className="siuuu-particles" aria-hidden="true">
        {celebrating && particles.length ? (
          <div key={burst}>
            {particles.map((particle, index) => (
              <span
                key={index}
                style={
                  {
                    '--tx': `${particle.tx.toFixed(1)}px`,
                    '--ty': `${particle.ty.toFixed(1)}px`,
                    '--size': `${particle.size.toFixed(1)}px`,
                    '--rotate': `${particle.rotate.toFixed(1)}deg`,
                    '--delay': `${particle.delay.toFixed(2)}s`,
                    '--particle-color': particle.color,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="container siuuu-layout">
        <div className="siuuu-copy">
          <p className="eyebrow siuuu-eyebrow">
            <span className="status-dot" aria-hidden="true" />
            07 · The Moment
          </p>
          <h2 id="siuuu-title" className="siuuu-title display">
            Make the stadium
            <span>roar.</span>
          </h2>
          <p className="siuuu-lede">
            The leap, the turn, the landing. A private celebration became a global
            reflex — copied in playgrounds, parks and stadiums that had nothing to do
            with him. This one is for the noise.
          </p>

          <button
            type="button"
            className="siuuu-trigger"
            onClick={fire}
            aria-label="Trigger the SIUUU celebration"
          >
            <span className="siuuu-trigger-ring" aria-hidden="true" />
            <span className="siuuu-trigger-ring siuuu-trigger-ring-two" aria-hidden="true" />
            <span className="siuuu-trigger-label display">SIUUU</span>
            <span className="siuuu-trigger-hint">{celebrating ? 'Again' : 'Press'}</span>
          </button>

          <div className="siuuu-meta">
            <p className="siuuu-count">
              <span>{String(count).padStart(2, '0')}</span>
              Roars triggered
            </p>
            {enabled ? (
              <p className="siuuu-sound is-on">
                <span className="status-dot" aria-hidden="true" />
                Crowd and impact synthesised live in your browser
              </p>
            ) : (
              <p className="siuuu-sound">
                Sound is off.
                <button type="button" onClick={toggleSound}>
                  Enable ambience
                </button>
                for the full effect.
              </p>
            )}
          </div>

          <p className="siuuu-status" aria-live="polite">
            {celebrating
              ? 'The stadium answers. Hands clasped, chest forward, feet off the ground.'
              : count > 0
                ? `${count} ${count === 1 ? 'roar' : 'roars'} triggered. Go again.`
                : 'A fan ritual, rebuilt as an interactive moment. Press the button.'}
          </p>

          <p className="siuuu-note">
            Independent fan interpretation. No official choreography, footage or audio
            is used.
          </p>
        </div>

        <div className="siuuu-visual">
          <span className="siuuu-word display" aria-hidden="true">
            SIUUU
          </span>

          <div className="siuuu-stage">
            {webgl === false || isMobile ? (
              <CelebrationStill />
            ) : mounted ? (
              <SceneBoundary
                label="The celebration 3D scene"
                fallback={<CelebrationStill />}
              >
                <Suspense fallback={<CelebrationStill />}>
                  <CelebrationCanvas
                    celebrating={celebrating}
                    celebrationKey={count}
                    inView={inView}
                    quality={quality}
                    reduced={reduced}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              <div className="siuuu-stage-skeleton" aria-hidden="true" />
            )}

            <div className="siuuu-stage-frame" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="siuuu-stage-caption">
              <span className="eyebrow">The celebration · study 07</span>
              <span>{isMobile || webgl === false ? 'Archive still' : 'Real-time 3D'}</span>
            </div>
          </div>

          <p className="siuuu-visual-note">
            {celebrating
              ? 'ARE YOU WATCHING?'
              : 'The jump is rendered live. Turn the sound on and press.'}
          </p>
        </div>
      </div>
    </section>
  )
}
