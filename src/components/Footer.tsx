import { useMemo } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollToTarget } from '../hooks/useSmoothScroll'
import { CAREER_CHAPTERS } from '../data/career'
import { MOMENTS } from '../data/moments'
import { CAREER_GOALS_DATE } from '../data/stats'
import { MODEL_CREDITS, STADIUM_CREDIT, TRAINING_CREDIT, TUNNEL_CREDIT } from '../data/credits'
import {
  DATA_SOURCES,
  DISCLAIMER,
  OFFICIAL_LINKS,
  TROPHY_VERIFIED_DATE,
  VERIFIED_DATE,
  type ImageCredit,
} from '../data/site'
import { ArrowUpRight } from './ui/Icons'
import { GoalTracker } from './GoalTracker'

export function Footer() {
  const reduced = useReducedMotion()

  const credits = useMemo(() => {
    const unique = new Map<string, ImageCredit>()
    const all = [
      ...CAREER_CHAPTERS.map((chapter) => chapter.imageCredit),
      ...MOMENTS.map((moment) => moment.imageCredit),
      TRAINING_CREDIT,
      TUNNEL_CREDIT,
      STADIUM_CREDIT,
    ]
    all.forEach((credit) => unique.set(credit.sourceUrl, credit))
    return Array.from(unique.values())
  }, [])

  const replayIntro = () => {
    window.sessionStorage.removeItem('cr7-intro-seen-v1')
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.location.reload()
  }

  return (
    <footer id="continues" className="closing" aria-labelledby="closing-title">
      <div className="closing-bg" aria-hidden="true">
        <img
          src="/assets/images/stadium-floodlights.webp"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="closing-shade" aria-hidden="true" />
      <div className="closing-grid-pattern" aria-hidden="true" />

      <div className="container closing-inner">
        <div className="closing-top">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            08 · The Legacy
          </p>
          <p className="closing-top-note">Madeira → the world</p>
        </div>

        <h2 id="closing-title" className="closing-title display">
          <span>The legend</span>
          <span className="closing-title-outline">continues.</span>
        </h2>

        <div className="closing-main">
          <GoalTracker />

          <div className="closing-links">
            <p className="eyebrow">Follow the official record</p>
            <ul>
              {OFFICIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label}
                    <ArrowUpRight className="icon-sm" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="closing-links-note">
              Links point to Cristiano Ronaldo’s official channels. This tribute is
              independent and is not hosted by any of them.
            </p>
          </div>
        </div>

        <div className="closing-details">
          <details>
            <summary>
              <span>Sources, photography &amp; disclaimer</span>
              <span className="closing-details-hint">Open the archive</span>
            </summary>
            <div className="closing-details-body">
              <div>
                <h3 className="eyebrow">Data sources</h3>
                <ul className="source-list">
                  {DATA_SOURCES.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} target="_blank" rel="noreferrer noopener">
                        {source.label}
                        <ArrowUpRight className="icon-xs" />
                      </a>
                      <p>{source.note}</p>
                    </li>
                  ))}
                </ul>
                <p className="closing-verified">
                  Career statistics dated {VERIFIED_DATE}; goal figure dated{' '}
                  {CAREER_GOALS_DATE}. Trophy totals verified {TROPHY_VERIFIED_DATE}.
                </p>
              </div>

              <div>
                <h3 className="eyebrow">Photography</h3>
                <p className="closing-small">
                  All photographs are used under the licences below and credited in the
                  interface. Follow a link for the original file and licence deed.
                </p>
                <ul className="credit-list">
                  {credits.map((credit) => (
                    <li key={credit.sourceUrl}>
                      <a
                        href={credit.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {credit.artist}
                      </a>
                      <span>
                        {credit.license} · {credit.source}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="eyebrow">3D models</h3>
                <p className="closing-small">
                  Community-made models hosted on Sketchfab and used under CC BY 4.0. The
                  athlete model is fully rigged; its jump, celebration and landing are posed
                  in code from the deform skeleton, with the original Portugal kit, boots
                  and face textures preserved.
                </p>
                <ul className="credit-list">
                  {MODEL_CREDITS.map((credit) => (
                    <li key={credit.sourceUrl}>
                      <a
                        href={credit.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {credit.title} · {credit.artist}
                      </a>
                      <span>
                        {credit.role} ·{' '}
                        <a href={credit.licenseUrl} target="_blank" rel="noreferrer noopener">
                          {credit.license}
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="eyebrow">Method &amp; disclaimer</h3>
                <p className="closing-disclaimer">{DISCLAIMER}</p>
                <p className="closing-small">
                  The athlete figure is a community CC BY 4.0 model credited above, staged
                  and posed entirely in code from its own deform skeleton. The Ballon d’Or
                  exhibit uses a second credited community model; every other trophy form is
                  an original abstract interpretation. Audio is synthesised in the browser
                  and plays only after a user action.
                </p>
              </div>
            </div>
          </details>
        </div>

        <div className="closing-foot">
          <div className="closing-brand">
            <span className="display">CR7</span>
            <span>The Legend · An independent tribute</span>
          </div>

          <p className="closing-disclaimer-short">
            This is an independent fan-made tribute website. It is not affiliated with or
            endorsed by Cristiano Ronaldo or any football club.
          </p>

          <div className="closing-actions">
            {!reduced ? (
              <button type="button" className="text-button" onClick={replayIntro}>
                Replay intro
              </button>
            ) : null}
            <button
              type="button"
              className="text-button"
              onClick={() => scrollToTarget(0)}
            >
              Back to top ↑
            </button>
          </div>
        </div>

        <div className="closing-signature">
          <span>© 2026 CR7 — The Legend</span>
          <span>Greatness is earned.</span>
          <span>Built as a fan project.</span>
        </div>
      </div>
    </footer>
  )
}
