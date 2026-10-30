import { useEffect, useState } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'
import { SoundProvider } from './context/SoundContext'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { CinematicIntro } from './components/CinematicIntro'
import { LoadingScreen } from './components/LoadingScreen'
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { Journey } from './components/Journey'
import { TrophyRoom } from './components/TrophyRoom'
import { Numbers } from './components/Numbers'
import { Mindset } from './components/Mindset'
import { Moments } from './components/Moments'
import { Celebration } from './components/Celebration'
import { Footer } from './components/Footer'

const INTRO_KEY = 'cr7-intro-seen-v1'

function introAlreadySeen() {
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

type BootPhase = 'loading' | 'leaving' | 'ready'

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

/**
 * Warm the hero photograph without ever holding the boot sequence hostage.
 * `decode()` can stay pending indefinitely in some browsers/webviews, so every
 * path (load, error, decode, timeout) resolves the same promise exactly once.
 */
function preloadImage(source: string, timeout = 2600) {
  return new Promise<void>((resolve) => {
    const image = new Image()
    let settled = false

    const done = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      resolve()
    }

    const timer = window.setTimeout(done, timeout)

    image.onload = () => {
      const decoded = image.decode?.()
      if (decoded && typeof decoded.then === 'function') {
        decoded.then(done, done)
      } else {
        done()
      }
    }
    image.onerror = done
    image.src = source

    // A cached image may already be complete before handlers are attached.
    if (image.complete && image.naturalWidth > 0) {
      const decoded = image.decode?.()
      if (decoded && typeof decoded.then === 'function') {
        decoded.then(done, done)
      } else {
        done()
      }
    }
  })
}

function Experience() {
  const [phase, setPhase] = useState<BootPhase>('loading')
  const reduced = useReducedMotion()
  const shouldSkipIntro = reduced || introAlreadySeen()
  const [introShowing, setIntroShowing] = useState(!shouldSkipIntro)
  const [revealed, setRevealed] = useState(shouldSkipIntro)
  const [introDone, setIntroDone] = useState(shouldSkipIntro)

  useSmoothScroll(introDone)

  useEffect(() => {
    let active = true
    const fontReady = document.fonts?.ready ?? Promise.resolve()

    const sceneReady = Promise.race([
      import('./components/hero/HeroCanvas').catch(() => null),
      wait(5500),
    ])

    const heroImage = preloadImage('/assets/images/cr7-real-madrid-action.webp')

    const fontsReady = Promise.race([fontReady, wait(2600)])

    Promise.all([wait(1100), fontsReady, sceneReady, heroImage]).then(() => {
      if (!active) return
      setPhase('leaving')
      window.setTimeout(() => {
        if (active) setPhase('ready')
      }, 620)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('has-intro', introShowing)
    return () => document.documentElement.classList.remove('has-intro')
  }, [introShowing])

  if (phase !== 'ready') {
    return <LoadingScreen leaving={phase === 'leaving'} />
  }

  return (
    <SoundProvider>
      {introShowing ? (
        <CinematicIntro
          onReveal={() => setRevealed(true)}
          onComplete={() => {
            setIntroShowing(false)
            setIntroDone(true)
          }}
        />
      ) : null}

      <Navigation ready={introDone} />

      <main id="main-content" tabIndex={-1}>
        <Hero revealed={revealed} />
        <Journey />
        <TrophyRoom />
        <Numbers />
        <Mindset />
        <Moments />
        <Celebration />
      </main>

      <Footer />
    </SoundProvider>
  )
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <Experience />
    </LazyMotion>
  )
}
