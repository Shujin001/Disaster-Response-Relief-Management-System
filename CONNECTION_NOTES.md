# DRMS — Frontend/Backend Connection Notes

This documents what changed to connect the previously-standalone React frontend
to your Express + MongoDB backend. Nothing in `Backend/` was modified — only
`Frontend/` was touched (plus new files).

## How to run it

**Backend**
```
cd Backend
npm install
npm run seed      # populates MongoDB with the sample data (if not already run)
npm run dev        # or `node server.js` — check your package.json scripts
```
Make sure `Backend/.env` has a real `MONGO_URI` and `JWT_SECRET` set.

**Frontend**
```
cd Frontend
npm install
npm run dev
```
`Frontend/.env` (copied from `.env.example`) points at `http://localhost:5000/api`
by default — change `VITE_API_URL` if your backend runs elsewhere.

Then open `http://localhost:5173`, hit **Create account** to register a citizen
or volunteer, or sign in with one of the seeded accounts (password `password123`):
- `admin@ndrm.gov.np`
- `citizen@example.com`
- `volunteer@example.com`

## What was added

- **`src/api/client.js`** — fetch wrapper: base URL from `VITE_API_URL`, attaches
  the JWT from `sessionStorage`, normalizes errors.
- **`src/api/endpoints.js`** — one function per backend route (incidents, alerts,
  shelters, resources, volunteer tasks, dashboard aggregates).
- **`src/context/AuthContext.jsx`** — login/register/logout, persists the JWT +
  user in `sessionStorage`, re-validates the token against `/auth/me` on load.
- **`src/components/ProtectedRoute.jsx`** — redirects to `/login` if not
  authenticated, or home if the logged-in user's role doesn't match the route.
- **`src/pages/Login.jsx`** — combined sign-in / register form; redirects to the
  right dashboard based on the user's role after auth.
- **`src/hooks/useApi.js`**, **`src/hooks/useViewUser.js`** — small hooks: one
  generic "fetch on mount" hook, one that adapts the real `User` object into
  the `{name, role, initials}` shape `Header`/`Sidebar` already expected.
- **`src/components/AsyncState.jsx`**, **`src/components/Modal.jsx`** — loading/
  error/empty-state UI, and a small modal used for the citizen report/SOS form.
- **`src/utils/format.js`** — relative time (`timeAgo`), enum-to-label
  formatting, initials, date formatting.

## What was changed

- **`App.jsx`** — added `/login`, wrapped the tree in `AuthProvider`, wrapped
  `/government`, `/citizen`, `/volunteer` in `ProtectedRoute` with the right
  role restrictions (admins can also view citizen/volunteer dashboards).
- **`Header.jsx`** — takes the real logged-in user, adds a working Log out button.
- **`Landing.jsx`** — role cards now link to `/login` (the login page redirects
  to the right dashboard after auth) instead of pretending to be a no-auth preview.
- **`GovernmentDashboard.jsx`, `CitizenDashboard.jsx`, `VolunteerDashboard.jsx`**
  — every panel now reads from `/api/dashboard/*` and the underlying resource
  endpoints instead of `data/mockData.js`. `data/mockData.js` itself is untouched
  (kept for `orgInfo`/sidebar nav items, which have no backend equivalent).

## Design decisions worth knowing about

Your backend doesn't have models for a few things the original mock data
invented (SOS-request counts, "rescue teams," relief-distributed-vs-target,
volunteer hours, emergency contacts). Rather than keep those as fake numbers,
I swapped each stat/panel for the closest **real** thing your API actually
tracks:

| Old mock stat/panel | Now backed by |
|---|---|
| SOS Requests, Rescue Teams Active | Removed — replaced with real "Critical Incidents" / "Active Volunteers" |
| Relief Distributed (%) | "Resource Inventory" — real `Resource` stock levels |
| "Rescue Team Status" panel | "Open Volunteer Tasks" — real unassigned `VolunteerTask`s |
| Emergency Contacts (citizen stat) | "Nearby Incidents" — real unresolved incidents near the area |
| Hours Volunteered | "Open Tasks" count (claimable tasks) |
| Recent Activity (volunteer) | Volunteer's own completed tasks |

Also added two **real write actions** so this isn't read-only:
- **Citizen → Report a Disaster / Send Emergency SOS**: opens a small form that
  `POST`s to `/api/incidents` (SOS sets `severity: critical`).
- **Volunteer → Claim** button on open tasks: calls
  `PATCH /api/volunteer-tasks/:id/assign`.

"Request Relief" and "Report Missing Person" are left as disabled buttons
labeled "Coming soon" rather than faked, since there's no backend model for
either yet.

## Known gaps I did *not* try to solve

- **Map is still a placeholder.** Wiring Mapbox/Leaflet is a bigger, separate
  task — the panel now at least shows a real incident count.
- **`crudFactory.js`'s `createOne`/`updateOne`** still pass `req.body` straight
  to Mongoose (mass-assignment risk flagged in the earlier review). The
  frontend only ever sends the fields it means to — but if you expose more
  models through this factory later, add an explicit field whitelist.
- **No automated tests** were added for the new auth/data-fetching code.
- I verified everything with `npm run build` (frontend) and `node --check`
  (every backend file) — but couldn't run the full stack end-to-end here since
  there's no MongoDB instance in this sandbox. Run it locally and let me know
  if anything doesn't match what I described above.
