import sharp from 'sharp'
import { readdir, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

const inputDir = path.resolve('.raw-assets')
const outputDir = path.resolve('public/assets/images')
const files = (await readdir(inputDir)).filter((file) => /\.(jpe?g|png)$/i.test(file))
await rm(outputDir, { recursive: true, force: true })
await mkdir(outputDir, { recursive: true })

for (const file of files) {
  const input = path.join(inputDir, file)
  const base = path.parse(file).name
  const metadata = await sharp(input).rotate().metadata()
  const width = Math.min(metadata.width ?? 1600, 1600)

  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(path.join(outputDir, `${base}.webp`))

  console.log(`${file} -> ${base}.webp (${width}px)`)
}

// Social card: a restrained, branded crop using an authorised Commons photograph.
await sharp(path.join(inputDir, 'cr7-portugal-2016.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .modulate({ brightness: 0.6, saturation: 0.75 })
  .composite([
    {
      input: Buffer.from(`
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#060606" stop-opacity=".94"/>
              <stop offset=".62" stop-color="#060606" stop-opacity=".35"/>
              <stop offset="1" stop-color="#060606" stop-opacity=".08"/>
            </linearGradient>
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#f0d58a"/>
              <stop offset="1" stop-color="#8f7135"/>
            </linearGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#shade)"/>
          <rect x="80" y="54" width="1" height="522" fill="url(#gold)" opacity=".75"/>
          <text x="132" y="132" fill="#f0d58a" font-family="Arial, sans-serif" font-size="18" letter-spacing="7">AN INDEPENDENT FAN TRIBUTE</text>
          <text x="126" y="356" fill="#f4f1e9" font-family="Arial Black, Arial, sans-serif" font-size="164" letter-spacing="-6">CR7</text>
          <text x="132" y="438" fill="#f4f1e9" font-family="Arial Black, Arial, sans-serif" font-size="68" letter-spacing="2">THE LEGEND</text>
          <text x="136" y="524" fill="#d8d2c4" font-family="Arial, sans-serif" font-size="24" letter-spacing="4">GREATNESS IS EARNED.</text>
          <text x="1108" y="574" fill="#c9a24b" font-family="Arial, sans-serif" font-size="15" text-anchor="end" letter-spacing="3">NOT AN OFFICIAL WEBSITE</text>
        </svg>
      `),
    },
  ])
  .jpeg({ quality: 86 })
  .toFile(path.resolve('public/assets/og-cr7.jpg'))

console.log('Social card -> public/assets/og-cr7.jpg')
