import type { ImageCredit } from './site'

/**
 * Additional photography used outside the data-driven career and gallery
 * records. Every image that appears in the interface has a credit here or on
 * its parent data object.
 */export const TRAINING_CREDIT: ImageCredit = {
  artist: 'Roger Gorączniak',
  license: 'CC BY 3.0',
  source: 'Wikimedia Commons',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_Euro2012_training_01.jpg',
}

export const TUNNEL_CREDIT: ImageCredit = {
  artist: 'Nate Loper',
  license: 'CC BY 2.0',
  source: 'Wikimedia Commons',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Chelsea_Football_Club_Players_Tunnel,_Stamford_Bridge,_London_(43494459622).jpg',
}

export const STADIUM_CREDIT: ImageCredit = {
  artist: 'Chris Downer',
  license: 'CC BY-SA 2.0',
  source: 'Wikimedia Commons',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Wembley,_the_stadium_floodlit_-_geograph.org.uk_-_1500423.jpg',
}

export const UNUSED_ASSETS = [
  'cr7-boots.webp — boots on display at the Santiago Bernabéu',
  'cr7-madrid-back.webp — Real Madrid, number 7 from behind',
  'cr7-man-utd-celebration.webp — Manchester United goal celebration',
  'cr7-real-madrid-2010.webp — Real Madrid portrait, 2010',
  'cr7-world-cup-2018.webp — Portugal at the 2018 World Cup',
]

export type ModelCredit = {
  title: string
  role: string
  artist: string
  license: string
  licenseUrl: string
  sourceUrl: string
}

/**
 * 3D models shipped under public/models/. Both are community uploads made
 * available under CC BY 4.0; their asset metadata (author, licence, source)
 * is embedded in the GLB files themselves and must keep appearing here and in
 * the site footer whenever either file is redistributed.
 */
export const MODEL_CREDITS: ModelCredit[] = [
  {
    title: '“cristiano ronaldo” athlete model',
    role: 'Hero and celebration figure',
    artist: 'aleganda (Sketchfab)',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://sketchfab.com/3d-models/cristiano-ronaldo-710d1b01b0624135861feb3f0bb7048a',
  },
  {
    title: '“Ballon D’or” model',
    role: 'Ballon d’Or trophy exhibit',
    artist: 'MirAl00 (Sketchfab)',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://sketchfab.com/3d-models/ballon-dor-87088ae6bebf49fc9b3ab4881b926e73',
  },
]
