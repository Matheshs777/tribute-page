import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let activeLenis: Lenis | null = null

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    activeLenis = lenis
    const update = () => ScrollTrigger.update()
    lenis.on('scroll', update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', update)
      lenis.destroy()
      activeLenis = null
    }
  }, [enabled])
}

type ScrollOptions = {
  offset?: number
  duration?: number
  immediate?: boolean
}

export function scrollToTarget(target: string | HTMLElement | number, options: ScrollOptions = {}) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const resolved =
    typeof target === 'number'
      ? target
      : typeof target === 'string'
        ? document.querySelector<HTMLElement>(target)
        : target

  if (resolved === null) return

  if (activeLenis) {
    // Lenis already subtracts the root's scroll-padding-top, which carries the
    // fixed-nav clearance. Extra CSS scroll-margin would stack on top of it.
    activeLenis.scrollTo(resolved, {
      offset: options.offset ?? 0,
      duration: prefersReduced || options.immediate ? 0 : (options.duration ?? 1.35),
    })
    return
  }

  if (typeof resolved === 'number') {
    window.scrollTo({
      top: resolved + (options.offset ?? 0),
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
    return
  }

  const scrollPadding =
    Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const top =
    resolved.getBoundingClientRect().top +
    window.scrollY -
    scrollPadding +
    (options.offset ?? 0)
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced ? 'auto' : 'smooth' })
}

export function stopScroll() {
  activeLenis?.stop()
}

export function startScroll() {
  activeLenis?.start()
}
