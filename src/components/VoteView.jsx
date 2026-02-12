import { useState, useEffect } from 'react'
import { ClubCard } from './ClubCard'
import './VoteView.css'

function pickRandomPair(clubs, excludeCodes = []) {
  const pool = clubs.filter((c) => !excludeCodes.includes(c.code))
  if (pool.length < 2) return null
  const i = Math.floor(Math.random() * pool.length)
  let j = Math.floor(Math.random() * pool.length)
  while (j === i) j = Math.floor(Math.random() * pool.length)
  return [pool[i], pool[j]]
}

export function VoteView({ clubs, recordVote }) {
  const [pair, setPair] = useState(null)
  const [votesThisSession, setVotesThisSession] = useState(0)

  useEffect(() => {
    if (clubs.length >= 2) {
      setPair(pickRandomPair(clubs))
    }
  }, [clubs.length])

  const handleVote = (winner, loser) => {
    recordVote(winner.code, loser.code)
    setVotesThisSession((v) => v + 1)
    const pool = clubs.filter((c) => c.code !== winner.code && c.code !== loser.code)
    const next =
      pool.length > 0
        ? [winner, pool[Math.floor(Math.random() * pool.length)]]
        : pickRandomPair(clubs)
    setPair(next)
  }

  if (clubs.length < 2) return null
  if (!pair) return <div className="loading-state">Loading pair…</div>

  const [clubA, clubB] = pair

  return (
    <div className="vote-view">
      <p className="vs-label">Which club would you rather join?</p>
      <div className="vs-grid">
        <ClubCard
          club={clubA}
          onClick={() => handleVote(clubA, clubB)}
        />
        <span className="vs-divider">VS</span>
        <ClubCard
          club={clubB}
          onClick={() => handleVote(clubB, clubA)}
        />
      </div>
      <p className="vote-count">Votes this session: {votesThisSession}</p>
    </div>
  )
}
