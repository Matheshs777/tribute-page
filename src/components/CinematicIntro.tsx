import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

type CinematicIntroProps = {
  onReveal: () => void
  onComplete: () => void
}

const INTRO_KEY = 'cr7-intro-seen-v1'

export function CinematicIntro({ onReveal, onComplete }: CinematicIntroProps) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const lineTopRef = useRef<HTMLSpanElement>(null)
  const lineBottomRef = useRef<HTMLSpanElement>(null)
  const sevenRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const overlineRef = useRef<HTMLParagraphElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const burstRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const completeRef = useRef(onComplete)
  const revealRef = useRef(onReveal)
  const finishedRef = useRef(false)

  completeRef.current = onComplete
  revealRef.current = onReveal

  useEffect(() => {
    let alreadySeen = false
    try {
      alreadySeen = window.sessionStorage.getItem(INTRO_KEY) === '1'
    } catch {
      alreadySeen = false
    }
    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      try {
        window.sessionStorage.setItem(INTRO_KEY, '1')
      } catch {
        // Storage can be unavailable in private or sandboxed contexts.
      }
      document.body.classList.remove('is-locked')
      completeRef.current()
    }

    if (reduced || alreadySeen) {
      revealRef.current()
      finish()
      return
    }

    document.body.classList.add('is-locked')
    const context = gsap.context(() => {
      gsap.set([lineTopRef.current, lineBottomRef.current], {
        scaleX: 0,
        transformOrigin: 'left center',
        opacity: 0,
      })
      gsap.set(sevenRef.current, { opacity: 0, scale: 0.72, filter: 'blur(18px)' })
      gsap.set(overlineRef.current, { opacity: 0, y: 12 })
      gsap.set(titleRef.current, { opacity: 1 })
      gsap.set('.intro-word-inner', { yPercent: 115 })
      gsap.set(subRef.current, { opacity: 0, y: 16 })
      gsap.set(footerRef.current, { opacity: 0 })
      gsap.set('.intro-burst span', { opacity: 0, x: 0, y: 0, scale: 0.4 })
      gsap.set(lightRef.current, { opacity: 0 })

      const tl = gsap.timeline({ onComplete: finish })
      timelineRef.current = tl

      tl.to([lineTopRef.current, lineBottomRef.current], {
        scaleX: 1,
        opacity: 1,
        duration: 1.15,
        stagger: 0.12,
        ease: 'power3.inOut',
      })
        .to(sevenRef.current, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.35,
          ease: 'power3.out',
        }, 0.45)
        .to(lightRef.current, { opacity: 1, duration: 1.7, ease: 'sine.inOut' }, 0.75)
        .to(sceneRef.current, { backgroundColor: 'rgba(6,6,6,0.38)', duration: 1.4 }, 1.2)
        .call(() => revealRef.current(), [], 1.35)
        .to(overlineRef.current, { opacity: 1, y: 0, duration: 0.8 }, 2.15)
        .to('.intro-word-inner', {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power4.out',
        }, 2.35)
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.9 }, 3.05)
        .to('.intro-burst span', {
          opacity: 1,
          x: () => gsap.utils.random(-220, 220),
          y: () => gsap.utils.random(-150, 150),
          scale: () => gsap.utils.random(0.5, 1.4),
          duration: 1.15,
          stagger: 0.012,
          ease: 'power2.out',
        }, 3.15)
        .to('.intro-burst span', { opacity: 0, duration: 0.9, ease: 'power2.in' }, 3.95)
        .to(footerRef.current, { opacity: 1, duration: 0.7 }, 3.7)
        .to(sceneRef.current, { backgroundColor: 'rgba(6,6,6,0)', duration: 1.1 }, 4.55)
        .to([titleRef.current, overlineRef.current, subRef.current, sevenRef.current], {
          opacity: 0,
          y: -18,
          duration: 0.85,
          stagger: 0.045,
          ease: 'power2.in',
        }, 4.8)
        .to(footerRef.current, { opacity: 0, duration: 0.5 }, 4.95)
        .to(rootRef.current, { opacity: 0, duration: 0.85, ease: 'power2.inOut' }, 5.15)
    }, rootRef)

    return () => {
      context.revert()
      document.body.classList.remove('is-locked')
    }
  }, [reduced])

  const skip = () => {
    timelineRef.current?.kill()
    if (finishedRef.current) return
    finishedRef.current = true
    try {
      window.sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      // Storage can be unavailable in private or sandboxed contexts.
    }
    revealRef.current()

    let skipped = false
    const finishSkip = () => {
      if (skipped) return
      skipped = true
      document.body.classList.remove('is-locked')
      completeRef.current()
    }

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: reduced ? 0 : 0.45,
      onComplete: finishSkip,
    })
    // Never let a stalled ticker keep the page locked behind a transparent intro.
    window.setTimeout(finishSkip, 900)
  }

  return (
    <div ref={rootRef} className="intro" aria-label="Cinematic introduction">
      <div ref={sceneRef} className="intro-scene">
        <div ref={lightRef} className="intro-lights" aria-hidden="true">
          <span className="intro-light intro-light-a" />
          <span className="intro-light intro-light-b" />
          <span className="intro-light intro-light-c" />
          <span className="intro-crowd" />
        </div>
        <div ref={sevenRef} className="intro-seven display" aria-hidden="true">
          7
        </div>
        <div ref={burstRef} className="intro-burst" aria-hidden="true">
          {Array.from({ length: 20 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      <span ref={lineTopRef} className="intro-line intro-line-top" aria-hidden="true" />
      <span ref={lineBottomRef} className="intro-line intro-line-bottom" aria-hidden="true" />

      <div className="intro-content">
        <p ref={overlineRef} className="intro-overline">
          An independent 3D tribute
        </p>
        <h1 ref={titleRef} className="intro-title display">
          <span className="intro-word">
            <span className="intro-word-inner">Cristiano</span>
          </span>
          <span className="intro-word">
            <span className="intro-word-inner">Ronaldo</span>
          </span>
        </h1>
        <p ref={subRef} className="intro-subtitle">
          The man. The discipline. The legend.
        </p>
      </div>

      <div ref={footerRef} className="intro-footer">
        <span>Est. Madeira · 1985</span>
        <span className="intro-footer-center">Greatness is earned.</span>
        <span>Scroll to witness</span>
      </div>

      <button type="button" className="intro-skip" onClick={skip}>
        Skip intro
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
