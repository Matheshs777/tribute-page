import { lazy, Suspense } from 'react'
import { m, type Variants } from 'motion/react'
import { CAREER_GOALS, CAREER_GOALS_DATE_SHORT } from '../data/stats'
import { useDeviceProfile } from '../hooks/useDeviceProfile'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollToTarget } from '../hooks/useSmoothScroll'
import { SceneBoundary } from './SceneBoundary'
import { Counter } from './ui/Counter'
import { ArrowDown, ArrowRight } from './ui/Icons'

const HeroCanvas = lazy(() => import('./hero/HeroCanvas'))

const HERO_STATS = [
  { value: CAREER_GOALS, label: 'Career goals', note: 'Club and country' },
  { value: 1342, label: 'Appearances', note: 'Senior football', format: 'comma' as const },
  { value: 146, label: 'Portugal goals', note: 'Men’s record' },
  { value: 5, label: 'Ballon d’Or', note: '2008 – 2017' },
]

const heroSequence: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

function HeroStill() {
  return (
    <div className="hero-still" aria-hidden="true">
      <img
        src="/assets/images/cr7-real-madrid-action.webp"
        alt=""
        width={960}
        height={1280}
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-still-shade" />
    </div>
  )
}

export function Hero({ revealed }: { revealed: boolean }) {
  const { webgl, quality, isMobile } = useDeviceProfile()
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLElement>(
    { threshold: 0.01, rootMargin: '120px' },
    false,
  )
  const entrance = reduced || revealed ? 'show' : 'hidden'

  return (
    <section ref={ref} id="legacy" className="hero" aria-labelledby="hero-title">
      <div className="hero-stage">
        {webgl === false ? (
          <HeroStill />
        ) : webgl ? (
          <SceneBoundary label="The hero 3D scene" fallback={<HeroStill />}>
            <Suspense fallback={<div className="hero-stage-skeleton" aria-hidden="true" />}>
              <HeroCanvas
                quality={quality}
                isMobile={isMobile}
                reduced={reduced}
                revealed={revealed}
                active={inView}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          <div className="hero-stage-skeleton" aria-hidden="true" />
        )}
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-scanline" aria-hidden="true" />
      </div>

      <div className="hero-rail hero-rail-left" aria-hidden="true">
        <span>Independent tribute</span>
        <span className="hero-rail-line" />
        <span>MMXXVI</span>
      </div>

      <div className="hero-rail hero-rail-right" aria-hidden="true">
        <span className="hero-rail-vertical">Scroll to witness</span>
        <span className="hero-rail-line" />
      </div>

      <m.div
        className="container hero-inner"
        variants={heroSequence}
        initial={reduced ? false : 'hidden'}
        animate={entrance}
      >
        <m.div className="hero-copy" variants={heroSequence}>
          <m.p className="hero-eyebrow" variants={heroItem}>
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            Madeira, 1985 <span className="hero-eyebrow-sep">/</span> An independent 3D tribute
          </m.p>

          <m.h1 id="hero-title" className="hero-title display" variants={heroItem}>
            <span className="hero-title-line">One name.</span>
            <span className="hero-title-line hero-title-outline">One legacy.</span>
          </m.h1>

          <m.p className="hero-support" variants={heroItem}>
            Cristiano Ronaldo — A Legacy Beyond Limits.
          </m.p>

          <m.div className="hero-lede" variants={heroItem}>
            <span className="hero-lede-mark display">7</span>
            <div>
              <p className="hero-lede-body">
                Twenty-four years at the top. Five Ballons d’Or. {CAREER_GOALS} senior
                goals. A career built not on talent alone, but on the refusal to settle.
              </p>
            </div>
          </m.div>

          <m.div className="hero-actions" variants={heroItem}>
            <button
              type="button"
              className="button button-primary"
              onClick={() => scrollToTarget('#journey')}
            >
              EXPLORE THE JOURNEY
              <ArrowRight className="icon-sm" />
            </button>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => scrollToTarget('#numbers')}
            >
              The numbers
            </button>
          </m.div>
        </m.div>

        <m.div className="hero-model-tag" variants={heroItem}>
          <span className="status-dot" aria-hidden="true" />
          <span>
            Community 3D figure
            <span className="hero-model-tag-sub">CC BY 4.0 · credited below</span>
          </span>
        </m.div>

        <m.div className="hero-bottom" variants={heroItem}>
          <dl className="hero-stats">
            {HERO_STATS.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <dd className="hero-stat-value display">
                  <Counter
                    value={stat.value}
                    format={stat.format}
                    label={stat.label}
                    duration={1900}
                  />
                </dd>
                <dt className="hero-stat-label">{stat.label}</dt>
                <span className="hero-stat-note">{stat.note}</span>
              </div>
            ))}
          </dl>
          <div className="hero-bottom-side">
            <p className="hero-verified">
              Goal figure
              <br />
              {CAREER_GOALS_DATE_SHORT}
            </p>
            <button
              type="button"
              className="hero-scroll"
              onClick={() => scrollToTarget('#journey')}
              aria-label="Scroll to the journey"
            >
              <span className="hero-scroll-circle">
                <ArrowDown className="icon-sm" />
              </span>
              <span className="hero-scroll-text">Scroll</span>
            </button>
          </div>
        </m.div>
      </m.div>
    </section>
  )
}
