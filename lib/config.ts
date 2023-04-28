const DAY_IN_SECONDS = 60 * 60 * 24
export const CACHE_CONTROL_HEADER = `s-maxage=1, stale-while-revalidate=${
  3 * DAY_IN_SECONDS
}`
