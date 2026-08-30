import api from './client'

// Dashboard aggregate endpoints
export const getGovernmentDashboard = () => api.get('/dashboard/government')
export const getCitizenDashboard = () => api.get('/dashboard/citizen')
export const getVolunteerDashboard = () => api.get('/dashboard/volunteer')

// Profile
export const updateProfile = (payload) => api.put('/auth/me', payload)

// Guest (citizen, no credentials) session
export const guestLoginRequest = () => api.post('/auth/guest', {}, { auth: false })

// Incidents
export const getIncidents = (params = '') => api.get(`/incidents${params}`)
export const createIncident = (payload) => api.post('/incidents', payload)
export const updateIncident = (id, payload) => api.put(`/incidents/${id}`, payload)

// Alerts
export const getAlerts = (params = '') => api.get(`/alerts${params}`)
export const createAlert = (payload) => api.post('/alerts', payload)

// Shelters
export const getShelters = (params = '') => api.get(`/shelters${params}`)

// Resources (supplies/inventory)
export const getResources = (params = '') => api.get(`/resources${params}`)

// Volunteer tasks
export const getVolunteerTasks = (params = '') => api.get(`/volunteer-tasks${params}`)
export const claimVolunteerTask = (id) => api.patch(`/volunteer-tasks/${id}/assign`, {})
export const updateVolunteerTask = (id, payload) => api.put(`/volunteer-tasks/${id}`, payload)
