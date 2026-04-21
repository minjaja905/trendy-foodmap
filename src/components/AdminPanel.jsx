import { useState } from 'react'

const EMOJI_OPTIONS = ['🍡','🍘','🍪','🥖','🍫','🫙','🥐','🦑','🥗','🍙','🍲','🥘','🍦','🍩','🔥','🥪','🐟','🍣','🥞','🧇']

function AdminLogin({ onLogin, error }) {
  const [pw, setPw] = useState('')
  return (
    <div style={{ padding: '24px 20px' }}>
      <p style={{ color: 'var(--text-main)', fontSize: 14, marginBottom: 12 }}>관리자 비밀번호</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="password"
          className="poko-input"
          style={{ flex: 1, letterSpacing: 6 }}
          placeholder="••••"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLogin(pw)}
          autoFocus
        />
        <button className="poko-btn-green" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => onLogin(pw)}>
          확인
        </button>
      </div>
      {error && <p style={{ color: 'var(--coral)', fontSize: 12, marginTop: 8 }}>비밀번호가 틀렸어요</p>}
    </div>
  )
}

function AddFoodForm({ onAdd }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍡')
  const [query, setQuery] = useState('')
  const [queryAlt, setQueryAlt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!name.trim() || !query.trim()) return
    setLoading(true)
    await onAdd({ name: name.trim(), emoji, query: query.trim(), queryAlt: queryAlt.trim() })
    setName(''); setQuery(''); setQueryAlt(''); setEmoji('🍡')
    setLoading(false)
  }

  return (
    <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--bg-panel)' }}>
      <p style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 10 }}>새 음식 추가</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <select
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="poko-input"
          style={{ width: 52, padding: '8px 4px', fontSize: 18, textAlign: 'center' }}
        >
          {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <input className="poko-input" style={{ flex: 1 }} placeholder="음식 이름 (예: 두쫀쿠)" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input className="poko-input" style={{ flex: 1 }} placeholder="검색어 (예: 두쫀쿠쿠키)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input className="poko-input" style={{ flex: 1 }} placeholder="보조 검색어 (예: 쭈꾸미, 선택)" value={queryAlt} onChange={(e) => setQueryAlt(e.target.value)} />
      </div>
      <button
        className="poko-btn-green"
        style={{ width: '100%', padding: '9px', fontSize: 13, opacity: loading ? 0.6 : 1 }}
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? '저장 중...' : '+ 추가 (전체 공개)'}
      </button>
    </div>
  )
}

function FoodOrderList({ foods, onMove, onDelete, onSave, saving }) {
  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 12, color: 'var(--text-sub)' }}>순서 편집 (위아래 버튼)</p>
        <button
          className="poko-btn-green"
          style={{ padding: '6px 14px', fontSize: 12, opacity: saving ? 0.6 : 1 }}
          onClick={onSave}
          disabled={saving}
        >
          {saving ? '저장 중...' : '순서 저장'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {foods.map((food, i) => (
          <div key={food.name} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg)', borderRadius: 10, padding: '8px 10px',
            border: '2px solid var(--border)',
          }}>
            <span style={{ fontSize: 18 }}>{food.emoji}</span>
            <span style={{ flex: 1, fontSize: 13, color: 'var(--text-main)' }}>{food.name}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => onMove(i, -1)} disabled={i === 0}
                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: i === 0 ? 0.3 : 1, fontSize: 14 }}>▲</button>
              <button onClick={() => onMove(i, 1)} disabled={i === foods.length - 1}
                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: i === foods.length - 1 ? 0.3 : 1, fontSize: 14 }}>▼</button>
              <button onClick={() => onDelete(food.name)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', fontSize: 13, marginLeft: 4 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminPanel({ isOpen, onClose, isAdmin, passwordError, onLogin, foods, onAdd, onMove, onDelete, onSave, saving }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div style={{
        width: 360, height: '100%', overflowY: 'auto',
        background: 'var(--bg-card)',
        borderLeft: '3px solid var(--border)',
        boxShadow: '-4px 0 0px var(--shadow)',
      }} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div style={{
          background: 'var(--mint-dark)', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>🔑 관리자 패널</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {!isAdmin ? (
          <AdminLogin onLogin={onLogin} error={passwordError} />
        ) : (
          <>
            <AddFoodForm onAdd={onAdd} />
            <FoodOrderList
              foods={foods}
              onMove={onMove}
              onDelete={onDelete}
              onSave={onSave}
              saving={saving}
            />
          </>
        )}
      </div>
    </div>
  )
}
