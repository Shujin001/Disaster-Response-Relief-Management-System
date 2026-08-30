import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { labelize, capitalize, timeAgo } from '../utils/format'

// Roughly centers the Kathmandu Valley — every seeded location falls near here.
const DEFAULT_CENTER = [27.7172, 85.324]
const DEFAULT_ZOOM = 10

const SEVERITY_COLOR = {
  critical: '#E63946',
  warning: '#F5A524',
  safe: '#1FAA59',
  info: '#3B82F6',
}

const SHELTER_COLOR = { open: '#2E5CB8', full: '#F5A524', closed: '#5B6B8C' }

export default function DisasterMap({ incidents = [], shelters = [], userLocation, height = '100%' }) {
  const incidentPoints = useMemo(
    () => incidents.filter((i) => typeof i.location?.lat === 'number' && typeof i.location?.lng === 'number'),
    [incidents]
  )
  const shelterPoints = useMemo(
    () => shelters.filter((s) => typeof s.location?.lat === 'number' && typeof s.location?.lng === 'number'),
    [shelters]
  )

  const allPoints = [
    ...incidentPoints.map((i) => [i.location.lat, i.location.lng]),
    ...shelterPoints.map((s) => [s.location.lat, s.location.lng]),
  ]
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : allPoints.length
    ? allPoints[0]
    : DEFAULT_CENTER

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-white/10" style={{ height }}>
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', background: '#0A0F1C' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {incidentPoints.map((inc) => (
          <CircleMarker
            key={inc._id}
            center={[inc.location.lat, inc.location.lng]}
            radius={inc.severity === 'critical' ? 10 : 7}
            pathOptions={{
              color: SEVERITY_COLOR[inc.severity] || SEVERITY_COLOR.info,
              fillColor: SEVERITY_COLOR[inc.severity] || SEVERITY_COLOR.info,
              fillOpacity: 0.75,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              {labelize(inc.type)} · {capitalize(inc.severity)}
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{labelize(inc.type)}</p>
                <p className="text-xs opacity-80 mt-0.5">{inc.location.address}</p>
                {inc.description && <p className="text-xs mt-1">{inc.description}</p>}
                <p className="text-xs mt-1">
                  {capitalize(inc.severity)} · {labelize(inc.status)} · {timeAgo(inc.createdAt)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {shelterPoints.map((s) => (
          <CircleMarker
            key={s._id}
            center={[s.location.lat, s.location.lng]}
            radius={8}
            pathOptions={{
              color: SHELTER_COLOR[s.status] || SHELTER_COLOR.open,
              fillColor: SHELTER_COLOR[s.status] || SHELTER_COLOR.open,
              fillOpacity: 0.9,
              weight: 2,
              dashArray: '2,2',
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              {s.name} (shelter)
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs opacity-80 mt-0.5">{s.location.address}</p>
                <p className="text-xs mt-1">
                  {s.occupancy} / {s.capacity} occupied · {capitalize(s.status)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-2 left-2 z-[1000] flex flex-wrap gap-2 text-[10px] font-mono">
        <Legend color={SEVERITY_COLOR.critical} label="Critical" />
        <Legend color={SEVERITY_COLOR.warning} label="Warning" />
        <Legend color={SEVERITY_COLOR.safe} label="Safe" />
        <Legend color={SHELTER_COLOR.open} label="Shelter" dashed />
      </div>
    </div>
  )
}

function Legend({ color, label, dashed }) {
  return (
    <span className="flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-ink-secondary">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color, border: dashed ? `1px dashed ${color}` : 'none' }}
      />
      {label}
    </span>
  )
}
