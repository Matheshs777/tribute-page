import { Component, type ReactNode } from 'react'

type SceneBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
  label: string
}

type SceneBoundaryState = {
  failed: boolean
}

/**
 * Keeps a WebGL or model failure local to one scene. The rest of the page stays
 * fully usable, and an authored static fallback takes over.
 */
export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false }

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    console.warn(`${this.props.label} could not render. Showing the static fallback.`, error)
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}
