import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import GovernmentDashboard from './pages/GovernmentDashboard'
import CitizenDashboard from './pages/CitizenDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
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
            <ProtectedRoute roles={['citizen', 'admin']}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
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
