import { useEffect, useState } from 'react'

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine)
  }

  useEffect(() => {
    // Escuchar los eventos online y offline
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Limpiar los eventos cuando el componente se desmonte
    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  return { isOnline }
}

export default useNetworkStatus
