import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useInView } from '../../hooks/useInView'

type CounterProps = {
  value: number
  duration?: number
  format?: 'comma'
  suffix?: string
  className?: string
  label?: string
}

const formatter = new Intl.NumberFormat('en-US')

export function Counter({
  value,
  duration = 1600,
  format,
  suffix = '',
  className = '',
  label,
}: CounterProps) {
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>(
    { threshold: 0.15, rootMargin: '0px' },
    true,
  )
  const [display, setDisplay] = useState(reduced ? value : 0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    if (reduced) {
      setDisplay(value)
      return
    }

    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 4)
      setDisplay(Math.round(value * eased))
      if (elapsed < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, inView, reduced, value])

  useEffect(() => {
    if (reduced) setDisplay(value)
  }, [reduced, value])

  const formatted = format === 'comma' ? formatter.format(display) : String(display)
  const finalLabel = format === 'comma' ? formatter.format(value) : String(value)

  return (
    <span ref={ref} className={className} aria-label={label ?? `${finalLabel}${suffix}`}>
      <span aria-hidden="true">
        {formatted}
        {suffix}
      </span>
    </span>
  )
}
