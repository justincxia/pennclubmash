import { useState, useEffect } from 'react'

const PENN_CLUBS_API = import.meta.env.DEV
  ? '/api/clubs/?format=json'
  : 'https://pennclubs.com/api/clubs/?format=json'

export function useClubs() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch(PENN_CLUBS_API)
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
