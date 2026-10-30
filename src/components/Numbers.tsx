import type { CSSProperties } from 'react'
import {
  CAREER_ASSISTS,
  CAREER_GOALS,
  CAREER_GOALS_DATE,
  CAREER_METRICS,
  CAREER_MILESTONES,
  GOALS_BY_TEAM,
  GOALS_BY_YEAR,
  STATS_NOTE,
} from '../data/stats'
import { VERIFIED_DATE } from '../data/site'
import { useInView } from '../hooks/useInView'
import { Counter } from './ui/Counter'
import { SectionHeading } from './ui/SectionHeading'

const MAX_TEAM_GOALS = Math.max(...GOALS_BY_TEAM.map((team) => team.goals))
const MAX_YEAR_GOALS = Math.max(...GOALS_BY_YEAR.map((year) => year.goals))
const CONTRIBUTIONS = CAREER_GOALS + CAREER_ASSISTS

export function Numbers() {
  const teamChart = useInView<HTMLDivElement>(
    { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    true,
  )
  const yearChart = useInView<HTMLDivElement>(
    { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    true,
  )

  return (
    <section id="numbers" className="numbers">
      <div className="numbers-watermark display" aria-hidden="true">
        {CAREER_GOALS}
      </div>

      <div className="container">
        <div className="numbers-head">
          <SectionHeading
            index="04"
            eyebrow="The Numbers"
            title={
              <>
                The record, <span className="accent-text">measured</span>.
              </>
            }
            intro={
              <p>
                Goals are only part of the story, but they are the clearest evidence.
                Every figure below is a senior, first-team number — dated, sourced and
                deliberately separated from the noise.
              </p>
            }
          />
          <aside className="numbers-head-aside">
            <p className="numbers-verified">
              <span className="status-dot status-dot-dark" aria-hidden="true" />
              Goal figure dated {CAREER_GOALS_DATE}
            </p>
            <p>
              {CAREER_GOALS} goals in 1,342 appearances. A ratio of 0.73 goals per game
              across twenty-four years at senior level.
            </p>
            <p className="numbers-head-source">Senior club and international football only.</p>
          </aside>
        </div>

        <div className="metrics">
          {CAREER_METRICS.map((metric, index) => (
            <article className="metric" key={metric.id}>
              <div className="metric-top">
                <span className="metric-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="metric-detail">{metric.detail}</span>
              </div>
              <p className="metric-value display">
                <Counter
                  value={metric.value}
                  format={metric.format}
                  label={`${metric.label}: ${metric.value}`}
                  duration={1800}
                />
              </p>
              <h3 className="metric-label">{metric.label}</h3>
              <p className="metric-source">{metric.source}</p>
            </article>
          ))}
        </div>

        <div className="contribution-band">
          <p className="eyebrow">Goals + assists</p>
          <div
            className="contribution-equation display"
            aria-label={`${CAREER_GOALS} goals plus ${CAREER_ASSISTS} assists equals ${CONTRIBUTIONS} career goal contributions`}
          >
            <span>{CAREER_GOALS}</span>
            <span className="contribution-op">+</span>
            <span>{CAREER_ASSISTS}</span>
            <span className="contribution-op">=</span>
            <span className="contribution-total">
              {new Intl.NumberFormat('en-US').format(CONTRIBUTIONS)}
            </span>
          </div>
          <p className="contribution-caption">
            Career goal contributions
            <span>Assists total from public career records, {VERIFIED_DATE}.</span>
          </p>
        </div>

        <div className="numbers-panels">
          <div
            ref={teamChart.ref}
            className={`numbers-panel team-panel ${teamChart.inView ? 'is-inview' : ''}`}
          >
            <div className="panel-head">
              <p className="eyebrow">Where the goals were scored</p>
              <h3 className="panel-title display">By club &amp; country</h3>
              <p className="panel-intro">
                The Madrid years remain the outlier: 450 goals in 438 games. The
                international record keeps growing.
              </p>
            </div>

            <div className="team-chart">
              {GOALS_BY_TEAM.map((team, index) => (
                <div
                  className="team-row"
                  key={team.team}
                  style={
                    {
                      '--team-color': team.color,
                      '--team-width': `${(team.goals / MAX_TEAM_GOALS) * 100}%`,
                      '--team-delay': `${index * 90}ms`,
                    } as CSSProperties
                  }
                >
                  <div className="team-meta">
                    <span className="team-name">{team.team}</span>
                    <span className="team-note">{team.note}</span>
                  </div>
                  <div className="team-track" aria-hidden="true">
                    <span className="team-fill" />
                  </div>
                  <div className="team-numbers">
                    <span className="team-goals display">{team.goals}</span>
                    <span className="team-apps">{team.appearances} apps</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={yearChart.ref}
            className={`numbers-panel year-panel ${yearChart.inView ? 'is-inview' : ''}`}
          >
            <div className="panel-head">
              <p className="eyebrow">Goals by calendar year</p>
              <h3 className="panel-title display">The rhythm</h3>
              <p className="panel-intro">
                2013 stands alone: 69 goals in a single calendar year. The 2026 total is
                a partial year, current to the snapshot date.
              </p>
            </div>

            <div className="year-chart">
              <div className="year-grid" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div
                className="year-bars"
                role="list"
                aria-label="Senior goals scored in each calendar year"
              >
                {GOALS_BY_YEAR.map((year, index) => {
                  const isPeak = year.goals === MAX_YEAR_GOALS
                  const isPartial = year.year === 2026
                  return (
                    <div
                      className={`year-column ${isPeak ? 'is-peak' : ''} ${
                        isPartial ? 'is-partial' : ''
                      }`}
                      key={year.year}
                      role="listitem"
                      aria-label={`${year.year}: ${year.goals} goals${isPartial ? ', partial year' : ''}`}
                      style={
                        {
                          '--year-height': `${(year.goals / MAX_YEAR_GOALS) * 100}%`,
                          '--year-delay': `${index * 32}ms`,
                        } as CSSProperties
                      }
                    >
                      <span className="year-bar-value">{year.goals}</span>
                      <span className="year-bar" aria-hidden="true" />
                      <span className="year-label">{year.year}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="year-chart-foot">
              <span>
                <span className="legend-swatch" aria-hidden="true" /> Calendar-year goals
              </span>
              <span>Peak · 2013 — 69</span>
              <span>2026 · partial</span>
            </div>
          </div>
        </div>

        <div className="milestone-band">
          {CAREER_MILESTONES.map((milestone) => (
            <div className="milestone" key={`${milestone.value}-${milestone.year}`}>
              <span className="milestone-year">{milestone.year}</span>
              <span className="milestone-value display">
                <Counter
                  value={Number(milestone.value)}
                  label={`${milestone.value} ${milestone.label}`}
                />
              </span>
              <span className="milestone-label">{milestone.label}</span>
            </div>
          ))}
        </div>

        <p className="stats-footnote">{STATS_NOTE}</p>
      </div>
    </section>
  )
}
