export type NavItem = {
  id: string
  label: string
  short: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'legacy', label: 'The Legend', short: 'Legend' },
  { id: 'journey', label: 'The Journey', short: 'Journey' },
  { id: 'trophies', label: 'Trophy Room', short: 'Trophies' },
  { id: 'numbers', label: 'The Numbers', short: 'Numbers' },
  { id: 'mindset', label: 'The Mindset', short: 'Mindset' },
  { id: 'moments', label: 'Iconic Moments', short: 'Moments' },
  { id: 'siuuu', label: 'The Moment', short: 'SIUUU' },
  { id: 'continues', label: 'The Legacy', short: 'Legacy' },
]

export const VERIFIED_DATE = '23 October 2026'
export const TROPHY_VERIFIED_DATE = '9 September 2026'

export const OFFICIAL_LINKS = [
  { label: 'Official website', href: 'https://www.cristianoronaldo.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/cristiano/' },
  { label: 'X', href: 'https://x.com/Cristiano' },
  { label: 'Facebook', href: 'https://www.facebook.com/Cristiano' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Cristiano' },
]

export const DATA_SOURCES = [
  {
    label: 'Wikipedia — Cristiano Ronaldo career statistics',
    href: 'https://en.wikipedia.org/wiki/Cristiano_Ronaldo',
    note: 'Club and international totals, as of 23 October 2026.',
  },
  {
    label: 'Wikipedia — List of career achievements',
    href: 'https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo',
    note: 'Honours, records and 35 senior team trophies.',
  },
  {
    label: 'UEFA — international scoring record',
    href: 'https://www.uefa.com/euro2024/news/026a-1297500e1b34-a17bbbcad258-1000--cristiano-ronaldo-all-time-leading-scorer-in-men-s-internationa/',
    note: 'International goals context and records.',
  },
  {
    label: 'Opta Analyst — international career',
    href: 'https://theanalyst.com/players/13574/cristiano-ronaldo/national/career',
    note: 'Appearances, goals and competition splits.',
  },
  {
    label: 'ESPN — road to 1,000 goals',
    href: 'https://www.espn.com/football/story/_/id/46751020/cristiano-ronaldo-goal-tracker-road-1000-career-goals',
    note: 'Career tally context, October 2026.',
  },
  {
    label: 'Fabrizio Romano — 985 career goals',
    href: 'https://x.com/FabrizioRomano/status/2115892342003507326',
    note: 'Reported after the Al-Nassr hat-trick, 29 October 2026.',
  },
]

export type ImageCredit = {
  artist: string
  license: string
  licenseUrl?: string
  source: string
  sourceUrl: string
}

export const DISCLAIMER =
  'This is an independent fan-made tribute website. It is not affiliated with or endorsed by Cristiano Ronaldo or any football club. It is a non-commercial fan project; all photographs are used under their respective licences and credited in the gallery and footer. No official logos are used, and the 3D figures are community-licensed or original interpretations, credited in the footer. Statistics are compiled from public records and are dated in the interface.'
