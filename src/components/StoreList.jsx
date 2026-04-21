import { useState, useEffect, useCallback } from 'react'

function StoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="18" height="11" rx="2" fill="#FFF8F0" stroke="var(--border)" strokeWidth="2.2"/>
      <path d="M3 10l3-7h12l3 7" stroke="var(--border)" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M9 21v-6h6v6" stroke="var(--border)" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
}

function extractPlaceId(link) {
  if (!link) return null
  const m = link.match(/place\/(\d+)/)
  return m ? m[1] : null
}

function parseBusinessHours(data) {
  try {
    const biz = data?.result?.place?.summary?.bizHour
      || data?.result?.summary?.bizHour
      || data?.bizHour
    if (!biz) return null

    const days = ['일', '월', '화', '수', '목', '금', '토']
    const today = new Date().getDay()
    const todayKey = biz[today] || biz['MON'] // fallback

    const todayData = Array.isArray(biz)
      ? biz.find(b => b.day === today || b.day === days[today])
      : biz[today] || Object.values(biz)[0]

    if (!todayData) return null

    const openTime = todayData.openTime || todayData.startTime || todayData.open
    const closeTime = todayData.closeTime || todayData.endTime || todayData.close
    const isHoliday = todayData.isHoliday || todayData.isDayOff

    if (isHoliday) return { isOpen: false, open: null, close: null, holiday: true }
    if (!openTime || !closeTime) return null

    const now = new Date()
    const cur = now.getHours() * 60 + now.getMinutes()
    const [oh, om] = openTime.split(':').map(Number)
    const [ch, cm] = closeTime.split(':').map(Number)
    const isOpen = cur >= oh * 60 + om && cur < ch * 60 + cm

    return { isOpen, open: openTime.slice(0, 5), close: closeTime.slice(0, 5), holiday: false }
  } catch {
    return null
  }
}

function NowTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () => {
      const n = new Date()
      const h = n.getHours().toString().padStart(2, '0')
      const m = n.getMinutes().toString().padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    fmt()
    const id = setInterval(fmt, 60000)
    return () => clearInterval(id)
  }, [])
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
}

function StoreCard({ store }) {
  const naverLink = `https://map.naver.com/v5/search/${encodeURIComponent(store.title)}`
  const [hours, setHours] = useState(null)
  const [hoursLoading, setHoursLoading] = useState(true)

  useEffect(() => {
    const placeId = extractPlaceId(store.link)
    if (!placeId) { setHoursLoading(false); return }

    const timeout = setTimeout(() => setHoursLoading(false), 3000)
    fetch(`/api/place?id=${placeId}`)
      .then(r => r.json())
      .then(data => { setHours(parseBusinessHours(data)) })
      .catch(() => {})
      .finally(() => { clearTimeout(timeout); setHoursLoading(false) })
  }, [store.link])

  return (
    <div className="poko-card p-3">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <StoreIcon />
            <span className="text-sm truncate" style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
              {store.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {store.category && (
              <span className="text-xs px-2 py-0.5 rounded-full inline-block"
                style={{ background: 'var(--bg-panel)', color: 'var(--text-sub)', border: '1.5px solid var(--border)' }}>
                {store.category}
              </span>
            )}
            {hoursLoading ? (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--bg-panel)', color: 'var(--text-sub)', border: '1.5px dashed var(--border)' }}>
                🕐 확인 중...
              </span>
            ) : hours ? (
              <span className="text-xs px-2 py-0.5 rounded-full inline-block"
                style={{
                  background: hours.holiday ? '#FEF9C3' : hours.isOpen ? '#DCFCE7' : '#FEE2E2',
                  color: hours.holiday ? '#854D0E' : hours.isOpen ? '#15803D' : '#B91C1C',
                  border: `1.5px solid ${hours.holiday ? '#FDE68A' : hours.isOpen ? '#86EFAC' : '#FCA5A5'}`,
                  fontWeight: 'bold',
                }}>
                {hours.holiday ? '🟡 오늘 휴무'
                  : hours.isOpen ? `🟢 영업중 · ~${hours.close}`
                  : `🔴 영업종료 · ${hours.open}~${hours.close}`}
              </span>
            ) : (
              <a href={naverLink} target="_blank" rel="noreferrer"
                className="text-xs px-2 py-0.5 rounded-full inline-block"
                style={{ background: 'var(--bg-panel)', color: 'var(--text-sub)', border: '1.5px dashed var(--border)', textDecoration: 'none' }}>
                🕐 영업시간 확인
              </a>
            )}
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            {store.roadAddress || store.address}
          </p>
          {store.telephone && (
            <p className="text-xs mt-1" style={{ color: '#5BAF3C' }}>📞 {store.telephone}</p>
          )}
        </div>

        <a href={naverLink} target="_blank" rel="noreferrer"
          className="poko-btn-green flex-shrink-0"
          style={{ padding: '6px 10px', fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>
          네이버
        </a>
      </div>
    </div>
  )
}

export default function StoreList({ stores, loading, selectedFood, neighborhood }) {
  if (!selectedFood) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="var(--bg-panel)" stroke="var(--border)" strokeWidth="3"/>
          <path d="M24 12v12l8 4" stroke="var(--border)" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <p className="text-sm text-center" style={{ color: 'var(--text-sub)', fontSize: 15 }}>
          위에서 음식을 선택하면<br />주변 매장을 찾아드려요!
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>🔍</div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
          {neighborhood ? `${neighborhood} 근처` : '주변'} 매장 검색 중...
        </p>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="var(--bg-panel)" stroke="var(--border)" strokeWidth="3"/>
          <path d="M16 18s4-4 8 0 8 0 8 0" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M17 30s3 4 7 4 7-4 7-4" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <p className="text-center" style={{ color: 'var(--text-sub)', fontSize: 15 }}>
          {neighborhood ? `${neighborhood} 근처에서` : '주변에서'}<br />{selectedFood} 파는 곳을 못 찾았어요
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="10" r="4" fill="var(--coral)" stroke="var(--border)" strokeWidth="2.5"/>
          <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z"
            stroke="var(--border)" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        </svg>
        <span className="text-sm" style={{ color: 'var(--text-main)' }}>
          {neighborhood && `${neighborhood} 근처`} {selectedFood}
        </span>
        <span style={{
          background: 'var(--coral)', color: 'white', fontSize: 11,
          borderRadius: 20, padding: '1px 8px', border: '2px solid var(--border)'
        }}>{stores.length}개</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-sub)' }}>
          🕐 <NowTime />
        </span>
      </div>
      {stores.map((store, i) => (
        <StoreCard key={i} store={store} />
      ))}
    </div>
  )
}
