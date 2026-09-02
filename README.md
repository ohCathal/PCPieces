# Bench — PC build planner

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Get an Anthropic API key from https://console.anthropic.com and create a `.env` file:
   ```
   cp .env.example .env
   ```
   Then edit `.env` and paste your key in place of `your-key-here`.

## Run it (two terminals)

**Terminal 1 — backend** (handles the AI recommendations, keeps your API key private):
```
npm run server
```

**Terminal 2 — frontend:**
```
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Notes

- **Profiles** are saved with `localStorage`, so they only live in this browser on this device. For profiles that follow someone across devices, swap the functions in `src/App.jsx` (`loadProfile`, `saveProfile`, `listProfiles`) for calls to a real backend + database.
- **The PIN gate is not real security** — it's a soft lock to keep casual access out of a saved build, not encrypted authentication. Don't reuse a real password there, and don't treat it as protecting sensitive data.
- **Parts catalog** lives in `src/App.jsx` under `CATALOG`. Prices are static reference points — update them periodically, or wire in a live pricing source if you want current numbers.
- **Retailer links** are Amazon search links built from the part name, so they won't go dead the way a fixed product link would — but they also won't show you the literal cheapest listing automatically.
