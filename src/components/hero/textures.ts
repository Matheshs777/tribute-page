import * as THREE from 'three'

function finishTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

export function createGlowTexture(
  inner = 'rgba(201, 162, 75, 0.9)',
  middle = 'rgba(201, 162, 75, 0.28)',
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(0.42, middle)
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function createStandsTexture(width = 2048, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const sky = ctx.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, '#050506')
  sky.addColorStop(0.42, '#0a0b0d')
  sky.addColorStop(0.7, '#111317')
  sky.addColorStop(1, '#050505')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)

  // Roof and tier silhouettes.
  ctx.fillStyle = '#08090a'
  ctx.fillRect(0, 0, width, height * 0.18)
  ctx.fillStyle = 'rgba(201, 162, 75, 0.08)'
  ctx.fillRect(0, height * 0.18, width, 3)

  const tiers = [
    { top: 0.2, bottom: 0.47, density: 0.55 },
    { top: 0.5, bottom: 0.78, density: 0.8 },
    { top: 0.8, bottom: 0.96, density: 0.45 },
  ]

  tiers.forEach((tier, tierIndex) => {
    const top = height * tier.top
    const bottom = height * tier.bottom
    ctx.fillStyle = tierIndex === 1 ? '#08090b' : '#0b0c0e'
    ctx.fillRect(0, top, width, bottom - top)

    const dots = Math.floor(width * 0.34 * tier.density)
    for (let index = 0; index < dots; index += 1) {
      const x = Math.random() * width
      const y = top + Math.random() * (bottom - top)
      const bright = Math.random()
      const radius = bright > 0.93 ? 2.2 : bright > 0.7 ? 1.3 : 0.8
      const warm = Math.random() > 0.35
      ctx.fillStyle = warm
        ? `rgba(244, 219, 166, ${0.18 + bright * 0.55})`
        : `rgba(176, 203, 226, ${0.12 + bright * 0.36})`
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  // A bright stadium rim light.
  const rim = ctx.createLinearGradient(0, height * 0.16, 0, height * 0.24)
  rim.addColorStop(0, 'rgba(0, 0, 0, 0)')
  rim.addColorStop(0.5, 'rgba(224, 208, 172, 0.12)')
  rim.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = rim
  ctx.fillRect(0, height * 0.16, width, height * 0.08)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

export function createPitchTexture(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(
    size * 0.5,
    size * 0.45,
    size * 0.08,
    size * 0.5,
    size * 0.5,
    size * 0.52,
  )
  gradient.addColorStop(0, '#12160f')
  gradient.addColorStop(0.68, '#0a0c09')
  gradient.addColorStop(1, '#050505')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  // Brushed turf texture.
  ctx.globalAlpha = 0.13
  for (let index = 0; index < 90; index += 1) {
    const y = (index / 90) * size
    ctx.fillStyle = index % 2 === 0 ? '#9ca57f' : '#35402b'
    ctx.fillRect(0, y, size, size / 180)
  }
  ctx.globalAlpha = 1

  ctx.strokeStyle = 'rgba(230, 219, 187, 0.36)'
  ctx.lineWidth = 3
  const inset = size * 0.06
  const border = size * 0.12

  // Circular pitch boundary.
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.43, 0, Math.PI * 2)
  ctx.stroke()

  // Halfway line.
  ctx.beginPath()
  ctx.moveTo(inset, size / 2)
  ctx.lineTo(size - inset, size / 2)
  ctx.stroke()

  // Centre circle and spot.
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.1, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(201, 162, 75, 0.85)'
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, 7, 0, Math.PI * 2)
  ctx.fill()

  // Penalty areas, top and bottom.
  ;[0, 1].forEach((side) => {
    const y = side === 0 ? inset : size - border
    ctx.strokeRect(size * 0.31, y, size * 0.38, border - inset)
    ctx.strokeRect(size * 0.405, side === 0 ? inset : size - inset - border * 0.42, size * 0.19, border * 0.42)
  })

  // Gold corner arcs.
  ctx.strokeStyle = 'rgba(201, 162, 75, 0.45)'
  const corners = [
    [inset, inset, 0],
    [size - inset, inset, Math.PI / 2],
    [size - inset, size - inset, Math.PI],
    [inset, size - inset, -Math.PI / 2],
  ]
  corners.forEach(([x, y, rotation]) => {
    ctx.beginPath()
    ctx.arc(x, y, size * 0.045, rotation, rotation + Math.PI / 2)
    ctx.stroke()
  })

  // Centre watermark.
  ctx.save()
  ctx.translate(size / 2, size / 2 + 8)
  ctx.fillStyle = 'rgba(201, 162, 75, 0.12)'
  ctx.font = `900 ${size * 0.32}px Anton, Impact, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('CR7', 0, 0)
  ctx.restore()

  return finishTexture(canvas)
}

export function createNumberTexture(
  number = '7',
  foreground = '#d8b55f',
  background = 'transparent',
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  if (background !== 'transparent') {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, 512, 512)
  }

  ctx.fillStyle = foreground
  ctx.font = '900 320px Anton, Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(201, 162, 75, 0.32)'
  ctx.shadowBlur = 22
  ctx.fillText(number, 256, 274)

  return finishTexture(canvas)
}

export function createBallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#e9e4d4'
  ctx.fillRect(0, 0, 1024, 512)

  // Dark panels laid over a warm ivory ball.
  ctx.fillStyle = '#121212'
  const panels = [
    [140, 110, 76],
    [360, 80, 58],
    [600, 130, 70],
    [880, 86, 56],
    [250, 330, 62],
    [520, 352, 74],
    [808, 312, 60],
    [70, 260, 44],
    [968, 272, 48],
    [400, 470, 48],
    [720, 472, 44],
  ]

  panels.forEach(([x, y, radius], index) => {
    ctx.beginPath()
    const sides = 5
    for (let side = 0; side < sides; side += 1) {
      const angle = (side / sides) * Math.PI * 2 - Math.PI / 2
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius * 0.72
      if (side === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()

    if (index % 2 === 0) {
      ctx.strokeStyle = 'rgba(201, 162, 75, 0.32)'
      ctx.lineWidth = 6
      ctx.stroke()
    }
  })

  // Fine seams.
  ctx.strokeStyle = 'rgba(28, 28, 28, 0.35)'
  ctx.lineWidth = 3
  for (let index = 0; index < 5; index += 1) {
    ctx.beginPath()
    ctx.arc(512, 256, 160 + index * 46, 0, Math.PI * 2)
    ctx.stroke()
  }

  return finishTexture(canvas)
}
