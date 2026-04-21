import { useState } from 'react'

function MapIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <filter id="hdr-crayon" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" seed="3" result="grain"/>
          <feColorMatrix type="matrix" in="grain"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 4.2" result="mask"/>
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="tex"/>
          <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="2" seed="11" result="wig"/>
          <feDisplacementMap in="tex" in2="wig" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="hdr-stroke" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect x="1" y="1" width="42" height="42" rx="12" fill="white" stroke="#E8E0D8" strokeWidth="1.5"/>
      <g filter="url(#hdr-crayon)">
        <path d="M22 7c-5.5 0-10 4.5-10 10 0 7.5 10 19 10 19s10-11.5 10-19c0-5.5-4.5-10-10-10z"
          fill="#BDD7DE" opacity="0.9"/>
        <circle cx="22" cy="17" r="4.5" fill="white"/>
      </g>
      <g filter="url(#hdr-stroke)">
        <path d="M22 7c-5.5 0-10 4.5-10 10 0 7.5 10 19 10 19s10-11.5 10-19c0-5.5-4.5-10-10-10z"
          fill="none" stroke="#9BBEC8" strokeWidth="2.2" strokeLinejoin="round"/>
        <circle cx="22" cy="17" r="4.5" fill="none" stroke="#9BBEC8" strokeWidth="1.8"/>
      </g>
    </svg>
  )
}

function GuideModal({ onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--bg-card)', borderRadius: 20, border: '3px solid var(--border)', boxShadow: '6px 6px 0px var(--shadow)', maxWidth: 440, width: '100%', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ background: 'var(--mint-dark)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>📖 사용 안내</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20, maxHeight: '70vh', overflowY: 'auto' }}>

          {/* 작동 방식 */}
          <section>
            <p style={{ color: 'var(--mint-dark)', fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>🗺️ 이런 앱이에요</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['1️⃣', '트렌딩 음식 선택', '지금 SNS에서 뜨는 음식 칩을 눌러요'],
                ['2️⃣', '내 위치 파악', 'GPS 또는 직접 지역 입력'],
                ['3️⃣', '주변 매장 검색', '네이버 지역 검색 기반으로 지도에 표시'],
                ['4️⃣', '매장 확인', '카드 클릭 → 네이버 지도로 이동'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 'bold', marginBottom: 2 }}>{title}</p>
                    <p style={{ color: 'var(--text-sub)', fontSize: 12 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '2px dashed var(--bg-panel)' }} />

          {/* 위치 권한 */}
          <section>
            <p style={{ color: 'var(--mint-dark)', fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>📍 위치 권한 허용 방법</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['🖥️ Chrome (PC)', '주소창 왼쪽 🔒 아이콘 → 위치 → 허용'],
                ['🧭 Safari (Mac)', '주소창 왼쪽 AA → 웹사이트 설정 → 위치 → 허용'],
                ['📱 Chrome (모바일)', '주소창 🔒 → 권한 → 위치 → 허용'],
                ['📱 Safari (iPhone)', '설정 앱 → Safari → 위치 → 방문 중에 허용'],
              ].map(([browser, guide]) => (
                <div key={browser} style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px', border: '1.5px solid var(--bg-panel)' }}>
                  <p style={{ color: 'var(--text-main)', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>{browser}</p>
                  <p style={{ color: 'var(--text-sub)', fontSize: 12 }}>{guide}</p>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: 11, marginTop: 8 }}>
              * 위치 허용이 어려우면 헤더의 🗾 지역설정으로 직접 입력할 수 있어요
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '2px dashed var(--bg-panel)' }} />

          {/* 기능 안내 */}
          <section>
            <p style={{ color: 'var(--mint-dark)', fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>✨ 기능 안내</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['＋ 직접 추가', '목록에 없는 음식을 내 화면에만 추가'],
                ['📣 제보하기', '새로 뜨는 음식 제보 → 관리자 검토 후 반영'],
                ['📡 내 위치로', 'GPS로 현재 위치 재감지'],
                ['🗾 지역설정', '원하는 지역 직접 입력 (예: 해운대구)'],
                ['1주 / 2주 / 1개월', '네이버 검색량 기준 기간 변경'],
              ].map(([btn, desc]) => (
                <div key={btn} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ background: 'var(--bg-panel)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--text-main)', flexShrink: 0, border: '1.5px solid var(--border)' }}>{btn}</span>
                  <span style={{ color: 'var(--text-sub)', fontSize: 12 }}>{desc}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default function Header({ neighborhood, isCustom, loading, onRefresh, onSetCustom, onAdminOpen }) {
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [showGuide, setShowGuide] = useState(false)

  const handleSetLocation = () => {
    if (locationInput.trim()) {
      onSetCustom(locationInput.trim())
      setLocationInput('')
      setShowLocationInput(false)
    }
  }

  return (
    <div className="wood-header px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapIcon />
          <div>
            <h1 className="text-white text-xl leading-tight" style={{ textShadow: '2px 2px 0px #5C3D1E' }}>
              트렌디 푸드맵
            </h1>
            <div className="flex items-center gap-1.5">
              <p className="text-xs opacity-80" style={{ color: '#BDD7DE' }}>음식 트렌드, 놓칠 수 없는 당신을 위한 맵</p>
              <button
                onClick={() => setShowGuide(true)}
                title="사용 안내"
                style={{
                  background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.5)',
                  borderRadius: '50%', width: 18, height: 18, color: 'white',
                  cursor: 'pointer', fontSize: 11, fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >?</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {neighborhood ? (
              <span className="text-white text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                {isCustom ? '📍' : '🛰️'} {neighborhood}
              </span>
            ) : (
              <span className="text-yellow-100 text-xs opacity-70">
                {loading ? '위치 확인 중...' : '위치 없음'}
              </span>
            )}
          </div>

          <div className="flex gap-1">
            <button onClick={onAdminOpen} title="관리자"
              className="px-2 py-1 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)', color: 'white', cursor: 'pointer' }}>
              🔑
            </button>
            <button onClick={onRefresh} disabled={loading} title="GPS 위치 새로고침"
              className="px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)', color: 'white', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
              {loading ? '⏳' : '📡'} 내 위치로
            </button>
            <button onClick={() => setShowLocationInput(!showLocationInput)} title="지역 직접 설정"
              className="px-2 py-1 rounded-lg text-xs font-bold"
              style={{ background: showLocationInput ? '#5BAF3C' : 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)', color: 'white', cursor: 'pointer' }}>
              🗾 지역설정
            </button>
          </div>
        </div>
      </div>

      {showLocationInput && (
        <div className="mt-2 flex gap-2">
          <input className="poko-input flex-1" style={{ padding: '7px 12px', fontSize: 13 }}
            placeholder="동·구 이름 입력 (예: 해운대구, 강남구)"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetLocation()}
            autoFocus />
          <button className="poko-btn-green" style={{ padding: '7px 14px', fontSize: 13 }} onClick={handleSetLocation}>확인</button>
          <button className="poko-chip" style={{ padding: '6px 10px' }}
            onClick={() => { setShowLocationInput(false); setLocationInput('') }}>✕</button>
        </div>
      )}

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  )
}
