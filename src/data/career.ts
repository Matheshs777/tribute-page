import type { ImageCredit } from './site'

export type CareerChapter = {
  id: string
  year: string
  period: string
  club: string
  place: string
  accent: string
  eyebrow: string
  headline: string
  story: string
  image: string
  imageAlt: string
  imagePosition?: string
  imageCredit: ImageCredit
  stats: { label: string; value: string }[]
  honours: string[]
  note?: string
}

export const CAREER_CHAPTERS: CareerChapter[] = [
  {
    id: 'sporting',
    year: '2002',
    period: '2002–2003',
    club: 'Sporting CP',
    place: 'Lisbon, Portugal',
    accent: '#2f8a5b',
    eyebrow: 'Chapter 01 · The beginning',
    headline: 'A local boy walks into the light.',
    story:
      'Born in Funchal, Madeira, Cristiano Ronaldo moved to Lisbon as a teenager and came through Sporting’s academy. He made his first-team breakthrough in 2002–03, scoring five goals in 31 senior appearances and announcing a talent that could not stay hidden for long.',
    image: '/assets/images/alvalade-stadium.webp',
    imageAlt: 'Estádio Alvalade XXI, the home of Sporting CP in Lisbon.',
    imageCredit: {
      artist: 'Vitor Oliveira',
      license: 'CC BY-SA 2.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_Alvalade_XXI_-_Lisboa_-_Portugal_(2744592935).jpg',
    },
    stats: [
      { label: 'Senior apps', value: '31' },
      { label: 'Goals', value: '5' },
      { label: 'First trophy', value: '2002' },
    ],
    honours: ['Supertaça Cândido de Oliveira 2002'],
    note: 'Club appearances and goals, all competitions. Senior first-team only.',
  },
  {
    id: 'united-first',
    year: '2003',
    period: '2003–2009',
    club: 'Manchester United',
    place: 'Manchester, England',
    accent: '#d9342b',
    eyebrow: 'Chapter 02 · The leap',
    headline: 'The teenager becomes a force.',
    story:
      'A move to Old Trafford in 2003 placed a wiry, fearless winger on one of football’s biggest stages. Across six seasons Ronaldo grew from prospect to Ballon d’Or winner, collecting three Premier League titles and the 2008 Champions League. His 42-goal 2007–08 season became the benchmark for the modern wide forward.',
    image: '/assets/images/cr7-man-utd-2008.webp',
    imageAlt:
      'Cristiano Ronaldo in action for Manchester United against Celtic at Celtic Park, November 2008.',
    imageCredit: {
      artist: 'Tsutomu Takasu / gowestphoto',
      license: 'CC BY 2.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_of_Manchester_United,_November_5,_2008,_B.jpg',
    },
    stats: [
      { label: 'Appearances', value: '292' },
      { label: 'Goals', value: '118' },
      { label: 'First Ballon d’Or', value: '2008' },
    ],
    honours: [
      'Premier League ×3',
      'UEFA Champions League 2007–08',
      'FA Cup 2003–04',
      'League Cup ×2',
      'FIFA Club World Cup 2008',
    ],
    note: 'First spell only. Photograph taken in November 2008.',
  },
  {
    id: 'real-madrid',
    year: '2009',
    period: '2009–2018',
    club: 'Real Madrid',
    place: 'Madrid, Spain',
    accent: '#e3bd5b',
    eyebrow: 'Chapter 03 · The era',
    headline: 'Records become a language.',
    story:
      'The world-record move to Madrid in 2009 opened the most prolific chapter of Ronaldo’s career. Nine seasons produced 450 goals in 438 appearances, four Champions League crowns, two La Liga titles and a scoring rhythm that redefined what a forward could sustain at the highest level.',
    image: '/assets/images/cr7-real-madrid-action.webp',
    imageAlt: 'Cristiano Ronaldo in Real Madrid colours, October 2010.',
    imageCredit: {
      artist: 'Dagur Brynjólfsson',
      license: 'CC BY-SA 2.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_-_October_12,_2010.jpg',
    },
    stats: [
      { label: 'Appearances', value: '438' },
      { label: 'Goals', value: '450' },
      { label: 'Goals per game', value: '1.03' },
    ],
    honours: [
      'UEFA Champions League ×4',
      'La Liga ×2',
      'Copa del Rey ×2',
      'FIFA Club World Cup ×3',
      'Ballon d’Or ×4',
    ],
    note: 'All competitions. The 450 goals are a Real Madrid club record.',
  },
  {
    id: 'juventus',
    year: '2018',
    period: '2018–2021',
    club: 'Juventus',
    place: 'Turin, Italy',
    accent: '#d9dde2',
    eyebrow: 'Chapter 04 · The challenge',
    headline: 'A new country. The same appetite.',
    story:
      'At 33, Ronaldo chose a new league rather than a softer landing. In Turin he scored 101 goals in 134 games, won two Serie A titles and became the first player to finish as top scorer in the Premier League, La Liga and Serie A. The challenge was the point.',
    image: '/assets/images/cr7-juventus-2019.webp',
    imageAlt:
      'Cristiano Ronaldo leaves the pitch after the Turin derby between Torino and Juventus, November 2019.',
    imageCredit: {
      artist: 'IamAlwaysHere / derivative by Danyele',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:2019-20_Serie_A_-_Torino_v_Juventus_-_Cristiano_Ronaldo_(cropped).jpg',
    },
    stats: [
      { label: 'Appearances', value: '134' },
      { label: 'Goals', value: '101' },
      { label: 'Serie A titles', value: '2' },
    ],
    honours: [
      'Serie A ×2',
      'Coppa Italia 2020–21',
      'Supercoppa Italiana ×2',
      'Serie A Footballer of the Year ×2',
    ],
    note: 'All competitions. Photograph taken in November 2019.',
  },
  {
    id: 'united-return',
    year: '2021',
    period: '2021–2022',
    club: 'Manchester United',
    place: 'Manchester, England',
    accent: '#d9342b',
    eyebrow: 'Chapter 05 · The return',
    headline: 'A familiar stage, a different weight.',
    story:
      'Ronaldo returned to Old Trafford in 2021 and scored 27 goals in 54 appearances across his second spell. There were unforgettable European nights and landmark goals, but the chapter was also a study in friction: an icon navigating a team in transition.',
    image: '/assets/images/cr7-man-utd-2021.webp',
    imageAlt:
      'Cristiano Ronaldo plays for Manchester United against Everton at Old Trafford, October 2021.',
    imageCredit: {
      artist: 'Ardfern',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_vs_Everton_2021.jpg',
    },
    stats: [
      { label: 'Appearances', value: '54' },
      { label: 'Goals', value: '27' },
      { label: 'Return', value: '2021' },
    ],
    honours: ['Premier League Player of the Month — September 2021'],
    note: 'Second spell, all competitions. Photograph taken in October 2021.',
  },
  {
    id: 'al-nassr',
    year: '2023',
    period: '2023–present',
    club: 'Al Nassr',
    place: 'Riyadh, Saudi Arabia',
    accent: '#f0c64c',
    eyebrow: 'Chapter 06 · The new frontier',
    headline: 'The hunger travels with him.',
    story:
      'Ronaldo joined Al Nassr in January 2023 and helped shift the global spotlight toward Saudi football. He has continued to score at a remarkable rate, passing 100 goals for the club and winning the 2025–26 Saudi Pro League — his eighth league title in four different countries.',
    image: '/assets/images/cr7-al-nassr-2023.webp',
    imageAlt: 'Cristiano Ronaldo playing for Al Nassr against Persepolis, September 2023.',
    imageCredit: {
      artist: 'Meghdad Madadi',
      license: 'CC BY 4.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_with_Al_Nassr,_19_September_2023_-_09.jpg',
    },
    stats: [
      { label: 'Appearances', value: '159' },
      { label: 'Goals', value: '135' },
      { label: 'Saudi Pro League', value: '2025–26' },
    ],
    honours: [
      'Saudi Pro League 2025–26',
      'Arab Club Champions Cup 2023',
      'Saudi Pro League top scorer 2023–24',
    ],
    note: 'Al Nassr totals as of 23 October 2026, all competitions.',
  },
  {
    id: 'portugal',
    year: 'POR',
    period: '2003–present',
    club: 'Portugal',
    place: 'The national team',
    accent: '#c53b47',
    eyebrow: 'Chapter 07 · The shirt',
    headline: 'The country on his shoulders.',
    story:
      'Ronaldo made his Portugal debut in 2003 and became the men’s international record goalscorer. He captained Portugal to Euro 2016 — their first major international title — and lifted the UEFA Nations League in 2019 and 2025. The individual numbers are extraordinary; the international chapters sit alongside them, not above them.',
    image: '/assets/images/cr7-portugal-2016.webp',
    imageAlt:
      'Cristiano Ronaldo playing for Portugal in the Euro 2016 quarter-final against Poland.',
    imageCredit: {
      artist: 'Chensiyuan',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:1_cristiano_ronaldo_2016.jpg',
    },
    stats: [
      { label: 'Caps', value: '234' },
      { label: 'Goals', value: '146' },
      { label: 'Major honours', value: '3' },
    ],
    honours: [
      'UEFA European Championship 2016',
      'UEFA Nations League 2018–19',
      'UEFA Nations League 2024–25',
    ],
    note: 'Senior international record as of 23 October 2026. Club achievements are separate.',
  },
]
