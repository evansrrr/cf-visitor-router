const ROUTES = [
  {
    name: 'China Mainland',
    match: ['CN'],
    target: 'https://cn.example.com',
    status: 302
  },
  {
    name: 'HK, MAC & TW',
    match: ['HK', 'TW', 'MO'],
    target: 'https://hk.example.com',
    status: 302
  },
  {
    name: 'Default',
    match: ['*'],
    target: 'https://www.example.com',
    status: 302
  }
]

function getRoute(country) {
  return ROUTES.find(
    r => r.match.includes(country) || r.match.includes('*')
  )
}

export default {
  async fetch(request) {
    const country = request.cf?.country || 'UN'
    const route = getRoute(country)

    if (!route) {
      return new Response('No route matched', { status: 500 })
    }

    return Response.redirect(route.target, route.status)
  }
}
