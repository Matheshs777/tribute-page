type IconProps = {
  className?: string
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function ArrowLeft({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12H4m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function Play({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 6 9 6-9 6V6Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function Pause({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6v12M15 6v12" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function Close({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function SoundOn({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10v4h3l4 3V7L7 10H4Zm11-2.5a6 6 0 0 1 0 9m2.5-12a10 10 0 0 1 0 15"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  )
}

export function SoundOff({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3l4 3V7L7 10H4Zm11 0 5 4m0-4-5 4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function Menu({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function Star({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m8 1 1.9 4.3L14 6l-3.2 3 1 4.5L8 11.2 4.2 13.5l1-4.5L2 6l4.1-.7L8 1Z" fill="currentColor" />
    </svg>
  )
}
