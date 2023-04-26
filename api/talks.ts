import { xata } from '../lib/xata'
import { CACHE_CONTROL_HEADER } from '../lib/config'

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
}

export default async () => {
  const { records } = await xata.db.appearances
    .sort('date', 'desc')
    .getPaginated({
      pagination: {
        size: 100,
      },
    })

  return new Response(JSON.stringify(records), {
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': CACHE_CONTROL_HEADER,
      'x-api': 'ytube',
    },
  })
}
