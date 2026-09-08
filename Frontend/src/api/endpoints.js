import api from './client'

// Dashboard aggregate endpoints
export const getGovernmentDashboard = () => api.get('/dashboard/government')
export const getCitizenDashboard = () => api.get('/dashboard/citizen')
export const getVolunteerDashboard = () => api.get('/dashboard/volunteer')

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
// Profile
export const updateProfile = (payload) => api.put('/auth/me', payload)

// Guest (citizen, no credentials) session
export const guestLoginRequest = () => api.post('/auth/guest', {}, { auth: false })

<<<<<<< HEAD
// Users (admin only)
export const getUsers = (params = '') => api.get(`/auth/users${params}`)
export const updateUserStatus = (id, status) => api.patch(`/auth/users/${id}/status`, { status })

=======
=======
>>>>>>> 93c33bf26d2a7b20a09be11ef6fc0a5d0068f4b8
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
// Incidents
export const getIncidents = (params = '') => api.get(`/incidents${params}`)
export const createIncident = (payload) => api.post('/incidents', payload)
export const updateIncident = (id, payload) => api.put(`/incidents/${id}`, payload)

// Alerts
export const getAlerts = (params = '') => api.get(`/alerts${params}`)
export const createAlert = (payload) => api.post('/alerts', payload)

// Shelters
export const getShelters = (params = '') => api.get(`/shelters${params}`)
<<<<<<< HEAD
export const createShelter = (payload) => api.post('/shelters', payload)
export const updateShelter = (id, payload) => api.put(`/shelters/${id}`, payload)

// Resources (supplies/inventory)
export const getResources = (params = '') => api.get(`/resources${params}`)
export const createResource = (payload) => api.post('/resources', payload)
export const updateResource = (id, payload) => api.put(`/resources/${id}`, payload)

// Volunteer tasks
export const getVolunteerTasks = (params = '') => api.get(`/volunteer-tasks${params}`)
export const getVolunteerTask = (id) => api.get(`/volunteer-tasks/${id}`)
export const createVolunteerTask = (payload) => api.post('/volunteer-tasks', payload)
=======

// Resources (supplies/inventory)
export const getResources = (params = '') => api.get(`/resources${params}`)

// Volunteer tasks
export const getVolunteerTasks = (params = '') => api.get(`/volunteer-tasks${params}`)
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
export const claimVolunteerTask = (id) => api.patch(`/volunteer-tasks/${id}/assign`, {})
export const updateVolunteerTask = (id, payload) => api.put(`/volunteer-tasks/${id}`, payload)
