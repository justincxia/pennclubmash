import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.DEV ? '/mash' : (import.meta.env.VITE_API_URL || '/mash')
const INITIAL_ELO = 1500

async function fetchRankings() {
  const res = await fetch(`${API_BASE}/rankings`)
  if (!res.ok) throw new Error('Failed to fetch rankings')
  return res.json()
}

async function postVote(winnerCode, loserCode) {
  const res = await fetch(`${API_BASE}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ winnerCode, loserCode }),
  })
  if (!res.ok) throw new Error('Failed to record vote')
  return res.json()
}

export function useRankings(clubs) {
  const [ratings, setRatings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchRankings()
      .then((data) => {
        if (!cancelled) setRatings(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const getRating = useCallback(
    (code) => ratings[code] ?? INITIAL_ELO,
    [ratings]
  )

  const recordVote = useCallback(
    async (winnerCode, loserCode) => {
      try {
        const { ratings: newRatings } = await postVote(winnerCode, loserCode)
        setRatings(newRatings)
      } catch (err) {
        setError(err.message)
      }
    },
    []
  )

  const getRankedClubs = useCallback(() => {
    const withRating = clubs.map((c) => ({
      ...c,
      elo: getRating(c.code),
    }))
    return withRating.sort((a, b) => b.elo - a.elo)
  }, [clubs, getRating])

  return { getRating, recordVote, getRankedClubs, loading, error }
}
