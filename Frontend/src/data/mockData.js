// Everything that used to be mock data for stats/incidents/tasks/etc. has
// been removed now that every dashboard reads live data from the API (see
// src/api/endpoints.js). What's left here is genuinely static UI config —
// org branding text and the sidebar nav structure for each role — which has
// no backend equivalent and isn't meant to.

export const orgInfo = {
  country: 'Government Of Nepal',
  department: 'Nepal Disaster Risk Management',
  location: 'Kathmandu, Nepal',
}

export const govSidebar = [
  { label: 'Dashboard', icon: 'LayoutDashboard' },
  { label: 'Live Disaster Map', icon: 'Map' },
  { label: 'Incident Management', icon: 'FlameKindling' },
  { label: 'Rescue Team Management', icon: 'Users' },
  { label: 'Citizen Requests', icon: 'Inbox' },
  { label: 'Shelter Management', icon: 'Home' },
  { label: 'Relief Distribution', icon: 'PackageOpen' },
  { label: 'Inventory', icon: 'Boxes' },
  { label: 'Volunteer Verification', icon: 'ShieldCheck' },
  { label: 'NGO Management', icon: 'Building2' },
  { label: 'User Management', icon: 'UserCog' },
  { label: 'Reports & Analytics', icon: 'BarChart3' },
  { label: 'Announcements', icon: 'Megaphone' },
  { label: 'Settings', icon: 'Settings' },
]

export const citizenSidebar = [
  { label: 'Dashboard', icon: 'LayoutDashboard', to: '/citizen', end: true },
  { label: 'Emergency SOS', icon: 'Siren', to: '/citizen/sos' },
  { label: 'Report Disaster', icon: 'TriangleAlert', to: '/citizen/report' },
  { label: 'Disaster Alert', icon: 'BellRing', to: '/citizen/alerts' },
  { label: 'Nearby Shelter', icon: 'Home', to: '/citizen/shelters' },
  { label: 'Relief Request', icon: 'HandHeart', to: '/citizen/relief' },
  { label: 'Missing Person', icon: 'UserSearch', to: '/citizen/missing' },
  { label: 'Donate', icon: 'Gift', to: '/citizen/donate' },
  { label: 'Emergency Contacts', icon: 'Phone', to: '/citizen/contacts' },
  { label: 'Profile', icon: 'CircleUser', to: '/citizen/profile' },
]

export const volunteerSidebar = [
  { label: 'Dashboard', icon: 'LayoutDashboard' },
  { label: 'Assigned Task', icon: 'ListChecks' },
  { label: 'Task Details', icon: 'FileText' },
  { label: 'Navigation', icon: 'Navigation' },
  { label: 'Update Status', icon: 'RefreshCcw' },
  { label: 'Activity History', icon: 'History' },
  { label: 'Profile', icon: 'CircleUser' },
]
