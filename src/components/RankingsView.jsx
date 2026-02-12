import { Link } from 'react-router-dom'
import './RankingsView.css'

export function RankingsView({ getRankedClubs }) {
  const ranked = getRankedClubs()

  return (
    <div className="rankings-view">
      <div className="rankings-header">
        <h1>Penn Club Rankings</h1>
        <p>Based on collective votes. Keep voting to improve the rankings!</p>
        <Link to="/" className="vote-link">← Vote on more clubs</Link>
      </div>
      <div className="rankings-list">
        {ranked.map((club, i) => (
          <RankRow key={club.code} rank={i + 1} club={club} />
        ))}
      </div>
    </div>
  )
}

function RankRow({ rank, club }) {
  const imageUrl = club.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(club.name)}&background=990000&color=fff&size=72`
  const tagNames = (club.tags || []).map((t) => t.name).slice(0, 4).join(' · ')

  return (
    <a
      href={`https://pennclubs.com/club/${club.code}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rank-row"
    >
      <span className="rank-num">{rank}</span>
      <div className="rank-image">
        <img src={imageUrl} alt={club.name} />
      </div>
      <div className="rank-info">
        <h3>{club.name}</h3>
        {club.subtitle && <p>{club.subtitle.slice(0, 50)}{club.subtitle.length > 50 ? '…' : ''}</p>}
        {tagNames && <span className="rank-tags">{tagNames}</span>}
      </div>
      <span className="rank-elo">{club.elo}</span>
    </a>
  )
}
