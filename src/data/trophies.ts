import { CAREER_GOALS, CAREER_GOALS_DATE } from './stats'

export type TrophyKind = 'individual' | 'team'
export type TrophyScope = 'club' | 'international' | 'career'
export type TrophyModel = 'ballon' | 'champions' | 'euro' | 'league' | 'nations' | 'record'

export type Trophy = {
  id: string
  title: string
  shortTitle: string
  kind: TrophyKind
  scope: TrophyScope
  count: number
  display: string
  model: TrophyModel
  accent: string
  years: string[]
  summary: string
  detail: string
  breakdown?: string[]
  source: string
  sourceUrl: string
}

export const TROPHIES: Trophy[] = [
  {
    id: 'ballon-dor',
    title: 'Ballon d’Or',
    shortTitle: 'Ballon d’Or',
    kind: 'individual',
    scope: 'career',
    count: 5,
    display: '5×',
    model: 'ballon',
    accent: '#e7c66a',
    years: ['2008', '2013', '2014', '2016', '2017'],
    summary: 'Five times the world’s best player. A decade of sustained excellence.',
    detail:
      'Ronaldo won the award in 2008 with Manchester United, then four more times with Real Madrid. Only Lionel Messi has won more Ballons d’Or. The five awards are individual honours and are not counted within the 35 senior team trophies.',
    breakdown: ['2008 · Manchester United', '2013 · Real Madrid', '2014 · Real Madrid', '2016 · Real Madrid', '2017 · Real Madrid'],
    source: 'France Football / FIFA',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ballon_d%27Or',
  },
  {
    id: 'champions-league',
    title: 'UEFA Champions League',
    shortTitle: 'Champions League',
    kind: 'team',
    scope: 'club',
    count: 5,
    display: '5×',
    model: 'champions',
    accent: '#f2d994',
    years: ['2007–08', '2013–14', '2015–16', '2016–17', '2017–18'],
    summary: 'Five European crowns. The competition’s all-time leading scorer.',
    detail:
      'Ronaldo won his first Champions League with Manchester United in 2008, then four in five seasons with Real Madrid. He is the competition’s all-time top scorer with 140 goals and holds the record for goals in a single campaign: 17 in 2013–14.',
    breakdown: ['2007–08 · Manchester United', '2013–14 · Real Madrid', '2015–16 · Real Madrid', '2016–17 · Real Madrid', '2017–18 · Real Madrid'],
    source: 'UEFA / Wikipedia honours',
    sourceUrl:
      'https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo',
  },
  {
    id: 'euro-2016',
    title: 'UEFA European Championship',
    shortTitle: 'Euro 2016',
    kind: 'team',
    scope: 'international',
    count: 1,
    display: '1×',
    model: 'euro',
    accent: '#d7b05b',
    years: ['2016'],
    summary: 'Portugal’s first major international title. A captain’s tournament.',
    detail:
      'Portugal beat France 1–0 after extra time in the Euro 2016 final at the Stade de France. Ronaldo captained the side and was forced off through injury in the first half; Éder scored the winning goal. It remains Portugal’s first major senior international trophy.',
    breakdown: ['UEFA Euro 2016 · Portugal'],
    source: 'UEFA',
    sourceUrl: 'https://www.uefa.com/euro2016/',
  },
  {
    id: 'league-titles',
    title: 'Domestic league titles',
    shortTitle: 'League titles',
    kind: 'team',
    scope: 'club',
    count: 8,
    display: '8×',
    model: 'league',
    accent: '#dfe3e7',
    years: ['2006–07', '2007–08', '2008–09', '2011–12', '2016–17', '2018–19', '2019–20', '2025–26'],
    summary: 'Eight league titles in four different countries.',
    detail:
      'Three Premier League titles with Manchester United, two La Liga titles with Real Madrid, two Serie A titles with Juventus, and the 2025–26 Saudi Pro League with Al Nassr. These are team honours and form part of the 35 senior team trophies.',
    breakdown: [
      'Premier League ×3 · Manchester United',
      'La Liga ×2 · Real Madrid',
      'Serie A ×2 · Juventus',
      'Saudi Pro League ×1 · Al Nassr',
    ],
    source: 'Wikipedia honours / FBref',
    sourceUrl:
      'https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo',
  },
  {
    id: 'nations-league',
    title: 'UEFA Nations League',
    shortTitle: 'Nations League',
    kind: 'team',
    scope: 'international',
    count: 2,
    display: '2×',
    model: 'nations',
    accent: '#b9cfc2',
    years: ['2018–19', '2024–25'],
    summary: 'Two more international honours with Portugal.',
    detail:
      'Portugal won the inaugural UEFA Nations League in 2019 and lifted the trophy again in 2025, beating Spain on penalties after a 2–2 final. Alongside Euro 2016, these make up Portugal’s three major senior international titles in Ronaldo’s era.',
    breakdown: ['2018–19 · Portugal', '2024–25 · Portugal'],
    source: 'UEFA',
    sourceUrl: 'https://www.uefa.com/uefanationsleague/',
  },
  {
    id: 'career-record',
    title: 'Scoring records',
    shortTitle: 'The records',
    kind: 'individual',
    scope: 'career',
    count: CAREER_GOALS,
    display: String(CAREER_GOALS),
    model: 'record',
    accent: '#f0d58a',
    years: ['2002–2026'],
    summary: `The numbers that keep moving: ${CAREER_GOALS} senior goals and counting.`,
    detail: `Ronaldo is the all-time leading scorer in men’s international football with 146 goals and the all-time leading scorer in the UEFA Champions League with 140. His senior career total is shown as ${CAREER_GOALS} goals (${CAREER_GOALS_DATE}) in 1,342 appearances (23 October 2026). These are individual records, not team trophies.`,
    breakdown: [
      `${CAREER_GOALS} senior career goals`,
      '146 international goals',
      '140 UEFA Champions League goals',
    ],
    source: 'Reported goal figure, 29 Oct 2026; appearances, 23 Oct 2026',
    sourceUrl:
      'https://www.espn.com/football/story/_/id/46751020/cristiano-ronaldo-goal-tracker-road-1000-career-goals',
  },
]

export const TROPHY_ROOM_NOTE =
  'The Ballon d’Or exhibit uses a community-made CC BY 4.0 model credited in the footer; the remaining forms are original procedural 3D interpretations. No official replicas are shown, and team and individual honours are deliberately kept separate. Trophy totals were last verified on 9 September 2026; the scoring-record figure is dated 29 October 2026.'
