import { useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

export type Quality = 'high' | 'low'

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })

    if (!gl) return false
    const loseContext = gl.getExtension('WEBGL_lose_context')
    loseContext?.loseContext()
    return true
  } catch {
    return false
  }
}

export function useDeviceProfile() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(max-width: 1023px)')
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [lowPower, setLowPower] = useState(false)

  useEffect(() => {
    setWebgl(detectWebGL())

    const nav = navigator as NavigatorWithMemory
    const memory = nav.deviceMemory ?? 8
    const cores = nav.hardwareConcurrency ?? 8
    const saveData = nav.connection?.saveData ?? false
    setLowPower(saveData || memory <= 4 || cores <= 4)
  }, [])

  const quality: Quality = useMemo(
    () => (isMobile || isTablet || lowPower ? 'low' : 'high'),
    [isMobile, isTablet, lowPower],
  )

  return {
    webgl,
    isMobile,
    isTablet,
    lowPower,
    quality,
    dpr: (quality === 'low' ? [1, 1.4] : [1, 1.8]) as [number, number],
  }
}
