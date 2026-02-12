import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.DEV ? '/mash' : (import.meta.env.VITE_API_URL || '/mash')

export function useClubs() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch(`${API_BASE}/clubs`)
        if (!res.ok) throw new Error('Failed to fetch clubs')
        const data = await res.json()
        const activeClubs = (Array.isArray(data) ? data : []).filter(
          (c) => c.active && c.approved && c.name
        )
        setClubs(activeClubs)
      } catch (err) {
        setError(err.message)
        setClubs([])
      } finally {
        setLoading(false)
      }
    }
    fetchClubs()
  }, [])

  return { clubs, loading, error }
}
