import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'

const app = express()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'pennclubmash'
const COLLECTION = 'ratings'

const INITIAL_ELO = 1500
const K_FACTOR = 32

function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400))
}

function newElo(current, expected, actual) {
  return Math.round(current + K_FACTOR * (actual - expected))
}

let client = null

async function getDb() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is required')
  if (!client) client = new MongoClient(MONGODB_URI)
  await client.connect()
  return client.db(DB_NAME)
}

async function loadRatings() {
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ _id: 'rankings' })
  return doc?.ratings ?? {}
}

async function saveRatings(ratings) {
  const db = await getDb()
  await db.collection(COLLECTION).updateOne(
    { _id: 'rankings' },
    { $set: { ratings } },
    { upsert: true }
  )
}

app.use(cors())
app.use(express.json())

app.get('/clubs', async (req, res) => {
  try {
    const response = await fetch('https://pennclubs.com/api/clubs/?format=json')
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch clubs' })
  }
})

app.get('/rankings', async (req, res) => {
  try {
    const ratings = await loadRatings()
    res.json(ratings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load rankings' })
  }
})

app.post('/vote', async (req, res) => {
  try {
    const { winnerCode, loserCode } = req.body
    if (!winnerCode || !loserCode) {
      return res.status(400).json({ error: 'winnerCode and loserCode required' })
    }
    const ratings = await loadRatings()
    const rWinner = ratings[winnerCode] ?? INITIAL_ELO
    const rLoser = ratings[loserCode] ?? INITIAL_ELO
    const eWinner = expectedScore(rWinner, rLoser)
    const eLoser = expectedScore(rLoser, rWinner)
    ratings[winnerCode] = newElo(rWinner, eWinner, 1)
    ratings[loserCode] = newElo(rLoser, eLoser, 0)
    await saveRatings(ratings)
    res.json({ ok: true, ratings })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to record vote' })
  }
})

app.listen(PORT, () => {
  console.log(`Penn Club Mash backend on http://localhost:${PORT}`)
  if (!MONGODB_URI) console.warn('Warning: MONGODB_URI not set. Rankings will fail.')
})
