import { useState } from 'react'
import { PERIOD_OPTIONS } from '../hooks/useTrends'

function getNow() {
  const now = new Date()
  return `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}시 기준`
}

// 크레용 배경 + 선명한 텍스트 분리 구조
function CrayonChip({ selected, onClick, children, style = {} }) {
  const bg = selected
    ? 'linear-gradient(180deg, var(--coral) 0%, #E85555 100%)'
    : 'var(--bg-card)'
  const shadow = selected ? 'var(--coral-dark)' : 'var(--shadow)'

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {/* 크레용 필터 적용 배경 레이어 */}
      <span style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        border: '3px solid var(--border)',
        borderRadius: 22,
        boxShadow: `4px 4px 0px ${shadow}`,
        filter: 'url(#chip-sketch)',
        pointerEvents: 'none',
        ...style,
      }} />
      {/* 텍스트 레이어 (필터 없음) */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '8px 14px',
        color: selected ? 'white' : 'var(--text-main)',
        fontSize: 14,
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
    </button>
  )
}

function CrayonPeriodBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{ position: 'relative', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <span style={{
        position: 'absolute',
        inset: 0,
        background: active ? 'linear-gradient(180deg, var(--coral), #E85555)' : 'var(--bg-card)',
        border: '2px solid var(--border)',
        borderRadius: 8,
        boxShadow: active ? '2px 2px 0px var(--coral-dark)' : '2px 2px 0px var(--shadow)',
        filter: 'url(#chip-sketch)',
        pointerEvents: 'none',
      }} />
      <span style={{
        position: 'relative', zIndex: 1,
        display: 'block', padding: '3px 8px',
        fontSize: 11, fontFamily: 'JejuDoldam, sans-serif',
        color: active ? 'white' : 'var(--text-main)',
      }}>
        {label}
      </span>
    </button>
  )
}

const REPORT_FORM_URL = import.meta.env.VITE_REPORT_FORM_URL

export default function TrendPanel({ trends, loading, selected, onSelect, onAddCustom, period, onPeriodChange }) {
  const [showInput, setShowInput] = useState(false)
  const [inputVal, setInputVal] = useState('')

  const handleAdd = () => {
    if (inputVal.trim()) {
      onAddCustom(inputVal.trim())
      setInputVal('')
      setShowInput(false)
    }
  }

  return (
    <div className="px-4 pt-3 pb-2 border-b-2" style={{ background: 'var(--bg-panel)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2s-5 5-5 10a5 5 0 0010 0c0-3-2-6-2-6s-1 2-2 3c-1-2-1-7-1-7z"
              fill="var(--coral)" stroke="var(--border)" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm" style={{ color: 'var(--text-main)' }}>지금 뜨는 음식</span>
          {loading && <span className="text-xs" style={{ color: 'var(--text-sub)' }}>로딩 중...</span>}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {PERIOD_OPTIONS.map((opt) => (
              <CrayonPeriodBtn
                key={opt.label}
                label={opt.label}
                active={period.label === opt.label}
                onClick={() => onPeriodChange(opt)}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{getNow()}</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1.5">
        {trends.map((food, i) => (
          <CrayonChip
            key={food.name}
            selected={selected === food.name}
            onClick={() => onSelect(food)}
          >
            {i < 3 && (
              <span className="rank-badge">{i + 1}</span>
            )}
            <span style={{ fontSize: 16 }}>{food.emoji}</span>
            <span style={{ fontSize: 13 }}>{food.name}</span>
          </CrayonChip>
        ))}

        {showInput ? (
          <div className="flex gap-1 flex-shrink-0 items-center">
            <input
              className="poko-input"
              style={{ width: 110, padding: '7px 10px' }}
              placeholder="음식 이름"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <button className="poko-btn-green" style={{ padding: '7px 12px', fontSize: 13 }} onClick={handleAdd}>추가</button>
            <CrayonChip onClick={() => { setShowInput(false); setInputVal('') }}>✕</CrayonChip>
          </div>
        ) : (
          <CrayonChip onClick={() => setShowInput(true)} style={{ borderStyle: 'dashed' }}>
            <span style={{ color: 'var(--text-sub)' }}>＋ 직접 추가</span>
          </CrayonChip>
        )}

        {REPORT_FORM_URL && (
          <CrayonChip
            onClick={() => window.open(REPORT_FORM_URL, '_blank')}
            style={{ borderStyle: 'dashed' }}
          >
            <span style={{ color: 'var(--coral)' }}>📣 제보하기</span>
          </CrayonChip>
        )}

      </div>
    </div>
  )
}
