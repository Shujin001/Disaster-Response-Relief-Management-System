// Centralized mock data. Replace with real API calls (fetch/axios) once
// the Express + MongoDB backend is wired up. Shapes here are intended to
// mirror what those endpoints should eventually return.

export const orgInfo = {
  country: 'Government Of Nepal',
  department: 'Nepal Disaster Risk Management',
  location: 'Kathmandu, Nepal',
}

export const currentUser = {
  government: { name: 'Anku Jaiswal', role: 'District Disaster Officer', initials: 'AJ' },
  citizen: { name: 'Upasana Thapa', role: 'Citizen • Ward 12, Kathmandu', initials: 'UT' },
  volunteer: { name: 'Chirag Sharma', role: 'Volunteer • Red Cross Nepal', initials: 'CS' },
}

// ---------- GOVERNMENT ----------

export const govStats = [
  { label: 'Active Incidents', value: 14, delta: '+3 today', tone: 'critical' },
  { label: 'SOS Requests', value: 27, delta: '9 unresolved', tone: 'critical' },
  { label: 'Rescue Teams Active', value: 8, delta: 'of 12 total', tone: 'warning' },
  { label: 'Shelter Occupancy', value: '72%', delta: '4,120 / 5,700', tone: 'info' },
  { label: 'Relief Distributed', value: '68%', delta: 'this week', tone: 'safe' },
]

export const govIncidents = [
  { id: 'INC-2031', type: 'Flood', location: 'Riverside, Chitwan', severity: 'Critical', status: 'Active', reported: '2h ago' },
  { id: 'INC-2030', type: 'Landslide', location: 'Sindhupalchok', severity: 'High', status: 'Active', reported: '5h ago' },
  { id: 'INC-2029', type: 'Fire', location: 'Baneshwor, Kathmandu', severity: 'Medium', status: 'Contained', reported: '9h ago' },
  { id: 'INC-2028', type: 'Flood', location: 'Birgunj', severity: 'High', status: 'Active', reported: '1d ago' },
  { id: 'INC-2027', type: 'Earthquake Aftershock', location: 'Gorkha', severity: 'Low', status: 'Resolved', reported: '2d ago' },
]

export const incidentsByType = [
  { type: 'Flood', count: 18 },
  { type: 'Landslide', count: 9 },
  { type: 'Fire', count: 6 },
  { type: 'Earthquake', count: 4 },
  { type: 'Windstorm', count: 3 },
]

export const rescueTeams = [
  { name: 'Alpha Rescue Unit', members: 8, zone: 'Chitwan Riverside', status: 'Deployed' },
  { name: 'Bravo Medical Team', members: 6, zone: 'Sindhupalchok', status: 'Deployed' },
  { name: 'Charlie Response Squad', members: 10, zone: 'Kathmandu Valley', status: 'Standby' },
  { name: 'Delta Airlift Team', members: 5, zone: 'Birgunj', status: 'En Route' },
]

export const reliefOverview = [
  { category: 'Food Packages', distributed: 3200, target: 4500 },
  { category: 'Clean Water (L)', distributed: 18500, target: 25000 },
  { category: 'Medical Kits', distributed: 940, target: 1200 },
  { category: 'Tents / Shelter', distributed: 610, target: 900 },
]

export const govAnnouncements = [
  { title: 'Monsoon flood advisory issued for Terai region', time: '1h ago', tag: 'Alert' },
  { title: 'New shelter opened at Bhaktapur Community Hall', time: '4h ago', tag: 'Update' },
  { title: 'Volunteer verification drive begins Monday', time: '1d ago', tag: 'Notice' },
]

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

// ---------- CITIZEN ----------

export const citizenStats = [
  { label: 'Active Alerts', value: 3, delta: '1 near you', tone: 'critical' },
  { label: 'My Requests', value: 2, delta: '1 pending', tone: 'warning' },
  { label: 'Nearby Shelters', value: 6, delta: 'within 5km', tone: 'info' },
  { label: 'Emergency Contacts', value: 5, delta: 'saved', tone: 'safe' },
]

export const citizenAlerts = [
  { title: 'Flood warning — Bagmati river rising', level: 'Critical', time: '20m ago' },
  { title: 'Heavy rainfall expected tonight', level: 'Warning', time: '2h ago' },
  { title: 'Road closure near Koteshwor', level: 'Notice', time: '6h ago' },
]

export const citizenRequests = [
  { id: 'REQ-4471', type: 'Relief Request', status: 'Pending', date: 'Jul 18, 2026' },
  { id: 'REQ-4402', type: 'Shelter Assistance', status: 'Approved', date: 'Jul 15, 2026' },
]

export const nearbyShelters = [
  { name: 'Bhaktapur Community Hall', distance: '1.2 km', capacity: '68 / 120', status: 'Open' },
  { name: 'Kathmandu Model School', distance: '2.4 km', capacity: '110 / 150', status: 'Open' },
  { name: 'Ward 12 Health Post', distance: '3.1 km', capacity: '40 / 40', status: 'Full' },
]

export const citizenAnnouncements = [
  { title: 'Relief distribution camp opens Sunday at Ratna Park', time: '3h ago' },
  { title: 'Blood donation drive — Red Cross Kathmandu', time: '1d ago' },
]

export const citizenQuickActions = [
  { label: 'Send Emergency SOS', icon: 'Siren', tone: 'critical' },
  { label: 'Report a Disaster', icon: 'TriangleAlert', tone: 'warning' },
  { label: 'Request Relief', icon: 'HandHeart', tone: 'info' },
  { label: 'Report Missing Person', icon: 'UserSearch', tone: 'idle' },
]

export const citizenSidebar = [
  { label: 'Dashboard', icon: 'LayoutDashboard' },
  { label: 'Emergency SOS', icon: 'Siren' },
  { label: 'Report Disaster', icon: 'TriangleAlert' },
  { label: 'Disaster Alert', icon: 'BellRing' },
  { label: 'Nearby Shelter', icon: 'Home' },
  { label: 'Relief Request', icon: 'HandHeart' },
  { label: 'Missing Person', icon: 'UserSearch' },
  { label: 'Donate', icon: 'Gift' },
  { label: 'Emergency Contacts', icon: 'Phone' },
  { label: 'Profile', icon: 'CircleUser' },
]

// ---------- VOLUNTEER ----------

export const volunteerStats = [
  { label: 'Assigned Tasks', value: 6, delta: '2 due today', tone: 'warning' },
  { label: 'Active Mission', value: 1, delta: 'Riverside Ops', tone: 'critical' },
  { label: 'Completed Today', value: 4, delta: 'tasks', tone: 'safe' },
  { label: 'Hours Volunteered', value: 128, delta: 'this month', tone: 'info' },
]

export const volunteerTasks = [
  { id: 'T-118', title: 'Distribute food packages — Sector 4', priority: 'High', due: 'Today, 4:00 PM', status: 'In Progress' },
  { id: 'T-117', title: 'Escort medical team to shelter B', priority: 'High', due: 'Today, 5:30 PM', status: 'Pending' },
  { id: 'T-115', title: 'Inventory count — Tent supplies', priority: 'Medium', due: 'Tomorrow', status: 'Pending' },
  { id: 'T-110', title: 'Register new arrivals — Shelter A', priority: 'Low', due: 'Jul 20, 2026', status: 'Completed' },
]

export const volunteerActivity = [
  { text: 'Completed task: Water distribution — Zone C', time: '1h ago' },
  { text: 'Checked in at Riverside Relief Camp', time: '3h ago' },
  { text: 'Task assigned: Escort medical team', time: '5h ago' },
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
