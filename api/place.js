const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://trendy-foodmap.vercel.app'

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  if (origin && origin !== ALLOWED_ORIGIN) return res.status(403).json({ error: 'Forbidden' })

  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'no id' })

  try {
    const response = await fetch(
      `https://map.naver.com/v5/api/place?id=${id}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36', 'Referer': 'https://map.naver.com/' } }
    )
    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
