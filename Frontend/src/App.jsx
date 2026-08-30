import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import CitizenGate from './components/CitizenGate'
import Login from './pages/Login'
import GovernmentDashboard from './pages/GovernmentDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'

import CitizenLayout from './pages/citizen/CitizenLayout'
import CitizenDashboard from './pages/citizen/CitizenDashboard'
import IncidentActionPage from './pages/citizen/IncidentActionPage'
import AlertsPage from './pages/citizen/AlertsPage'
import SheltersPage from './pages/citizen/SheltersPage'
import DonatePage from './pages/citizen/DonatePage'
import ContactsPage from './pages/citizen/ContactsPage'
import ProfilePage from './pages/citizen/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* The site opens straight into the citizen experience — no login
            required. Government/volunteer staff reach their own areas via
            /login (linked from the citizen header). */}
        <Route path="/" element={<Navigate to="/citizen" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/government"
          element={
            <ProtectedRoute roles={['admin']}>
              <GovernmentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen"
          element={
            <CitizenGate>
              <CitizenLayout />
            </CitizenGate>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="sos" element={<IncidentActionPage mode="sos" />} />
          <Route path="report" element={<IncidentActionPage mode="report" />} />
          <Route path="relief" element={<IncidentActionPage mode="relief" />} />
          <Route path="missing" element={<IncidentActionPage mode="missing" />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="shelters" element={<SheltersPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/volunteer"
          element={
            <ProtectedRoute roles={['volunteer', 'admin']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
