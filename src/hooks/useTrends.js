import { useState, useEffect } from 'react'
import { SEED_FOODS } from '../data/foods'

const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET

export const PERIOD_OPTIONS = [
  { label: '1주', days: 7, timeUnit: 'date' },
  { label: '2주', days: 14, timeUnit: 'date' },
  { label: '1개월', days: 30, timeUnit: 'week' },
  { label: '3개월', days: 90, timeUnit: 'month' },
]

function getDateRange(days) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  const fmt = (d) => d.toISOString().split('T')[0]
  return { startDate: fmt(start), endDate: fmt(end) }
}

async function fetchGroup(foods, days, timeUnit) {
  const { startDate, endDate } = getDateRange(days)
  const body = {
    startDate,
    endDate,
    timeUnit,
    keywordGroups: foods.map((f) => ({
      groupName: f.name,
      keywords: [f.query],
    })),
  }
  const res = await fetch('/api/trend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Naver-Client-Id': CLIENT_ID,
      'X-Naver-Client-Secret': CLIENT_SECRET,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('trend fetch failed')
  return res.json()
}

export function useTrends(days = 7, timeUnit = 'date', seedFoods = SEED_FOODS) {
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    async function load() {
      try {
        const chunks = []
        for (let i = 0; i < seedFoods.length; i += 5) chunks.push(seedFoods.slice(i, i + 5))

        const responses = await Promise.all(chunks.map(g => fetchGroup(g, days, timeUnit)))

        const score = (results, foods) =>
          results.results.map((r, i) => {
            const data = r.data
            if (data.length === 0) return { ...foods[i], score: 0, recent: 0 }
            const mid = Math.ceil(data.length / 2)
            const early = data.slice(0, mid).reduce((s, d) => s + d.ratio, 0) / mid
            const late  = data.slice(mid).reduce((s, d) => s + d.ratio, 0) / Math.max(data.length - mid, 1)
            const recent = data[data.length - 1]?.ratio ?? 0
            return { ...foods[i], score: late - early, recent }
          })

        const all = chunks.flatMap((g, idx) => score(responses[idx], g))
        all.sort((a, b) => b.score - a.score || b.recent - a.recent)
        setTrends(all)
      } catch {
        setTrends(seedFoods.map((f) => ({ ...f, score: 0, recent: 0 })))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [days, timeUnit, seedFoods])

  return { trends, loading }
}
