import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type SoundContextValue = {
  enabled: boolean
  toggleSound: () => void
  playCrowd: () => void
  playSoftImpact: () => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

function createNoiseBuffer(context: AudioContext, seconds = 4): AudioBuffer {
  const length = Math.floor(context.sampleRate * seconds)
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const channel = buffer.getChannelData(0)
  let last = 0

  for (let index = 0; index < length; index += 1) {
    const white = Math.random() * 2 - 1
    last = 0.96 * last + 0.04 * white
    channel[index] = last * 3.4
  }

  return buffer
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const contextRef = useRef<AudioContext | null>(null)
  const ambientRef = useRef<{ gain: GainNode; source: AudioBufferSourceNode; oscillator: OscillatorNode } | null>(null)

  const ensureContext = useCallback(() => {
    if (!contextRef.current) {
      const AudioCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

      if (!AudioCtor) return null
      contextRef.current = new AudioCtor()
    }

    if (contextRef.current.state === 'suspended') {
      void contextRef.current.resume()
    }

    return contextRef.current
  }, [])

  const startAmbient = useCallback(() => {
    const context = ensureContext()
    if (!context || ambientRef.current) return

    const source = context.createBufferSource()
    source.buffer = createNoiseBuffer(context, 5)
    source.loop = true

    const lowpass = context.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 190
    lowpass.Q.value = 0.6

    const gain = context.createGain()
    gain.gain.value = 0

    source.connect(lowpass)
    lowpass.connect(gain)
    gain.connect(context.destination)
    source.start()

    const oscillator = context.createOscillator()
    const rumbleGain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 42
    rumbleGain.gain.value = 0.012
    oscillator.connect(rumbleGain)
    rumbleGain.connect(gain)
    oscillator.start()

    gain.gain.setTargetAtTime(0.036, context.currentTime, 1.4)
    ambientRef.current = { gain, source, oscillator }
  }, [ensureContext])

  const stopAmbient = useCallback(() => {
    const context = contextRef.current
    const ambient = ambientRef.current
    if (!context || !ambient) return

    ambient.gain.gain.setTargetAtTime(0, context.currentTime, 0.18)
    window.setTimeout(() => {
      try {
        ambient.source.stop()
        ambient.oscillator.stop()
      } catch {
        // Source may already be stopped.
      }
      ambientRef.current = null
    }, 700)
  }, [])

  const toggleSound = useCallback(() => {
    setEnabled((current) => {
      if (current) {
        stopAmbient()
        return false
      }

      startAmbient()
      return true
    })
  }, [startAmbient, stopAmbient])

  const playSoftImpact = useCallback(() => {
    if (!enabled) return
    const context = ensureContext()
    if (!context) return

    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(120, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(48, context.currentTime + 0.3)
    gain.gain.setValueAtTime(0.045, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.38)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.4)
  }, [enabled, ensureContext])

  const playCrowd = useCallback(() => {
    if (!enabled) return
    const context = ensureContext()
    if (!context) return

    const now = context.currentTime
    const source = context.createBufferSource()
    source.buffer = createNoiseBuffer(context, 3.4)

    const bandpass = context.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.setValueAtTime(360, now)
    bandpass.frequency.exponentialRampToValueAtTime(1400, now + 0.65)
    bandpass.frequency.exponentialRampToValueAtTime(520, now + 3.2)
    bandpass.Q.value = 0.55

    const gain = context.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.32)
    gain.gain.setValueAtTime(0.13, now + 1.2)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.35)

    source.connect(bandpass)
    bandpass.connect(gain)
    gain.connect(context.destination)
    source.start(now)
    source.stop(now + 3.4)

    const impact = context.createOscillator()
    const impactGain = context.createGain()
    impact.type = 'triangle'
    impact.frequency.setValueAtTime(84, now)
    impact.frequency.exponentialRampToValueAtTime(38, now + 0.55)
    impactGain.gain.setValueAtTime(0.16, now)
    impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85)
    impact.connect(impactGain)
    impactGain.connect(context.destination)
    impact.start(now)
    impact.stop(now + 0.9)
  }, [enabled, ensureContext])

  useEffect(() => {
    return () => {
      stopAmbient()
      void contextRef.current?.close()
    }
  }, [stopAmbient])

  const value = useMemo(
    () => ({ enabled, toggleSound, playCrowd, playSoftImpact }),
    [enabled, playCrowd, playSoftImpact, toggleSound],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used inside SoundProvider')
  return context
}
