# Nepal Disaster Risk Management — Backend API

Express + MongoDB (Mongoose) API for the Disaster Response & Relief Management System, matching
the three roles from the frontend: **Government/Admin**, **Citizen**, and **Volunteer**. Data
shapes mirror what `mockData.js` used on the frontend (`{ id, type, location, severity, status }`
for incidents, etc.) so you can point the existing dashboards at real endpoints with minimal
changes.

## Setup

Requires Node 18+ and a running MongoDB instance (local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster).

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGO_URI / JWT_SECRET as needed
npm run seed            # populates sample users, incidents, alerts, shelters, resources, tasks
npm run dev              # starts the API on http://localhost:5000
```

Seeded login accounts (password for all: `password123`):

| Role      | Email                       |
|-----------|------------------------------|
| Admin     | admin@ndrm.gov.np            |
| Citizen   | citizen@example.com          |
| Volunteer | volunteer@example.com        |

Run `npm run seed:destroy` to wipe all collections without reseeding.

## Auth

JWT-based. `POST /api/auth/register` and `POST /api/auth/login` return `{ data: user, token }`.
Send the token on subsequent requests as `Authorization: Bearer <token>`.

## Endpoints

| Resource         | Base path                | Notes |
|-------------------|---------------------------|-------|
| Auth              | `/api/auth`               | `register`, `login`, `GET /me` |
| Incidents         | `/api/incidents`          | CRUD. Citizens can report (`POST`); admin/volunteer can update; admin deletes. |
| Alerts            | `/api/alerts`             | CRUD. Admin-only writes; everyone can read active alerts. |
| Shelters          | `/api/shelters`           | CRUD. Admin creates/deletes; admin & volunteer update occupancy/status. |
| Resources         | `/api/resources`          | CRUD. Admin & volunteer manage stock. |
| Volunteer tasks   | `/api/volunteer-tasks`    | CRUD + `PATCH /:id/assign` for a volunteer to self-claim an open task. |
| Dashboards        | `/api/dashboard/{government|citizen|volunteer}` | Pre-aggregated stats per role, matching each dashboard page's needs. |

All list endpoints support:
- Filtering by exact field, e.g. `?status=critical&severity=warning`
- `?search=` (regex) over the resource's key text fields
- `?page=&limit=` pagination, `?sort=` (Mongoose sort string, default `-createdAt`)

## Wiring into the existing frontend

Per the frontend README's plan:

1. In each dashboard page, replace the static `mockData.js` imports with `useEffect` + `fetch`
   calls to the matching endpoint above, storing the result in `useState`.
2. Store the JWT (e.g. in memory or `sessionStorage`, kept out of source control either way) after
   login and attach it as a Bearer token on every request.
3. Gate `/government`, `/citizen`, `/volunteer` routes on the frontend by the logged-in user's
   `role`, matching the `authorize()` checks already enforced server-side.
4. For the map placeholder, feed Leaflet/Mapbox the `location.lat` / `location.lng` fields already
   present on `Incident` and `Shelter` documents.

## Project structure

```
backend/
  config/db.js               MongoDB connection
  models/                    Mongoose schemas: User, Incident, Alert, Shelter, Resource, VolunteerTask
  controllers/                Route handlers (crudFactory.js is a shared CRUD builder)
  routes/                     Express routers, one per resource
  middleware/auth.js          JWT verification + role-based authorize()
  middleware/errorHandler.js  Centralized error formatting
  seed/seed.js                Sample data matching the frontend's mock data shapes
  server.js                    App entrypoint
```
