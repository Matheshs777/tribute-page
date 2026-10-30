import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Close } from './Icons'

type DialogProps = {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  className?: string
  closeLabel?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
  className = '',
  closeLabel = 'Close dialog',
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => closeRef.current?.focus(), 60)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return
      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      previous?.focus()
    }
  }, [onClose, open])

  if (!open) return null

  return createPortal(
    <div className="dialog-root" role="presentation">
      <button
        type="button"
        className="dialog-backdrop"
        aria-label="Close dialog"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        className={`dialog-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <button ref={closeRef} type="button" className="dialog-close" onClick={onClose}>
          <Close className="icon-sm" />
          <span className="sr-only">{closeLabel}</span>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
