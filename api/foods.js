const APPS_SCRIPT_URL = process.env.ADMIN_API_URL

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const response = await fetch(APPS_SCRIPT_URL)
      const data = await response.json()
      return res.json(data)
    }

    if (req.method === 'POST') {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      })
      const data = await response.json()
      return res.json(data)
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
