import { useState, useCallback } from 'react'

const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET

async function fetchStores(foodQuery, neighborhood) {
  const query = encodeURIComponent(`${foodQuery} ${neighborhood}`.trim())
  const res = await fetch(`/api/search?query=${query}&display=20&sort=random`, {
    headers: {
      'X-Naver-Client-Id': CLIENT_ID,
      'X-Naver-Client-Secret': CLIENT_SECRET,
    },
  })
  if (!res.ok) throw new Error('search failed')
  const data = await res.json()
  const decode = (str) => str
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  return (data.items || []).map((item) => ({
    ...item,
    title: decode(item.title),
    lat: parseInt(item.mapy) / 10000000,
    lng: parseInt(item.mapx) / 10000000,
  }))
}

export function useStoreSearch() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (foodQuery, neighborhood, queryAlt, stores) => {
    setLoading(true)
    setStores([])
    try {
      const altQueries = queryAlt
        ? queryAlt.split(',').map((q) => q.trim()).filter(Boolean)
        : []
      const storeQueries = stores
        ? stores.split(',').map((q) => q.trim()).filter(Boolean)
        : []
      const queries = [
        fetchStores(foodQuery, neighborhood),
        ...altQueries.map((q) => fetchStores(q, neighborhood)),
        ...storeQueries.map((q) => fetchStores(q, neighborhood)),
      ]

      const results = await Promise.all(queries)
      const merged = results.flat()

      // 중복 제거 (title 기준)
      const seen = new Set()
      const unique = merged.filter((s) => {
        if (seen.has(s.title)) return false
        seen.add(s.title)
        return true
      })

      setStores(unique)
    } catch {
      setStores([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { stores, loading, search }
}
