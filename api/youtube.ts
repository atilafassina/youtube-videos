import { EDGE_CONFIG } from 'lib/config'

const TOKEN = process.env.YOUTUBE_TOKEN
const CHANNEL = process.env.CHANNEL_ID
const ENDPOINT = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL}&key=${TOKEN}&type=video&order=date&maxResults=9`
const DAY_IN_SECONDS = 24 * 60 * 60

export const config = EDGE_CONFIG

const fetchVideos = async (url: string) => {
  const resp = await fetch(url)
  const data = await resp.json()

  if (data.error) {
    return {
      status: Number(data.error.code),
      data: {
        message: data.error.message,
        statusCode: data.error.code,
      },
    }
  }

  return {
    status: 200,
    items: data.items,
  }
}

export default async () => {
  const videos = await fetchVideos(ENDPOINT)
  if (videos.status === 200) {
    return new Response(JSON.stringify(videos.items), {
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `s-maxage=${DAY_IN_SECONDS}, stale-while-revalidate=${
          3 * DAY_IN_SECONDS
        }`,
      },
    })
  } else {
    return new Response(
      JSON.stringify({
        message: 'Something wrong fetching channel info.',
        payload: videos.data,
        fetchStatus: videos.status,
      }),
      {
        status: 500,
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `no-cache`,
        },
      }
    )
  }
}
