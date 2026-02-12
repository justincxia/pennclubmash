# Penn Club Mash

A FaceMash-style voting site that lets users vote on pairs of clubs at the University of Pennsylvania to collectively generate a ranking of the best clubs at Penn.

## Features

- **Penn Clubs API** – Fetches a comprehensive list of all active, approved clubs from [Penn Clubs](https://pennclubs.com/api/)
- **Pairwise Voting** – Users see two clubs side-by-side and pick which they’d rather join
- **Elo Ranking** – Uses an Elo-style rating system to compute rankings from votes
- **Shared Rankings** – Votes sync to a backend so all users contribute to the same rankings
- **Links to Penn Clubs** – Each club in the rankings links to its profile on Penn Clubs

## Getting Started

1. Create a MongoDB Atlas cluster (free tier) and get your connection string.
2. Set the `MONGODB_URI` environment variable (format: `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/pennclubmash`).
3. Run:
```bash
npm install
cd backend && npm install && cd ..
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173). Open [http://localhost:5173](http://localhost:5173) to use the app.

For production on Render, add `MONGODB_URI` as an environment variable in your service settings.

## Tech Stack

- **React 18** + **Vite** (frontend)
- **Express** (backend for vote sync)
- **React Router** for navigation
- Penn Clubs REST API (`https://pennclubs.com/api/clubs/?format=json`)
# pennclubmash
