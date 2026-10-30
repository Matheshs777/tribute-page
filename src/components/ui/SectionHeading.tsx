import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionHeadingProps = {
  index: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  align = 'left',
  light = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <header
      className={`section-heading ${align === 'center' ? 'section-heading-center' : ''} ${
        light ? 'is-light' : ''
      } ${className}`}
    >
      <Reveal>
        <div className="section-heading-top">
          <span className="section-index">{index}</span>
          <span className="eyebrow">{eyebrow}</span>
          <span className="section-rule" aria-hidden="true" />
        </div>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="section-title display">{title}</h2>
      </Reveal>
      {intro ? (
        <Reveal delay={170}>
          <div className="section-intro">{intro}</div>
        </Reveal>
      ) : null}
    </header>
  )
}
