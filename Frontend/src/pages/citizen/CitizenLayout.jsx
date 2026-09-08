import { Outlet, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { citizenSidebar } from '../../data/mockData'
import { useViewUser } from '../../hooks/useViewUser'
import ErrorBoundary from '../../components/ErrorBoundary'

export default function CitizenLayout() {
  const viewUser = useViewUser()
  const location = useLocation()

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={viewUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={citizenSidebar} accent="blue" user={viewUser} />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
