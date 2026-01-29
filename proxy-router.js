const ROUTES = [
  {
    name: 'China Mainland',
    match: ['CN'],
    upstream: 'https://cn.example.com'
  },
  {
    name: 'HK, MAC & TW',
    match: ['HK', 'TW', 'MO'],
    upstream: 'https://hk.example.com'
  },
  {
    name: 'Default',
    match: ['*'],
    upstream: 'https://www.example.com'
  }
]

// 你的主域名（防止套娃）
const MAIN_HOST = 'example.com'

function getUpstream(country) {
  const rule = ROUTES.find(
    r => r.match.includes(country) || r.match.includes('*')
  )
  return rule?.upstream
}

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const country = request.cf?.country || 'UN'

    // 防止套娃：只代理主域名
    if (url.hostname !== MAIN_HOST) {
      return fetch(request)
    }

    const upstream = getUpstream(country)
    if (!upstream) {
      return new Response('No upstream matched', { status: 502 })
    }

    const targetURL = upstream + url.pathname + url.search

    const newRequest = new Request(targetURL, {
      method: request.method,
      headers: request.headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? null
          : request.body,
      redirect: 'manual'
    })

    let response = await fetch(newRequest)

    const contentType = response.headers.get('content-type') || ''

    // 仅对 HTML 进行 SEO / 缓存优化
    if (contentType.includes('text/html')) {
      response = new Response(response.body, response)

      // 统一 canonical，避免搜索引擎分裂
      response.headers.set(
        'Link',
        `<https://${MAIN_HOST}${url.pathname}>; rel="canonical"`
      )

      // 静态站友好的缓存策略
      response.headers.set(
        'Cache-Control',
        'public, max-age=600, s-maxage=86400'
      )
    }

    return response
  }
}
