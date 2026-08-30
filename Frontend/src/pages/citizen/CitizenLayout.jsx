import { Outlet } from 'react-router-dom'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { citizenSidebar } from '../../data/mockData'
import { useViewUser } from '../../hooks/useViewUser'

export default function CitizenLayout() {
  const viewUser = useViewUser()

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={viewUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={citizenSidebar} accent="blue" user={viewUser} />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
