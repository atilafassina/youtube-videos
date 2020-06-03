import fetch from 'node-fetch'

type TCache = {
  lastUpdate?: number
  videos: any[]
}

const TOKEN = process.env.YOUTUBE_TOKEN
const SCOPE_LEAK = 'UCfCr8kE8AL0tzDPbX1KX_gg'
const ENDPOINT = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${SCOPE_LEAK}&key=${TOKEN}&type=video&order=date&maxResults=6`
const HOUR_IN_SECONDS = 60 * 60
const HOUR_IN_MILISECONDS = 1000 * HOUR_IN_SECONDS
let cache: TCache = {
  lastUpdate: undefined,
  videos: [],
}

const fetchVideos = async (url) => {
  const resp = await fetch(url, {
    referrer: 'atila.io',
  })
  const data = await resp.json()

  if (data.error) {
    return {
      status: data.error.code,
      data: {
        message: data.error.message,
        statusCode: data.error.code,
      },
    }
  }

  let videos = data.items

  cache = {
    lastUpdate: Date.now(),
    videos,
  }

  return {
    status: 200,
    data: videos,
  }
}

export default async (req, res) => {
  res.setHeader('Content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Cache-Control',
    `s-maxage=${6 * HOUR_IN_SECONDS}, stale-while-revalidate`
  )

  if (Date.now() - cache.lastUpdate < 6 * HOUR_IN_MILISECONDS) {
    res.end(JSON.stringify(cache.videos))
  } else {
    const { data, status } = await fetchVideos(ENDPOINT)

    res.status(status).send(JSON.stringify(data))
  }
}
