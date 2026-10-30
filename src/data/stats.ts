export type CareerMetric = {
  id: string
  value: number
  label: string
  detail: string
  format?: 'comma'
  source: string
}

// Requested display total, date-stamped in the interface. The club and
// calendar-year splits remain a fixed 23 October 2026 snapshot; see STATS_NOTE.
export const CAREER_GOALS = 985
export const CAREER_GOAL_TARGET = 1000
export const CAREER_GOALS_REMAINING = CAREER_GOAL_TARGET - CAREER_GOALS
export const CAREER_GOALS_PROGRESS = (CAREER_GOALS / CAREER_GOAL_TARGET) * 100
export const CAREER_GOALS_DATE = '29 October 2026'
export const CAREER_GOALS_DATE_SHORT = '29 Oct 2026'
export const CAREER_ASSISTS = 291

export const CAREER_METRICS: CareerMetric[] = [
  {
    id: 'goals',
    value: CAREER_GOALS,
    label: 'Senior career goals',
    detail: 'Club and country',
    source: 'Fabrizio Romano / TNT Sports, 29 Oct 2026 · display figure',
  },
  {
    id: 'international',
    value: 146,
    label: 'International goals',
    detail: 'Men’s world record',
    source: 'Opta / Wikipedia, 23 Oct 2026',
  },
  {
    id: 'apps',
    value: 1342,
    label: 'Senior appearances',
    detail: 'Across club and country',
    format: 'comma',
    source: 'Career records, 23 Oct 2026',
  },
  {
    id: 'ucl',
    value: 140,
    label: 'Champions League goals',
    detail: 'All-time record',
    source: 'UEFA competition records',
  },
  {
    id: 'ballon',
    value: 5,
    label: 'Ballon d’Or awards',
    detail: '2008 · 2013 · 2014 · 2016 · 2017',
    source: 'France Football / FIFA',
  },
  {
    id: 'trophies',
    value: 35,
    label: 'Senior team trophies',
    detail: 'Club and international',
    source: 'Honours list, verified Sep 2026',
  },
]

export type GoalBar = {
  team: string
  goals: number
  appearances: number
  color: string
  note: string
}

export const GOALS_BY_TEAM: GoalBar[] = [
  {
    team: 'Real Madrid',
    goals: 450,
    appearances: 438,
    color: '#e3bd5b',
    note: '2009–2018 · 1.03 goals per game',
  },
  {
    team: 'Portugal',
    goals: 146,
    appearances: 234,
    color: '#c53b47',
    note: '2003–present · senior internationals',
  },
  {
    team: 'Manchester United',
    goals: 145,
    appearances: 346,
    color: '#d9342b',
    note: '2003–2009 and 2021–2022',
  },
  {
    team: 'Al Nassr',
    goals: 135,
    appearances: 159,
    color: '#f0c64c',
    note: '2023–present · as of 23 Oct 2026',
  },
  {
    team: 'Juventus',
    goals: 101,
    appearances: 134,
    color: '#dfe3e7',
    note: '2018–2021 · all competitions',
  },
  {
    team: 'Sporting CP',
    goals: 5,
    appearances: 31,
    color: '#2f8a5b',
    note: '2002–2003 · the first senior chapter',
  },
]

export type GoalYear = {
  year: number
  goals: number
}

export const GOALS_BY_YEAR: GoalYear[] = [
  { year: 2002, goals: 5 },
  { year: 2003, goals: 1 },
  { year: 2004, goals: 13 },
  { year: 2005, goals: 15 },
  { year: 2006, goals: 25 },
  { year: 2007, goals: 34 },
  { year: 2008, goals: 35 },
  { year: 2009, goals: 30 },
  { year: 2010, goals: 48 },
  { year: 2011, goals: 60 },
  { year: 2012, goals: 63 },
  { year: 2013, goals: 69 },
  { year: 2014, goals: 61 },
  { year: 2015, goals: 57 },
  { year: 2016, goals: 55 },
  { year: 2017, goals: 53 },
  { year: 2018, goals: 49 },
  { year: 2019, goals: 39 },
  { year: 2020, goals: 44 },
  { year: 2021, goals: 47 },
  { year: 2022, goals: 16 },
  { year: 2023, goals: 54 },
  { year: 2024, goals: 43 },
  { year: 2025, goals: 41 },
  { year: 2026, goals: 25 },
]

export const CAREER_MILESTONES = [
  { value: '500', label: 'Career goals', year: '2015' },
  { value: '900', label: 'Career goals', year: '2024' },
  { value: '146', label: 'Portugal goals', year: 'Current' },
  { value: String(CAREER_GOALS), label: 'Career goals', year: '29 Oct 2026' },
]

export const STATS_NOTE =
  'Senior first-team club football and full international caps only. Youth, reserve and unofficial matches are excluded. The 985 career-goal figure is dated 29 October 2026; other statistics and the club/calendar-year splits are a 23 October 2026 snapshot. Figures are compiled from public records and live totals can change after publication. Club and calendar-year splits may not sum to the latest career total.'
