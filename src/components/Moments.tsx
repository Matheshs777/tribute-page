import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { MOMENT_FILTERS, MOMENTS, type Moment } from '../data/moments'
import { Dialog } from './ui/Dialog'
import { ArrowLeft, ArrowRight, ArrowUpRight, Close, Star } from './ui/Icons'
import { SectionHeading } from './ui/SectionHeading'

type FilterId = (typeof MOMENT_FILTERS)[number]['id']

export function Moments() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [activeId, setActiveId] = useState<string | null>(null)

  const visible =
    filter === 'all' ? MOMENTS : MOMENTS.filter((moment) => moment.category === filter)
  const activeIndex = visible.findIndex((moment) => moment.id === activeId)
  const active: Moment | null = activeIndex >= 0 ? visible[activeIndex] : null

  const close = useCallback(() => setActiveId(null), [])

  const step = useCallback(
    (direction: number) => {
      if (!visible.length) return
      const current = Math.max(0, activeIndex)
      const next = (current + direction + visible.length) % visible.length
      setActiveId(visible[next].id)
    },
    [activeIndex, visible],
  )

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, step])

  const counts = MOMENT_FILTERS.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.id] =
      item.id === 'all'
        ? MOMENTS.length
        : MOMENTS.filter((moment) => moment.category === item.id).length
    return accumulator
  }, {})

  return (
    <section id="moments" className="moments">
      <div className="container">
        <div className="moments-head">
          <SectionHeading
            index="06"
            eyebrow="Iconic Moments"
            title={
              <>
                Frames from a <span className="accent-text">life</span> in football.
              </>
            }
            intro={
              <p>
                Ten photographs, ten thresholds. Each frame is credited to its
                photographer and shown in its documented context — no staged recreations,
                no invented captions.
              </p>
            }
          />
          <div className="moments-head-aside">
            <p>
              <span className="status-dot" aria-hidden="true" />
              Archive open
            </p>
            <span>10 frames · 2002 — 2026</span>
          </div>
        </div>

        <div className="moments-toolbar">
          <div className="filter-group" role="group" aria-label="Filter moments">
            {MOMENT_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-pill ${filter === item.id ? 'is-active' : ''}`}
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
              >
                {item.label}
                <span>{String(counts[item.id]).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <p className="filter-count" aria-live="polite">
            Showing {visible.length} of {MOMENTS.length} moments
          </p>
        </div>

        <div className="moments-grid" key={filter}>
          {visible.map((moment, index) => (
            <button
              key={moment.id}
              type="button"
              className={`moment-card ${moment.featured ? 'is-featured' : ''}`}
              onClick={() => setActiveId(moment.id)}
              aria-label={`Open moment: ${moment.title}, ${moment.year}`}
              style={{ '--moment-delay': `${index * 45}ms` } as CSSProperties}
            >
              <img
                src={moment.image}
                alt={moment.imageAlt}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: moment.position ?? 'center' }}
              />
              <span className="moment-shade" aria-hidden="true" />
              <span className="moment-credit">
                {moment.imageCredit.artist}
                <span>{moment.imageCredit.license}</span>
              </span>
              <span className="moment-topline">
                <span>{moment.eyebrow}</span>
                {moment.featured ? (
                  <span className="moment-featured-mark">
                    <Star className="icon-xs" />
                    Featured
                  </span>
                ) : null}
              </span>
              <span className="moment-caption">
                <span className="moment-year display">{moment.year}</span>
                <span className="moment-title display">{moment.title}</span>
                <span className="moment-open">
                  View frame
                  <ArrowUpRight className="icon-sm" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={Boolean(active)}
        onClose={close}
        labelledBy="lightbox-title"
        className="lightbox-panel"
        closeLabel="Close image viewer"
      >
        {active ? (
          <div className="lightbox">
            <figure className="lightbox-media">
              <img
                src={active.image}
                alt={active.imageAlt}
                style={{ objectPosition: active.position ?? 'center' }}
              />
              <figcaption>
                <span>{active.imageNote}</span>
                <a
                  href={active.imageCredit.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {active.imageCredit.artist} · {active.imageCredit.license}
                  <ArrowUpRight className="icon-xs" />
                </a>
              </figcaption>
            </figure>

            <div className="lightbox-body">
              <div className="lightbox-top">
                <span className="eyebrow">
                  {active.eyebrow} · {active.year}
                </span>
                <span className="lightbox-counter">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(visible.length).padStart(2, '0')}
                </span>
              </div>

              <h3 id="lightbox-title" className="lightbox-title display">
                {active.title}
              </h3>
              <p className="lightbox-caption">{active.caption}</p>
              <p className="lightbox-context">{active.context}</p>

              <div className="lightbox-divider" aria-hidden="true" />

              <div className="lightbox-nav">
                <button type="button" className="button button-ghost" onClick={() => step(-1)}>
                  <ArrowLeft className="icon-sm" />
                  Previous
                </button>
                <button type="button" className="button button-ghost" onClick={() => step(1)}>
                  Next
                  <ArrowRight className="icon-sm" />
                </button>
              </div>
              <p className="lightbox-hint">
                Use the arrow keys to move through the archive.
                <span aria-hidden="true"> · </span>
                <Close className="icon-xs" /> or Esc to close
              </p>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  )
}
