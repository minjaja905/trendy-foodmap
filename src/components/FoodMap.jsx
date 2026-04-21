import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Leaflet 기본 아이콘 경로 픽스
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const userIcon = L.divIcon({
  html: '<div style="width:20px;height:20px;background:#E8453C;border:3px solid #5C3D1E;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  className: '',
  iconAnchor: [10, 10],
})

const storeIcon = L.divIcon({
  html: `<svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="pin-c" x="-20%" y="-10%" width="140%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="4" result="g"/>
        <feColorMatrix type="matrix" in="g" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -4 4.2" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in" result="t"/>
        <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" seed="7" result="w"/>
        <feDisplacementMap in="t" in2="w" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="pin-s" x="-15%" y="-10%" width="130%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    <g filter="url(#pin-c)">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 6.5 8 20 8 20s8-13.5 8-20c0-4.4-3.6-8-8-8z" fill="#BDD7DE" opacity="0.92"/>
      <circle cx="12" cy="10" r="3.5" fill="white" opacity="0.9"/>
    </g>
    <g filter="url(#pin-s)">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 6.5 8 20 8 20s8-13.5 8-20c0-4.4-3.6-8-8-8z" fill="none" stroke="#583722" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="12" cy="10" r="3.5" fill="none" stroke="#583722" stroke-width="1.5"/>
    </g>
  </svg>`,
  className: '',
  iconAnchor: [12, 30],
})

function MapMover({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.flyTo(center, 15, { duration: 1 }) }, [center, map])
  return null
}

export default function FoodMap({ userLocation, stores }) {
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [37.5665, 126.9780]

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '100%', width: '100%', minHeight: 280 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">Carto</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      {userLocation && (
        <MapMover center={[userLocation.lat, userLocation.lng]} />
      )}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <span style={{ fontFamily: 'M PLUS Rounded 1c', fontWeight: 800 }}>📍 내 위치</span>
          </Popup>
        </Marker>
      )}
      {stores.filter(s => s.lat && s.lng).map((store, i) => (
        <Marker key={i} position={[store.lat, store.lng]} icon={storeIcon}>
          <Popup>
            <div style={{ fontFamily: 'M PLUS Rounded 1c', minWidth: 160 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{store.title}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{store.roadAddress || store.address}</div>
              {store.telephone && (
                <div style={{ fontSize: 12, color: '#5BAF3C', marginTop: 4 }}>📞 {store.telephone}</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
