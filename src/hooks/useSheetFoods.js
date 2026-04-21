import { useState, useEffect } from 'react'
import { SEED_FOODS } from '../data/foods'

const API_URL = '/api/foods'
const LOCAL_KEY = 'foodmap_admin_foods'

export function saveAdminFoodsLocal(foods) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(foods))
}

export function useSheetFoods() {
  const [foods, setFoods] = useState(SEED_FOODS) // API 있으면 캐시 무시, 항상 fresh fetch
  const [fromSheet, setFromSheet] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFoods(data)
          saveAdminFoodsLocal(data)
          setFromSheet(true)
        }
      })
      .catch(() => {
        // API 실패 시 localStorage 폴백
        try {
          const saved = localStorage.getItem(LOCAL_KEY)
          if (saved) setFoods(JSON.parse(saved))
        } catch {}
      })
  }, [])

  return { foods, setFoods, fromSheet }
}
