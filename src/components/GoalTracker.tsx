import { useEffect, useRef } from 'react'
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react'
import {
  CAREER_GOALS,
  CAREER_GOALS_DATE,
  CAREER_GOALS_PROGRESS,
  CAREER_GOALS_REMAINING,
  CAREER_GOAL_TARGET,
} from '../data/stats'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
const GOALS_LABEL = NUMBER_FORMATTER.format(CAREER_GOALS)
const TARGET_LABEL = NUMBER_FORMATTER.format(CAREER_GOAL_TARGET)
const PROGRESS_LABEL = `${CAREER_GOALS_PROGRESS.toFixed(1)}%`

const trackerSequence: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
}

const trackerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
}

const trackerNumbers: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

export function GoalTracker() {
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>(
    { threshold: 0.3, rootMargin: '0px 0px -8% 0px' },
    true,
  )

  const progress = useMotionValue(0)
  const springProgress = useSpring(progress, {
    stiffness: 55,
    damping: 20,
    mass: 0.9,
  })
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView) return

    if (reduced) {
      springProgress.jump(1)
      startedRef.current = true
      return
    }

    if (startedRef.current) return
    startedRef.current = true
    progress.set(1)
  }, [inView, progress, reduced, springProgress])

  const scored = useTransform(springProgress, (value) =>
    NUMBER_FORMATTER.format(Math.round(value * CAREER_GOALS)),
  )
  const percentage = useTransform(
    springProgress,
    (value) => `${(value * CAREER_GOALS_PROGRESS).toFixed(1)}% complete`,
  )
  const barWidth = useTransform(
    springProgress,
    (value) => `${value * CAREER_GOALS_PROGRESS}%`,
  )
  const markerLeft = useTransform(
    springProgress,
    (value) => `${value * CAREER_GOALS_PROGRESS}%`,
  )
  const glowOpacity = useTransform(springProgress, [0, 0.35, 1], [0, 0.82, 0.48])

  const scoredValue = reduced ? GOALS_LABEL : scored
  const percentageValue = reduced ? `${PROGRESS_LABEL} complete` : percentage
  const widthValue = reduced ? `${CAREER_GOALS_PROGRESS}%` : barWidth
  const markerValue = reduced ? `${CAREER_GOALS_PROGRESS}%` : markerLeft
  const glowValue = reduced ? 0.48 : glowOpacity

  return (
    <m.div
      ref={ref}
      className="goal-track-panel"
      variants={trackerSequence}
      initial={reduced ? false : 'hidden'}
      animate={inView || reduced ? 'show' : 'hidden'}
    >
      <m.p className="goal-kicker" variants={trackerItem}>
        The next line in the record
      </m.p>
      <m.h3 className="goal-headline display" variants={trackerItem}>
        {CAREER_GOALS_REMAINING} goals from <span>{TARGET_LABEL}</span>.
      </m.h3>

      <m.div
        className="goal-track"
        variants={trackerItem}
        role="progressbar"
        aria-label="Career goals progress toward 1,000"
        aria-valuemin={0}
        aria-valuemax={CAREER_GOAL_TARGET}
        aria-valuenow={CAREER_GOALS}
        aria-valuetext={`${GOALS_LABEL} of ${TARGET_LABEL} career goals scored, ${PROGRESS_LABEL} complete`}
        aria-orientation="horizontal"
        tabIndex={0}
      >
        <m.span
          className="goal-fill-glow"
          style={{ width: widthValue, opacity: glowValue }}
          aria-hidden="true"
        />
        <m.span
          className="goal-fill"
          style={{ width: widthValue }}
          aria-hidden="true"
        />
        <m.span
          className="goal-marker"
          style={{ left: markerValue }}
          aria-hidden="true"
        />
      </m.div>

      <m.div className="goal-track-scale" variants={trackerItem} aria-hidden="true">
        <span>0</span>
        <m.span className="goal-percentage">{percentageValue}</m.span>
        <span>{TARGET_LABEL}</span>
      </m.div>

      <m.div className="goal-numbers" variants={trackerNumbers}>
        <m.span variants={trackerItem}>
          <m.strong className="display" aria-hidden="true">
            {scoredValue}
          </m.strong>
          <span aria-hidden="true">Scored</span>
          <span className="sr-only">{GOALS_LABEL} scored</span>
        </m.span>
        <m.span className="goal-numbers-note" variants={trackerItem}>
          As of {CAREER_GOALS_DATE}
        </m.span>
        <m.span variants={trackerItem}>
          <strong className="display">{TARGET_LABEL}</strong>
          Target
        </m.span>
      </m.div>

      <m.p className="goal-caveat" variants={trackerItem}>
        Senior club and international goals. {GOALS_LABEL} is the requested display
        figure, dated {CAREER_GOALS_DATE}; the total moves after publication and this
        page is dated, not predictive.
      </m.p>
    </m.div>
  )
}
