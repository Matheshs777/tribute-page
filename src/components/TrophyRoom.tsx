import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'
import { TROPHIES, TROPHY_ROOM_NOTE, type Trophy } from '../data/trophies'
import { TROPHY_VERIFIED_DATE } from '../data/site'
import { useDeviceProfile } from '../hooks/useDeviceProfile'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SceneBoundary } from './SceneBoundary'
import { ArrowUpRight } from './ui/Icons'
import { SectionHeading } from './ui/SectionHeading'

const TrophyCanvas = lazy(() => import('./trophies/TrophyCanvas'))

const pad = (value: number) => String(value).padStart(2, '0')

function scopeLabel(trophy: Trophy) {
  const kind = trophy.kind === 'team' ? 'Team honour' : 'Individual honour'
  const scope =
    trophy.scope === 'club'
      ? 'Club football'
      : trophy.scope === 'international'
        ? 'Portugal'
        : 'Career'
  return `${kind} · ${scope}`
}

export function TrophyRoom() {
  const [selectedId, setSelectedId] = useState(TROPHIES[0].id)
  const [mounted, setMounted] = useState(false)
  const { webgl, quality } = useDeviceProfile()
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLElement>(
    { threshold: 0.01, rootMargin: '280px' },
    false,
  )

  const selected = TROPHIES.find((trophy) => trophy.id === selectedId) ?? TROPHIES[0]
  const selectedIndex = TROPHIES.findIndex((trophy) => trophy.id === selected.id)

  useEffect(() => {
    if (inView) setMounted(true)
  }, [inView])

  return (
    <section
      ref={ref}
      id="trophies"
      className="trophies"
      style={{ '--trophy-accent': selected.accent } as CSSProperties}
    >
      <div className="trophies-atmosphere" aria-hidden="true" />
      <div className="container">
        <div className="trophies-head">
          <SectionHeading
            index="03"
            eyebrow="The Trophy Room"
            title={
              <>
                Silver, gold <span className="accent-text">&amp; proof</span>.
              </>
            }
            intro={
              <p>
                A curated room, not a full cabinet. Six exhibits trace the honours that
                define the career — from the first Ballon d’Or to the records that are
                still moving.
              </p>
            }
          />
          <div className="trophies-head-stats">
            <div>
              <span className="display">35</span>
              <p>Senior team trophies</p>
            </div>
            <div>
              <span className="display">5</span>
              <p>Ballons d’Or</p>
            </div>
            <p className="trophies-verified">Trophies verified {TROPHY_VERIFIED_DATE}</p>
          </div>
        </div>

        <div className="trophies-layout">
          <aside className="trophies-aside">
            <div className="trophy-list-head">
              <span className="eyebrow">The exhibits</span>
              <span className="trophy-list-count">{pad(TROPHIES.length)}</span>
            </div>

            <div className="trophy-list" role="group" aria-label="Choose a trophy to view in 3D">
              {TROPHIES.map((trophy, index) => (
                <button
                  key={trophy.id}
                  type="button"
                  className={`trophy-item ${trophy.id === selected.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedId(trophy.id)}
                  aria-pressed={trophy.id === selected.id}
                  aria-controls="trophy-detail-panel"
                  style={{ '--item-accent': trophy.accent } as CSSProperties}
                >
                  <span className="trophy-item-index">{pad(index + 1)}</span>
                  <span className="trophy-item-main">
                    <span className="trophy-item-title">{trophy.shortTitle}</span>
                    <span className="trophy-item-kind">{scopeLabel(trophy)}</span>
                  </span>
                  <span className="trophy-item-count display">{trophy.display}</span>
                  <span className="trophy-item-arrow" aria-hidden="true">
                    <ArrowUpRight className="icon-sm" />
                  </span>
                </button>
              ))}
            </div>

            <div
              id="trophy-detail-panel"
              className="trophy-detail"
              key={selected.id}
              aria-live="polite"
            >
              <div className="trophy-detail-top">
                <p className="eyebrow">{scopeLabel(selected)}</p>
                <span className="trophy-detail-count display">{selected.display}</span>
              </div>
              <h3 className="trophy-detail-title">{selected.summary}</h3>
              <p className="trophy-detail-body">{selected.detail}</p>

              {selected.breakdown ? (
                <ul className="trophy-breakdown">
                  {selected.breakdown.map((entry) => (
                    <li key={entry}>
                      <span className="trophy-breakdown-dot" aria-hidden="true" />
                      {entry}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="trophy-detail-foot">
                <span>Years · {selected.years.join(' · ')}</span>
                <a
                  className="text-link"
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {selected.source}
                  <ArrowUpRight className="icon-sm" />
                </a>
              </div>
            </div>

            <p className="trophies-note">{TROPHY_ROOM_NOTE}</p>
          </aside>

          <div className="trophies-visual">
            <div className="trophy-stage">
              <div className="trophy-stage-top">
                <span className="eyebrow">Exhibit {pad(selectedIndex + 1)}</span>
                <span className="trophy-stage-tag">
                  <span className="status-dot" aria-hidden="true" />
                  Turntable 3D
                </span>
              </div>

              <div className="trophy-canvas-wrap">
                {webgl === null ? (
                  <div className="trophy-canvas-skeleton" aria-hidden="true" />
                ) : webgl === false ? (
                  <div className="trophy-static">
                    <span className="trophy-static-count display">{selected.display}</span>
                    <p>{selected.shortTitle}</p>
                    <small>3D view unavailable on this device</small>
                  </div>
                ) : mounted ? (
                  <SceneBoundary
                    label="The trophy room 3D scene"
                    fallback={
                      <div className="trophy-static">
                        <span className="trophy-static-count display">{selected.display}</span>
                        <p>{selected.shortTitle}</p>
                        <small>3D view unavailable</small>
                      </div>
                    }
                  >
                    <Suspense
                      fallback={
                        <div className="trophy-canvas-skeleton" aria-hidden="true" />
                      }
                    >
                      <TrophyCanvas
                        trophy={selected}
                        quality={quality}
                        reduced={reduced}
                        active={inView}
                      />
                    </Suspense>
                  </SceneBoundary>
                ) : (
                  <div className="trophy-canvas-skeleton" aria-hidden="true" />
                )}
              </div>

              <div className="trophy-stage-corners" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="trophy-stage-caption">
                <div>
                  <p className="trophy-stage-eyebrow">{selected.kind === 'team' ? 'Team honour' : 'Individual honour'}</p>
                  <p className="trophy-stage-title display">{selected.shortTitle}</p>
                </div>
                <p className="trophy-stage-count display">{selected.display}</p>
              </div>

              <p className="trophy-disclaimer">
                {selected.model === 'ballon'
                  ? 'Ballon d’Or form — community CC BY 4.0 model, credited in the footer.'
                  : 'Original procedural 3D interpretation — not an official trophy replica.'}
              </p>
            </div>

            <div className="trophy-visual-foot">
              <span>Drag your cursor across the room</span>
              <span className="trophy-visual-rule" aria-hidden="true" />
              <span>Selected from six exhibits</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
