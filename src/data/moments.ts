import type { ImageCredit } from './site'

export type MomentCategory = 'clubs' | 'portugal' | 'honours'

export type Moment = {
  id: string
  title: string
  year: string
  eyebrow: string
  category: MomentCategory
  image: string
  imageAlt: string
  imageNote: string
  imageCredit: ImageCredit
  caption: string
  context: string
  featured?: boolean
  position?: string
}

export const MOMENTS: Moment[] = [
  {
    id: 'madeira-to-lisbon',
    title: 'The first light',
    year: '2002',
    eyebrow: 'Sporting CP',
    category: 'clubs',
    image: '/assets/images/alvalade-stadium.webp',
    imageAlt: 'Estádio Alvalade XXI in Lisbon, home of Sporting CP.',
    imageNote: 'Estádio Alvalade XXI, Lisbon. Photograph by Vitor Oliveira.',
    imageCredit: {
      artist: 'Vitor Oliveira',
      license: 'CC BY-SA 2.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_Alvalade_XXI_-_Lisboa_-_Portugal_(2744592935).jpg',
    },
    caption: 'Before the world knew the name, Alvalade did.',
    context:
      'Ronaldo joined Sporting’s academy from Madeira and made his senior breakthrough in 2002–03. Five goals in 31 appearances were enough to convince Manchester United to move for him the following summer.',
    featured: true,
    position: 'center',
  },
  {
    id: 'old-trafford-arrival',
    title: 'The Manchester leap',
    year: '2003',
    eyebrow: 'Manchester United',
    category: 'clubs',
    image: '/assets/images/cr7-man-utd-2008.webp',
    imageAlt:
      'Cristiano Ronaldo in action for Manchester United against Celtic at Celtic Park, 2008.',
    imageNote: 'Manchester United v Celtic, 5 November 2008. Photograph by Tsutomu Takasu.',
    imageCredit: {
      artist: 'Tsutomu Takasu / gowestphoto',
      license: 'CC BY 2.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_of_Manchester_United,_November_5,_2008,_B.jpg',
    },
    caption: 'A teenager with a number on his back and a point to prove.',
    context:
      'The 2003 move to Old Trafford turned potential into production. By 2008 he had a Premier League title, a Champions League medal and his first Ballon d’Or. The photograph is from a European night in November 2008, not his debut.',
    position: 'center 30%',
  },
  {
    id: 'gold-standard',
    title: 'The gold standard',
    year: '2008–2017',
    eyebrow: 'Ballon d’Or',
    category: 'honours',
    image: '/assets/images/cr7-ballon-dor.webp',
    imageAlt: 'Cristiano Ronaldo holding the Ballon d’Or awarded for 2014.',
    imageNote: 'Ronaldo with the 2014 Ballon d’Or, January 2015. Photograph by Anish Morarji.',
    imageCredit: {
      artist: 'Anish Morarji',
      license: 'CC BY 2.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_-_Ballon_d%27Or_(cropped).jpg',
    },
    caption: 'Five awards. A decade spent turning brilliance into routine.',
    context:
      'Ronaldo won the Ballon d’Or in 2008, 2013, 2014, 2016 and 2017. The photograph shows the trophy presented for 2014 — a reminder that the individual honours were distributed across two clubs and two distinct versions of the same player.',
    featured: true,
    position: 'center 22%',
  },
  {
    id: 'bernabeu-era',
    title: 'The Madrid era',
    year: '2009–2018',
    eyebrow: 'Real Madrid',
    category: 'clubs',
    image: '/assets/images/cr7-real-madrid-action.webp',
    imageAlt: 'Cristiano Ronaldo in action for Real Madrid, October 2010.',
    imageNote: 'Real Madrid, October 2010. Photograph by Dagur Brynjólfsson.',
    imageCredit: {
      artist: 'Dagur Brynjólfsson',
      license: 'CC BY-SA 2.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_-_October_12,_2010.jpg',
    },
    caption: '450 goals. Four European Cups. One relentless standard.',
    context:
      'Ronaldo scored 450 goals in 438 games for Real Madrid, becoming the club’s all-time leading scorer. Four Champions League titles in five seasons from 2014 to 2018 turned the era into a dynasty.',
    featured: true,
    position: 'center 25%',
  },
  {
    id: 'euro-2016',
    title: 'Europe’s summit',
    year: '2016',
    eyebrow: 'Portugal',
    category: 'portugal',
    image: '/assets/images/cr7-portugal-2016.webp',
    imageAlt: 'Cristiano Ronaldo playing for Portugal against Poland at Euro 2016.',
    imageNote: 'Portugal v Poland, UEFA Euro 2016 quarter-final. Photograph by Chensiyuan.',
    imageCredit: {
      artist: 'Chensiyuan',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:1_cristiano_ronaldo_2016.jpg',
    },
    caption: 'The night a country’s wait became a trophy.',
    context:
      'Portugal won Euro 2016 by beating France 1–0 in the final. Ronaldo captained the team and was forced off injured in the first half. The photograph is from the quarter-final against Poland earlier in the tournament.',
    featured: true,
    position: 'center 25%',
  },
  {
    id: 'turin',
    title: 'The Turin test',
    year: '2018–2021',
    eyebrow: 'Juventus',
    category: 'clubs',
    image: '/assets/images/cr7-juventus-2019.webp',
    imageAlt: 'Cristiano Ronaldo after the Turin derby for Juventus, November 2019.',
    imageNote: 'Torino v Juventus, November 2019. Photograph by IamAlwaysHere / Danyele.',
    imageCredit: {
      artist: 'IamAlwaysHere / Danyele',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:2019-20_Serie_A_-_Torino_v_Juventus_-_Cristiano_Ronaldo_(cropped).jpg',
    },
    caption: 'A new league, a new language, the same scoring instinct.',
    context:
      'Ronaldo scored 101 goals in 134 games for Juventus and won two Serie A titles. He became the first player to finish as top scorer in the Premier League, La Liga and Serie A — a challenge chosen at an age when comfort was available.',
    position: 'center 20%',
  },
  {
    id: 'return',
    title: 'The return',
    year: '2021',
    eyebrow: 'Manchester United',
    category: 'clubs',
    image: '/assets/images/cr7-man-utd-2021.webp',
    imageAlt: 'Cristiano Ronaldo during Manchester United v Everton, October 2021.',
    imageNote: 'Manchester United v Everton, 2 October 2021. Photograph by Ardfern.',
    imageCredit: {
      artist: 'Ardfern',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_vs_Everton_2021.jpg',
    },
    caption: 'Old Trafford, again. The theatre had changed; the spotlight had not.',
    context:
      'Ronaldo returned to Manchester United in 2021 and scored 27 goals in 54 appearances across the second spell. It was a chapter of landmark goals, European nights and a team searching for its next identity.',
    position: 'center 25%',
  },
  {
    id: 'al-nassr',
    title: 'The new frontier',
    year: '2023–',
    eyebrow: 'Al Nassr',
    category: 'clubs',
    image: '/assets/images/cr7-al-nassr-2023.webp',
    imageAlt: 'Cristiano Ronaldo playing for Al Nassr against Persepolis in September 2023.',
    imageNote: 'Al Nassr v Persepolis, September 2023. Photograph by Meghdad Madadi.',
    imageCredit: {
      artist: 'Meghdad Madadi',
      license: 'CC BY 4.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_with_Al_Nassr,_19_September_2023_-_09.jpg',
    },
    caption: 'The spotlight moves. The appetite follows.',
    context:
      'Ronaldo joined Al Nassr in January 2023. His goals helped reshape the attention around Saudi football, and the 2025–26 Saudi Pro League title became his eighth league crown in a fourth country.',
    position: 'center 20%',
  },
  {
    id: 'record-breaker',
    title: 'Still rewriting the record',
    year: '2025',
    eyebrow: 'Portugal',
    category: 'portugal',
    image: '/assets/images/cr7-celebration-2025.webp',
    imageAlt: 'Cristiano Ronaldo celebrates a goal for Portugal in September 2025.',
    imageNote: 'Armenia v Portugal, World Cup qualifying, 6 September 2025. Photograph by YantsImages.',
    imageCredit: {
      artist: 'YantsImages',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_0876.jpg',
    },
    caption: 'The celebration is familiar. The record keeps moving.',
    context:
      'Ronaldo’s international tally continued to climb through the 2026 World Cup qualifying campaign. At 41, he remains the men’s all-time leading international scorer — a record that has changed hands many times, always in the same direction.',
    featured: true,
    position: 'center 22%',
  },
  {
    id: 'next-chapter',
    title: 'The next chapter',
    year: '2026',
    eyebrow: 'Portugal',
    category: 'portugal',
    image: '/assets/images/cr7-portugal-2026.webp',
    imageAlt: 'Cristiano Ronaldo during Croatia v Portugal at the 2026 FIFA World Cup.',
    imageNote: 'Croatia v Portugal, 2 July 2026. Photograph by Bryan Berlin.',
    imageCredit: {
      artist: 'Bryan Berlin',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_(cropped).jpg',
    },
    caption: 'A record sixth World Cup. A story still being written.',
    context:
      'Ronaldo appeared at the 2026 FIFA World Cup, extending a career that has spanned more than two decades at the top of the game. The page is deliberately left open: totals and tournament records change.',
    position: 'center 20%',
  },
]

export const MOMENT_FILTERS = [
  { id: 'all', label: 'All moments' },
  { id: 'clubs', label: 'Club chapters' },
  { id: 'portugal', label: 'Portugal' },
  { id: 'honours', label: 'Honours' },
] as const
