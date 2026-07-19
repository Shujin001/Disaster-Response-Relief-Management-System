# Nepal Disaster Risk Management — Frontend

React + Tailwind frontend for the Disaster Response & Relief Management System, covering all three
roles from the Figma flow: **Government/Admin**, **Citizen**, and **Volunteer**. Currently wired to
mock data in `src/data/mockData.js` — no backend required to run it.

## Run it

```bash
npm install
npm run dev
```

Then open the printed localhost URL. `/` is a role picker; it links to `/government`, `/citizen`,
and `/volunteer`.

## Structure

```
src/
  components/   Header, Sidebar, StatCard, Panel (colored tile), StatusDot (pulse indicator)
  pages/        Landing.jsx, GovernmentDashboard.jsx, CitizenDashboard.jsx, VolunteerDashboard.jsx
  data/         mockData.js — all fake data + sidebar nav items, one place to swap for real API calls
```

## Design tokens

Defined in `tailwind.config.js` under `theme.extend.colors`:
- `brand.crimson` / `brand.blue` — Nepal flag colors, used for role accents and severity
- `status.critical|warning|safe|info|idle` — used by `StatusDot` and badges everywhere
- `base` — near-black navy surface scale (`base`, `base-surface`, `base-raised`, `base-border`)

Fonts: Space Grotesk (headings), Inter (body), IBM Plex Mono (stats/data), loaded via Google Fonts
in `index.html`.

## Wiring up the MERN backend later

Each page currently imports static arrays from `mockData.js`. To connect a real Express/MongoDB API:

1. Replace the imports in each dashboard page with `useEffect` + `fetch`/`axios` calls to your API,
   storing results in `useState`.
2. Keep the same data shapes used in `mockData.js` (e.g. `{ id, type, location, severity, status }`
   for incidents) so the existing JSX doesn't need to change — just point it at real values.
3. Add an auth layer (JWT/session) and gate `/government`, `/citizen`, `/volunteer` behind role
   checks instead of the open role-picker on `/`.
4. Swap the map placeholder in `GovernmentDashboard.jsx` / `CitizenDashboard.jsx` for Leaflet or
   Mapbox GL, feeding it live incident coordinates from the API.

## Notes

- Sidebar nav items are currently visual only (no routing per item) — they set `activeIndex` state.
  Wire each to its own route/page as those features get built out.
- `Panel` is the shared card component for every colored tile (Disaster Map, Emergency Alerts, etc.)
  — pass `tone="critical" | "blue" | "warning" | "safe" | "neutral"` to match the wireframe's color
  coding.
