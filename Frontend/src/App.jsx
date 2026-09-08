import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import CitizenGate from './components/CitizenGate'
import Login from './pages/Login'

// Citizen area
import CitizenLayout from './pages/citizen/CitizenLayout'
import CitizenDashboard from './pages/citizen/CitizenDashboard'
import IncidentActionPage from './pages/citizen/IncidentActionPage'
import CitizenAlertsPage from './pages/citizen/AlertsPage'
import CitizenSheltersPage from './pages/citizen/SheltersPage'
import DonatePage from './pages/citizen/DonatePage'
import ContactsPage from './pages/citizen/ContactsPage'
import CitizenProfilePage from './pages/citizen/ProfilePage'

// Government area
import GovernmentLayout from './pages/government/GovernmentLayout'
import GovDashboardPage from './pages/government/DashboardPage'
import MapPage from './pages/government/MapPage'
import IncidentsPage from './pages/government/IncidentsPage'
import RescueTeamsPage from './pages/government/RescueTeamsPage'
import RequestsPage from './pages/government/RequestsPage'
import GovSheltersPage from './pages/government/SheltersPage'
import ReliefPage from './pages/government/ReliefPage'
import InventoryPage from './pages/government/InventoryPage'
import VolunteersPage from './pages/government/VolunteersPage'
import NgoPage from './pages/government/NgoPage'
import UsersPage from './pages/government/UsersPage'
import ReportsPage from './pages/government/ReportsPage'
import AnnouncementsPage from './pages/government/AnnouncementsPage'
import IssueAlertPage from './pages/government/IssueAlertPage'
import SettingsPage from './pages/government/SettingsPage'

// Volunteer area
import VolunteerLayout from './pages/volunteer/VolunteerLayout'
import VolDashboardPage from './pages/volunteer/DashboardPage'
import TasksPage from './pages/volunteer/TasksPage'
import TaskDetailPage from './pages/volunteer/TaskDetailPage'
import NavigationPage from './pages/volunteer/NavigationPage'
import UpdateStatusPage from './pages/volunteer/UpdateStatusPage'
import ActivityPage from './pages/volunteer/ActivityPage'
import VolunteerProfilePage from './pages/volunteer/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* The site opens straight into the citizen experience — no login
            required. Government/volunteer staff reach their own areas via
            /login (linked from the citizen header). */}
        <Route path="/" element={<Navigate to="/citizen" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Citizen — no login required, guest session auto-provisioned by CitizenGate */}
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
          <Route path="alerts" element={<CitizenAlertsPage />} />
          <Route path="shelters" element={<CitizenSheltersPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="profile" element={<CitizenProfilePage />} />
        </Route>

        {/* Government — admin only */}
        <Route
          path="/government"
          element={
            <ProtectedRoute roles={['admin']}>
              <GovernmentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GovDashboardPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="rescue-teams" element={<RescueTeamsPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="shelters" element={<GovSheltersPage />} />
          <Route path="relief" element={<ReliefPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="ngos" element={<NgoPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="announcements/new" element={<IssueAlertPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Volunteer — volunteer or admin */}
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute roles={['volunteer', 'admin']}>
              <VolunteerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VolDashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:id" element={<TaskDetailPage />} />
          <Route path="navigation" element={<NavigationPage />} />
          <Route path="update-status" element={<UpdateStatusPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="profile" element={<VolunteerProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
