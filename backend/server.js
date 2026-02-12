import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const DATA_DIR = join(__dirname, 'data')
const RATINGS_FILE = join(DATA_DIR, 'ratings.json')

const INITIAL_ELO = 1500
const K_FACTOR = 32

function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400))
}

function newElo(current, expected, actual) {
  return Math.round(current + K_FACTOR * (actual - expected))
}

function loadRatings() {
  if (!existsSync(RATINGS_FILE)) return {}
  try {
    const raw = readFileSync(RATINGS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveRatings(ratings) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(RATINGS_FILE, JSON.stringify(ratings), 'utf-8')
}

app.use(cors())
app.use(express.json())

app.get('/rankings', (req, res) => {
  try {
    const ratings = loadRatings()
    res.json(ratings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load rankings' })
  }
})

app.post('/vote', (req, res) => {
  try {
    const { winnerCode, loserCode } = req.body
    if (!winnerCode || !loserCode) {
      return res.status(400).json({ error: 'winnerCode and loserCode required' })
    }
    const ratings = loadRatings()
    const rWinner = ratings[winnerCode] ?? INITIAL_ELO
    const rLoser = ratings[loserCode] ?? INITIAL_ELO
    const eWinner = expectedScore(rWinner, rLoser)
    const eLoser = expectedScore(rLoser, rWinner)
    ratings[winnerCode] = newElo(rWinner, eWinner, 1)
    ratings[loserCode] = newElo(rLoser, eLoser, 0)
    saveRatings(ratings)
    res.json({ ok: true, ratings })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to record vote' })
  }
})

app.listen(PORT, () => {
  console.log(`Penn Club Mash backend on http://localhost:${PORT}`)
})
