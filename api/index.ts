const TOKEN = process.env.YOUTUBE_TOKEN
const CHANNEL = process.env.CHANNEL_ID
const ENDPOINT = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL}&key=${TOKEN}&type=video&order=date&maxResults=9`
const DAY_IN_SECONDS = 24 * 60 * 60

export const config = {
  runtime: 'edge',
}

const fetchVideos = async (url: string) => {
  const resp = await fetch(url)
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

  return data.items
}

export default async () => {
  const videos = await fetchVideos(ENDPOINT)

  return new Response(JSON.stringify(videos), {
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `s-maxage=${DAY_IN_SECONDS}, stale-while-revalidate=${
        3 * DAY_IN_SECONDS
      }`,
    },
  })
}
