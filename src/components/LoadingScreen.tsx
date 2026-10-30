export function LoadingScreen({ leaving = false }: { leaving?: boolean }) {
  return (
    <div
      className={`loading-screen ${leaving ? 'is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading CR7 — The Legend"
    >
      <div className="loading-grid" aria-hidden="true" />
      <div className="loading-mark">
        <span className="loading-seven">7</span>
        <span className="loading-orbit" aria-hidden="true" />
        <span className="loading-orbit loading-orbit-two" aria-hidden="true" />
      </div>
      <div className="loading-copy">
        <p className="eyebrow">CR7 · The Legend</p>
        <p className="loading-title">Staging the atmosphere</p>
        <div className="loading-line" aria-hidden="true">
          <span />
        </div>
        <p className="loading-note">
          Preparing the 3D stadium, fonts and archive · This will only take a moment
        </p>
      </div>
      <span className="loading-corner loading-corner-tl" aria-hidden="true" />
      <span className="loading-corner loading-corner-tr" aria-hidden="true" />
      <span className="loading-corner loading-corner-bl" aria-hidden="true" />
      <span className="loading-corner loading-corner-br" aria-hidden="true" />
      <p className="loading-disclaimer">Independent fan tribute · Not an official website</p>
    </div>
  )
}
