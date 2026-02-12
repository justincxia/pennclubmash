import { Routes, Route, Link } from 'react-router-dom'
import { useClubs } from './hooks/useClubs'
import { useRankings } from './hooks/useRankings'
import { VoteView } from './components/VoteView'
import { RankingsView } from './components/RankingsView'
import './App.css'

function App() {
  const { clubs, loading, error } = useClubs()
  const { recordVote, getRankedClubs } = useRankings(clubs)

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-screen">
          <div className="loader" />
          <p>Loading clubs from Penn Clubs…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error-screen">
          <h2>Couldn't load clubs</h2>
          <p>{error}</p>
          <p>Check your connection or try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={<VoteView clubs={clubs} recordVote={recordVote} />}
          />
          <Route
            path="/rankings"
            element={<RankingsView getRankedClubs={getRankedClubs} />}
          />
        </Routes>
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-text">Penn Club Mash</span>
      </Link>
      <nav>
        <Link to="/">Vote</Link>
        <Link to="/rankings">Rankings</Link>
      </nav>
    </header>
  )
}

export default App
