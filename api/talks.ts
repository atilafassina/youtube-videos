import { CACHE_CONTROL_HEADER } from '../lib/config'
import { getXataClient } from '../lib/xata.codegen'

const xata = getXataClient()

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
