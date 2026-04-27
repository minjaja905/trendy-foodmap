import { useState } from 'react'
import Header from './components/Header'
import TrendPanel from './components/TrendPanel'
import FoodMap from './components/FoodMap'
import StoreList from './components/StoreList'
import AdminPanel from './components/AdminPanel'
import { useTrends, PERIOD_OPTIONS } from './hooks/useTrends'
import { useLocation } from './hooks/useLocation'
import { useStoreSearch } from './hooks/useStoreSearch'
import { useSheetFoods, saveAdminFoodsLocal } from './hooks/useSheetFoods'
import { useAdminFoods } from './hooks/useAdminFoods'

export default function App() {
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0])
  const { foods: sheetFoods, setFoods: setSheetFoods } = useSheetFoods()
  const { trends, loading: trendsLoading } = useTrends(period.days, period.timeUnit, sheetFoods)
  const { location, neighborhood, displayName, error: locationError, loading: locationLoading, isCustom, refresh, setCustomNeighborhood } = useLocation()
  const { stores, loading: storesLoading, search } = useStoreSearch()
  const { isAdmin, passwordError, login, logout, addFood, saveOrder, deleteFood } = useAdminFoods()

  const [selectedFood, setSelectedFood] = useState(null)
  const [customFoods, setCustomFoods] = useState([]) // 일반 유저: 로컬만
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const mergedFoods = [...customFoods, ...trends]

  const handleSelect = (food) => {
    setSelectedFood(food.name)
    search(food.query || food.name, neighborhood, food.queryAlt, food.stores)
  }

  const handleAddCustom = (name) => {
    const newFood = { name, emoji: '🍴', query: name, score: 0 }
    setCustomFoods((prev) => [newFood, ...prev])
    setSelectedFood(name)
    search(name, neighborhood)
  }

  const handleAdminAdd = async (food) => {
    const next = [...sheetFoods, food]
    setSheetFoods(next)
    saveAdminFoodsLocal(next)
    await addFood(food)
  }

  const handleMove = (index, dir) => {
    setSheetFoods((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleDelete = async (name) => {
    const next = sheetFoods.filter((f) => f.name !== name)
    setSheetFoods(next)
    saveAdminFoodsLocal(next)
    await deleteFood(name)
  }

  const handleSaveOrder = async () => {
    setSaving(true)
    saveAdminFoodsLocal(sheetFoods)   // 항상 localStorage에 저장
    await saveOrder(sheetFoods)        // API 있으면 서버도 저장
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="chip-sketch" x="-12%" y="-30%" width="124%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="4" seed="12" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="chip-sketch-selected" x="-12%" y="-30%" width="124%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="4" seed="5" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5.5" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      <Header
        neighborhood={displayName}
        isCustom={isCustom}
        loading={locationLoading}
        onRefresh={refresh}
        onSetCustom={setCustomNeighborhood}
        onAdminOpen={() => setAdminPanelOpen(true)}
      />

      <TrendPanel
        trends={mergedFoods}
        loading={trendsLoading}
        selected={selectedFood}
        onSelect={handleSelect}
        onAddCustom={handleAddCustom}
        period={period}
        onPeriodChange={setPeriod}
      />

      {locationError && (
        <div className="mx-4 mt-2 px-3 py-2 text-sm" style={{
          background: '#FFF0EE', border: '2px solid #E8453C',
          color: '#C23028', borderRadius: 12
        }}>
          ⚠️ {locationError}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, gap: 16, padding: 16, overflow: 'hidden', minHeight: 0 }}>
        <div className="poko-card" style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <FoodMap userLocation={location} stores={stores} />
        </div>
        <div style={{ width: 300, overflowY: 'auto', flexShrink: 0 }}>
          <StoreList
            stores={stores}
            loading={storesLoading}
            selectedFood={selectedFood}
            neighborhood={displayName}
          />
        </div>
      </div>

      <div className="text-center py-2" style={{ color: 'var(--text-sub)', flexShrink: 0, fontSize: 12, position: 'relative' }}>
        <a
          href="https://www.instagram.com/minjaja.pdf/"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--mint-dark)', textDecoration: 'none', fontWeight: 'bold' }}
        >
          © 2026 MJ
        </a>
        {/* 관리자 전용 시트 바로가기 - 아주 작고 희미하게 */}
        <a
          href="https://docs.google.com/spreadsheets/d/1-sA4Wkmg7mais1Qn5QKlpXvfWYJCtw8-DpPBVqk4K14/edit?gid=0#gid=0"
          target="_blank"
          rel="noreferrer"
          title="시트 열기"
          style={{
            position: 'absolute', right: 12, bottom: 4,
            fontSize: 10, opacity: 0.25, color: 'var(--text-sub)',
            textDecoration: 'none', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.target.style.opacity = 0.8}
          onMouseLeave={e => e.target.style.opacity = 0.25}
        >
          📊
        </a>
      </div>

      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        isAdmin={isAdmin}
        passwordError={passwordError}
        onLogin={login}
        foods={sheetFoods}
        onAdd={handleAdminAdd}
        onMove={handleMove}
        onDelete={handleDelete}
        onSave={handleSaveOrder}
        saving={saving}
      />
    </div>
  )
}
