import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
}

export function Reveal({ children, className = '', delay = 0, threshold = 0.14 }: RevealProps) {
  const reduced = useReducedMotion()

  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
    >
      {children}
    </m.div>
  )
}
