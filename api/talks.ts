import { xata } from '../lib/xata'
import { CACHE_CONTROL_HEADER, EDGE_CONFIG } from '../lib/config'

export const config = EDGE_CONFIG

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
    },
  })
}
