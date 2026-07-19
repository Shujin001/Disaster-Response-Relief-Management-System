import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import GovernmentDashboard from './pages/GovernmentDashboard'
import CitizenDashboard from './pages/CitizenDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/government" element={<GovernmentDashboard />} />
      <Route path="/citizen" element={<CitizenDashboard />} />
      <Route path="/volunteer" element={<VolunteerDashboard />} />
    </Routes>
  )
}
