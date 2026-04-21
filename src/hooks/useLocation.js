import { useState, useCallback, useEffect } from 'react'

async function forwardGeocode(name) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&accept-language=ko&limit=1&countrycodes=kr`
    )
    const data = await res.json()
    if (!data.length) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko`
    )
    const data = await res.json()
    const addr = data.address

    // 시/도 레벨 (부산광역시, 서울특별시 등)
    const city = addr.city || addr.province || addr.state || ''
    // 구/군 레벨
    const district = addr.county || addr.city_district || ''
    // 동/읍/면 레벨
    const dong = addr.suburb || addr.neighbourhood || addr.town || ''

    // 검색용: 시+구+동 (중복 방지)
    const searchLocation = [city, district, dong]
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .join(' ')

    // 표시용: 구+동만
    const displayLocation = [district, dong].filter(Boolean).join(' ') || city

    return { searchLocation, displayLocation }
  } catch {
    return { searchLocation: '', displayLocation: '' }
  }
}

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [neighborhood, setNeighborhood] = useState('')      // 검색용 (시+구+동)
  const [displayName, setDisplayName] = useState('')         // 표시용 (구+동)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isCustom, setIsCustom] = useState(false)

  const fetchGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError('위치 서비스를 지원하지 않는 브라우저예요.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        setLocation({ lat, lng })
        const { searchLocation, displayLocation } = await reverseGeocode(lat, lng)
        setNeighborhood(searchLocation)
        setDisplayName(displayLocation)
        setIsCustom(false)
        setLoading(false)
      },
      () => {
        setError('위치 권한을 허용해주세요.')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  useEffect(() => { fetchGPS() }, [fetchGPS])

  const setCustomNeighborhood = useCallback(async (name) => {
    setNeighborhood(name)
    setDisplayName(name)
    setIsCustom(true)
    const coords = await forwardGeocode(name)
    setLocation(coords)
  }, [])

  return { location, neighborhood, displayName, error, loading, isCustom, refresh: fetchGPS, setCustomNeighborhood }
}
