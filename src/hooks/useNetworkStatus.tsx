import { useEffect, useState } from 'react'

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [hasInternet, setHasInternet] = useState(false)

  // Función para agregar timeout al fetch
  const fetchWithTimeout = (
    url: string,
    options: RequestInit,
    timeout: number
  ) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timeout'))
      }, timeout)

      fetch(url, options)
        .then((response) => {
          clearTimeout(timer)
          resolve(response)
        })
        .catch((err) => {
          clearTimeout(timer)
          reject(err)
        })
    })
  }

  const updateNetworkStatus = async () => {
    setIsOnline(navigator.onLine)

    if (navigator.onLine) {
      // Hacer una petición a un recurso confiable con timeout
      try {
        await fetchWithTimeout(
          'https://www.google.com',
          { mode: 'no-cors' },
          3000
        ) // Timeout de 3 segundos
        setHasInternet(true) // Si no hay error, hay acceso a Internet
      } catch (error) {
        console.log("Internet error: ", error);
        
        setHasInternet(false) // Si hay error o timeout, no hay acceso a Internet
      }
    } else {
      setHasInternet(false) // Si no está online, no hay acceso a Internet
    }
  }

  useEffect(() => {
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Verificar la conexión actual al montar el hook
    updateNetworkStatus()

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isOnline, hasInternet }
}

export default useNetworkStatus
