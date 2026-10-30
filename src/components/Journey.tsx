import { useEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CAREER_CHAPTERS } from '../data/career'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollToTarget } from '../hooks/useSmoothScroll'
import { SectionHeading } from './ui/SectionHeading'
import { ArrowLeft, ArrowRight, ArrowUpRight } from './ui/Icons'

gsap.registerPlugin(ScrollTrigger)

const pad = (value: number) => String(value).padStart(2, '0')

export function Journey() {
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [current, setCurrent] = useState(0)
  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const pinned = isDesktop && !reduced

  useEffect(() => {
    if (!pinned) return
    const container = pinRef.current
    const stage = stageRef.current
    const track = trackRef.current

    if (!container || !stage || !track) return

    const context = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.55}`,
          pin: stage,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fillRef.current) {
              fillRef.current.style.transform = `scaleX(${self.progress})`
            }
            const next = Math.round(self.progress * (CAREER_CHAPTERS.length - 1))
            if (counterRef.current) counterRef.current.textContent = pad(next + 1)
            setCurrent((previous) => (previous === next ? previous : next))
          },
        },
      })

      triggerRef.current = tween.scrollTrigger ?? null
    }, container)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refresh)

    return () => {
      window.removeEventListener('resize', refresh)
      triggerRef.current = null
      context.revert()
    }
  }, [pinned])

  useEffect(() => {
    if (pinned) return
    const track = trackRef.current
    if (!track) return

    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-chapter-index]'))
    if (!cards.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = Number((visible.target as HTMLElement).dataset.chapterIndex)
        if (!Number.isNaN(index)) setCurrent(index)
      },
      { rootMargin: '-28% 0px -48% 0px', threshold: [0, 0.2, 0.6] },
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [pinned])

  const goToChapter = (index: number) => {
    const clamped = Math.max(0, Math.min(index, CAREER_CHAPTERS.length - 1))
    const trigger = triggerRef.current

    if (pinned && trigger) {
      const target = trigger.start + (trigger.end - trigger.start) * (clamped / (CAREER_CHAPTERS.length - 1))
      scrollToTarget(target, { immediate: false })
      return
    }

    const chapter = CAREER_CHAPTERS[clamped]
    scrollToTarget(`#chapter-${chapter.id}`)
  }

  return (
    <section id="journey" className="journey">
      <div className="journey-head container">
        <SectionHeading
          index="02"
          eyebrow="The Journey"
          title={
            <>
              A career in <span className="accent-text">chapters</span>.
            </>
          }
          intro={
            <p>
              From a teenager in Lisbon to the most scrutinised athlete in the world.
              Seven moves, five clubs and a national team that became the through-line.
            </p>
          }
        />
        <div className="journey-head-aside">
          <span className="journey-head-index">2002 — 2026</span>
          <p>
            {pinned ? 'Scroll to travel horizontally' : 'Read each chapter in sequence'}
          </p>
          <span className="journey-head-line" aria-hidden="true" />
          <span className="journey-head-count">{CAREER_CHAPTERS.length} chapters</span>
        </div>
      </div>

      <div ref={pinRef} className={`journey-pin ${pinned ? 'is-pinned' : 'is-static'}`}>
        <div ref={stageRef} className="journey-stage">
          <div className="journey-watermark display" aria-hidden="true">
            Journey
          </div>

          <div className="journey-stage-top container">
            <div className="journey-stage-label">
              <span className="status-dot" aria-hidden="true" />
              The road, in motion
            </div>
            <div className="journey-stage-count" aria-hidden="true">
              <span ref={counterRef}>{pad(current + 1)}</span>
              <span className="journey-stage-count-sep">/</span>
              <span>{pad(CAREER_CHAPTERS.length)}</span>
            </div>
          </div>

          <div
            ref={trackRef}
            className="journey-track"
            tabIndex={isDesktop && reduced ? 0 : undefined}
            role="region"
            aria-label="Career chapters"
          >
            {CAREER_CHAPTERS.map((chapter, index) => (
              <article
                key={chapter.id}
                id={`chapter-${chapter.id}`}
                data-chapter-index={index}
                className={`chapter-card ${current === index ? 'is-current' : ''}`}
                style={{ '--accent': chapter.accent } as CSSProperties}
              >
                <div className="chapter-media">
                  <img
                    src={chapter.image}
                    alt={chapter.imageAlt}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{ objectPosition: chapter.imagePosition ?? 'center' }}
                  />
                  <div className="chapter-media-shade" aria-hidden="true" />
                  <div className="chapter-media-frame" aria-hidden="true" />
                  <span className="chapter-ghost display" aria-hidden="true">
                    {chapter.year}
                  </span>
                  <span className="chapter-index display" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <div className="chapter-media-meta">
                    <span className="chapter-place">{chapter.place}</span>
                    <a
                      className="chapter-credit"
                      href={chapter.imageCredit.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Photo · {chapter.imageCredit.artist}
                    </a>
                  </div>
                </div>

                <div className="chapter-body">
                  <p className="chapter-eyebrow">{chapter.eyebrow}</p>
                  <div className="chapter-heading-row">
                    <span className="chapter-club">{chapter.club}</span>
                    <span className="chapter-period">{chapter.period}</span>
                  </div>
                  <h3 className="chapter-title display">{chapter.headline}</h3>
                  <p className="chapter-story">{chapter.story}</p>

                  <dl className="chapter-stats">
                    {chapter.stats.map((stat) => (
                      <div key={stat.label}>
                        <dd className="display">{stat.value}</dd>
                        <dt>{stat.label}</dt>
                      </div>
                    ))}
                  </dl>

                  <ul className="chapter-honours" aria-label={`Honours — ${chapter.club}`}>
                    {chapter.honours.map((honour) => (
                      <li key={honour}>{honour}</li>
                    ))}
                  </ul>

                  {chapter.note ? <p className="chapter-note">{chapter.note}</p> : null}
                </div>
              </article>
            ))}
          </div>

          <div className="journey-rail container">
            <div className="journey-progress" aria-hidden="true">
              <span ref={fillRef} />
            </div>
            <div className="journey-rail-row">
              <div className="journey-dots" role="group" aria-label="Jump to a chapter">
                {CAREER_CHAPTERS.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    aria-current={current === index ? 'true' : undefined}
                    className={`journey-dot ${current === index ? 'is-active' : ''}`}
                    onClick={() => goToChapter(index)}
                  >
                    <span className="journey-dot-index">{pad(index + 1)}</span>
                    <span className="journey-dot-label">{chapter.club}</span>
                  </button>
                ))}
              </div>
              <div className="journey-arrows">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => goToChapter(current - 1)}
                  disabled={current === 0}
                  aria-label="Previous chapter"
                >
                  <ArrowLeft className="icon-sm" />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => goToChapter(current + 1)}
                  disabled={current === CAREER_CHAPTERS.length - 1}
                  aria-label="Next chapter"
                >
                  <ArrowRight className="icon-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="journey-tail container">
        <p>
          Every chapter is sourced. Totals are club-and-country senior records, dated where
          they appear.
        </p>
        <a
          className="text-link"
          href="https://en.wikipedia.org/wiki/Cristiano_Ronaldo"
          target="_blank"
          rel="noreferrer noopener"
        >
          Career statistics
          <ArrowUpRight className="icon-sm" />
        </a>
      </div>
    </section>
  )
}
