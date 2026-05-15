const ALLOWED_ORIGINS = new Set([
  process.env.ALLOWED_ORIGIN || 'https://trendy-foodmap.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
])

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  if (!ALLOWED_ORIGINS.has(origin)) return res.status(403).json({ error: 'Forbidden' })

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const clientId = process.env.VITE_NAVER_CLIENT_ID
  const clientSecret = process.env.VITE_NAVER_CLIENT_SECRET

  const params = new URLSearchParams(req.query).toString()
  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?${params}`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    )
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
