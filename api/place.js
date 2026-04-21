export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'no id' })

  try {
    const response = await fetch(
      `https://map.naver.com/v5/api/place?id=${id}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36', 'Referer': 'https://map.naver.com/' } }
    )
    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
