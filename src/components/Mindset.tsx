import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { TRAINING_CREDIT } from '../data/credits'
import { CAREER_GOALS } from '../data/stats'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowUpRight } from './ui/Icons'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const PRINCIPLES = [
  {
    index: '01',
    title: 'Repetition',
    stat: '1,342 appearances',
    copy: 'The highlight is the easy part to watch. The career is the accumulation: sessions, recoveries, travel, again. Longevity at this level is not a single decision — it is an argument made daily, for two decades.',
  },
  {
    index: '02',
    title: 'Adaptation',
    stat: '5 leagues · 5 countries',
    copy: 'Sporting to Manchester. Manchester to Madrid. Madrid to Turin. Turin to Riyadh. Each move required a different player inside the same body: winger, wide forward, penalty-box finisher, senior leader. The game changed; the output followed.',
  },
  {
    index: '03',
    title: 'Longevity',
    stat: '41 years · 234 caps',
    copy: 'The records are not frozen relics. At 41, Ronaldo is still adding to international caps and club goals. The career is unusual less for its peak than for how long the peak has been asked to last.',
  },
  {
    index: '04',
    title: 'Pressure',
    stat: `${CAREER_GOALS} goals · 146 for Portugal`,
    copy: 'Every season after the first great one carried a different weight: expectation, comparison, the assumption that the next year must justify the last. The numbers kept arriving anyway.',
  },
]

export function Mindset() {
  const mediaRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  return (
    <section id="mindset" className="mindset">
      <div className="mindset-watermark display" aria-hidden="true">
        Mindset
      </div>

      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="The Mindset"
          title={
            <>
              Talent opens the door. <span className="accent-text">Discipline</span> keeps
              it open.
            </>
          }
          intro={
            <p>
              A reading of the record, not a set of quotations. The archive shows the
              output; the principles below are the patterns that sit underneath it.
            </p>
          }
        />

        <div className="mindset-layout">
          <figure className="mindset-media" ref={mediaRef}>
            <div className="mindset-media-frame">
              <m.div
                className="mindset-media-parallax"
                style={reduced ? undefined : { y: imageY }}
              >
                <img
                  src="/assets/images/cr7-training-2012.webp"
                  alt="Cristiano Ronaldo training with Portugal before Euro 2012 in Opalenica, Poland."
                  loading="lazy"
                  decoding="async"
                />
              </m.div>
              <div className="mindset-media-shade" aria-hidden="true" />
              <span className="mindset-media-index display" aria-hidden="true">
                05
              </span>
              <span className="mindset-media-word display" aria-hidden="true">
                Work
              </span>
            </div>
            <figcaption className="mindset-caption">
              <span>Opalenica, Poland · Euro 2012 preparation</span>
              <a
                href={TRAINING_CREDIT.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {TRAINING_CREDIT.artist} · {TRAINING_CREDIT.license}
              </a>
            </figcaption>
          </figure>

          <div className="mindset-content">
            <Reveal>
              <p className="mindset-lede">
                The career is often told as a sequence of goals. Look closer and it is a
                sequence of <em>adjustments</em> — a player rebuilding the terms of his
                own relevance, season after season.
              </p>
            </Reveal>

            <div className="principles">
              {PRINCIPLES.map((principle, index) => (
                <Reveal key={principle.index} delay={index * 60}>
                  <article className="principle">
                    <div className="principle-head">
                      <span className="principle-index">{principle.index}</span>
                      <h3 className="principle-title display">{principle.title}</h3>
                      <span className="principle-stat">{principle.stat}</span>
                    </div>
                    <p className="principle-copy">{principle.copy}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <aside className="mindset-note">
                <span className="mindset-note-mark display" aria-hidden="true">
                  “
                </span>
                <div>
                  <p className="mindset-note-title">Editorial reading</p>
                  <p>
                    This section is interpretation, not quotation. No words are attributed
                    to Cristiano Ronaldo. The arguments are drawn from the public career
                    record — appearances, goals, moves and honours — and should be read as
                    editorial commentary.
                  </p>
                </div>
              </aside>
            </Reveal>

            <Reveal>
              <a
                className="mindset-link"
                href="https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo"
                target="_blank"
                rel="noreferrer noopener"
              >
                <span>Explore the full achievements record</span>
                <ArrowUpRight className="icon-sm" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
