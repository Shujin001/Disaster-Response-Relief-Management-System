<<<<<<< HEAD
import { Outlet, useLocation } from 'react-router-dom'
=======
import { Outlet } from 'react-router-dom'
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { citizenSidebar } from '../../data/mockData'
import { useViewUser } from '../../hooks/useViewUser'
<<<<<<< HEAD
import ErrorBoundary from '../../components/ErrorBoundary'

export default function CitizenLayout() {
  const viewUser = useViewUser()
  const location = useLocation()
=======

export default function CitizenLayout() {
  const viewUser = useViewUser()
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={viewUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={citizenSidebar} accent="blue" user={viewUser} />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
<<<<<<< HEAD
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
=======
          <Outlet />
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
        </main>
      </div>
    </div>
  )
}
