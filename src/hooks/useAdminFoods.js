import { useState, useCallback } from 'react'

const API_URL = '/api/foods'
const PASSWORD = '0812'

export function useAdminFoods() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const login = useCallback((pw) => {
    if (pw === PASSWORD) {
      setIsAdmin(true)
      setPasswordError(false)
      return true
    }
    setPasswordError(true)
    return false
  }, [])

  const logout = useCallback(() => setIsAdmin(false), [])

  const addFood = useCallback(async (food) => {
    if (!API_URL) return false
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD, action: 'add', food }),
    })
    return res.ok
  }, [])

  const saveOrder = useCallback(async (foods) => {
    if (!API_URL) return false
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD, action: 'reorder', foods }),
    })
    return res.ok
  }, [])

  const deleteFood = useCallback(async (name) => {
    if (!API_URL) return false
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD, action: 'delete', name }),
    })
    return res.ok
  }, [])

  return { isAdmin, passwordError, login, logout, addFood, saveOrder, deleteFood }
}
