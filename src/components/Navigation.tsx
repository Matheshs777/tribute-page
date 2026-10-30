import { useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from '../data/site'
import { useSound } from '../context/SoundContext'
import { scrollToTarget } from '../hooks/useSmoothScroll'
import { ArrowUpRight, Close, Menu, SoundOff, SoundOn } from './ui/Icons'

export function Navigation({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState('legacy')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuCloseRef = useRef<HTMLButtonElement>(null)
  const { enabled, toggleSound } = useSound()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const top = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(top > 48)
      setProgress(max > 0 ? Math.min(top / max, 1) : 0)

      // Mark the section currently crossing the upper third of the viewport.
      // A scroll-position check is more reliable than an IntersectionObserver
      // here: the pinned Journey section is thousands of pixels tall, so its
      // intersection ratio barely changes while it owns the screen.
      const marker = window.innerHeight * 0.42
      let next = NAV_ITEMS[0]?.id ?? 'legacy'
      for (const item of NAV_ITEMS) {
        const section = document.getElementById(item.id)
        if (section && section.getBoundingClientRect().top <= marker) next = item.id
      }
      setActiveId((previous) => (previous === next ? previous : next))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => menuCloseRef.current?.focus(), 40)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      previous?.focus()
    }
  }, [menuOpen])

  const navigate = (id: string) => {
    setMenuOpen(false)
    window.setTimeout(() => scrollToTarget(`#${id}`), menuOpen ? 120 : 0)
  }

  if (!ready) return null

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-inner">
          <button type="button" className="brand-mark" onClick={() => scrollToTarget(0)} aria-label="CR7 The Legend — back to top">
            <span className="brand-cr7">CR7</span>
            <span className="brand-meta">THE LEGEND</span>
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {NAV_ITEMS.slice(0, 7).map((item) => (
              <button
                type="button"
                key={item.id}
                className={`nav-link ${activeId === item.id ? 'is-active' : ''}`}
                onClick={() => navigate(item.id)}
                aria-current={activeId === item.id ? 'page' : undefined}
              >
                {item.short}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className={`sound-toggle ${enabled ? 'is-on' : ''}`}
              onClick={toggleSound}
              aria-pressed={enabled}
              aria-label={enabled ? 'Turn stadium ambience off' : 'Turn stadium ambience on'}
            >
              {enabled ? <SoundOn className="icon-sm" /> : <SoundOff className="icon-sm" />}
              <span className="sound-label">{enabled ? 'Sound on' : 'Sound off'}</span>
            </button>
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="icon-md" />
            </button>
          </div>
        </div>
        <div className="nav-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      {menuOpen ? (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="mobile-menu-head">
            <span className="brand-mark">
              <span className="brand-cr7">CR7</span>
              <span className="brand-meta">THE LEGEND</span>
            </span>
            <button ref={menuCloseRef} type="button" className="menu-close" onClick={() => setMenuOpen(false)}>
              <Close className="icon-md" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav className="mobile-menu-links" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => navigate(item.id)}
                className={activeId === item.id ? 'is-active' : ''}
              >
                <span className="mobile-menu-index">0{index + 1}</span>
                <span>{item.label}</span>
                <ArrowUpRight className="icon-sm" />
              </button>
            ))}
          </nav>
          <div className="mobile-menu-footer">
            <button
              type="button"
              className={`sound-toggle ${enabled ? 'is-on' : ''}`}
              onClick={toggleSound}
              aria-pressed={enabled}
              aria-label={enabled ? 'Turn stadium ambience off' : 'Turn stadium ambience on'}
            >
              {enabled ? <SoundOn className="icon-sm" /> : <SoundOff className="icon-sm" />}
              <span>{enabled ? 'Ambience on' : 'Ambience off'}</span>
            </button>
            <p>Independent fan tribute · Not an official website</p>
          </div>
        </div>
      ) : null}
    </>
  )
}
