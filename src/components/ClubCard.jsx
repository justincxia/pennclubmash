export function ClubCard({ club, onClick, isSelected }) {
  const imageUrl = club.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(club.name)}&background=990000&color=fff&size=80`
  const tagNames = (club.tags || []).map((t) => t.name).slice(0, 3).join(' · ')

  return (
    <button
      type="button"
      onClick={onClick}
      className={`club-card ${isSelected ? 'selected' : ''}`}
    >
      <div className="club-card-image">
        <img src={imageUrl} alt={club.name} loading="lazy" />
      </div>
      <div className="club-card-content">
        <h3>{club.name}</h3>
        {club.subtitle && (
          <p className="subtitle">{club.subtitle.slice(0, 80)}{club.subtitle.length > 80 ? '…' : ''}</p>
        )}
        {tagNames && <span className="tags">{tagNames}</span>}
      </div>
    </button>
  )
}
