import { useEffect, useRef, useState } from 'react'

export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  once = true,
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const { threshold, rootMargin, root } = options
  const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : threshold

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        if (once) observer.disconnect()
      } else if (!once) {
        setInView(false)
      }
    }, { threshold, rootMargin, root })

    observer.observe(element)
    return () => observer.disconnect()
  }, [once, root, rootMargin, thresholdKey, threshold])

  return { ref, inView }
}
