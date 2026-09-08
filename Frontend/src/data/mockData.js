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
<<<<<<< HEAD
  { label: 'Dashboard', icon: 'LayoutDashboard', to: '/government', end: true },
  { label: 'Live Disaster Map', icon: 'Map', to: '/government/map' },
  { label: 'Incident Management', icon: 'FlameKindling', to: '/government/incidents' },
  { label: 'Rescue Team Management', icon: 'Users', to: '/government/rescue-teams' },
  { label: 'Citizen Requests', icon: 'Inbox', to: '/government/requests' },
  { label: 'Shelter Management', icon: 'Home', to: '/government/shelters' },
  { label: 'Relief Distribution', icon: 'PackageOpen', to: '/government/relief' },
  { label: 'Inventory', icon: 'Boxes', to: '/government/inventory' },
  { label: 'Volunteer Verification', icon: 'ShieldCheck', to: '/government/volunteers' },
  { label: 'NGO Management', icon: 'Building2', to: '/government/ngos' },
  { label: 'User Management', icon: 'UserCog', to: '/government/users' },
  { label: 'Reports & Analytics', icon: 'BarChart3', to: '/government/reports' },
  { label: 'Announcements', icon: 'Megaphone', to: '/government/announcements' },
  { label: 'Settings', icon: 'Settings', to: '/government/settings' },
=======
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
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
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
  { label: 'Dashboard', icon: 'LayoutDashboard', to: '/volunteer', end: true },
  { label: 'Assigned Task', icon: 'ListChecks', to: '/volunteer/tasks' },
  { label: 'Task Details', icon: 'FileText', to: '/volunteer/tasks' },
  { label: 'Navigation', icon: 'Navigation', to: '/volunteer/navigation' },
  { label: 'Update Status', icon: 'RefreshCcw', to: '/volunteer/update-status' },
  { label: 'Activity History', icon: 'History', to: '/volunteer/activity' },
  { label: 'Profile', icon: 'CircleUser', to: '/volunteer/profile' },
]
