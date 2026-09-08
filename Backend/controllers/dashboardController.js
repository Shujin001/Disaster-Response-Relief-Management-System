import asyncHandler from 'express-async-handler'
import Incident from '../models/Incident.js'
import Alert from '../models/Alert.js'
import Shelter from '../models/Shelter.js'
import Resource from '../models/Resource.js'
import VolunteerTask from '../models/VolunteerTask.js'
import User from '../models/User.js'

// @desc    Aggregate stats for the Government/Admin dashboard
// @route   GET /api/dashboard/government
// @access  Private (admin)
export const governmentStats = asyncHandler(async (req, res) => {
  const [
    totalIncidents,
    criticalIncidents,
    activeAlerts,
    shelters,
    volunteers,
    recentIncidents,
  ] = await Promise.all([
    Incident.countDocuments(),
    Incident.countDocuments({ severity: 'critical', status: { $ne: 'resolved' } }),
    Alert.countDocuments({ active: true }),
    Shelter.find().select('name capacity occupancy status'),
    User.countDocuments({ role: 'volunteer', status: 'active' }),
    Incident.find().sort('-createdAt').limit(10).populate('reportedBy', 'name role'),
  ])

  const shelterOccupancy = shelters.reduce(
    (acc, s) => {
      acc.capacity += s.capacity
      acc.occupancy += s.occupancy
      return acc
    },
    { capacity: 0, occupancy: 0 }
  )

  res.json({
    success: true,
    data: {
      totalIncidents,
      criticalIncidents,
      activeAlerts,
      activeVolunteers: volunteers,
      shelters: {
        count: shelters.length,
        ...shelterOccupancy,
      },
      recentIncidents,
    },
  })
})

// @desc    Aggregate stats for the Citizen dashboard
// @route   GET /api/dashboard/citizen
// @access  Private
export const citizenStats = asyncHandler(async (req, res) => {
  const [activeAlerts, nearbyIncidents, myReports, openShelters] = await Promise.all([
    Alert.find({ active: true }).sort('-createdAt').limit(10),
    Incident.find({ status: { $ne: 'resolved' } }).sort('-createdAt').limit(20),
    Incident.find({ reportedBy: req.user._id }).sort('-createdAt'),
    Shelter.find({ status: 'open' }).select('name location capacity occupancy'),
  ])

  res.json({
    success: true,
    data: { activeAlerts, nearbyIncidents, myReports, openShelters },
  })
})

// @desc    Aggregate stats for the Volunteer dashboard
// @route   GET /api/dashboard/volunteer
// @access  Private (volunteer)
export const volunteerStats = asyncHandler(async (req, res) => {
  const [myTasks, openTasks, resources, activeIncidents] = await Promise.all([
    VolunteerTask.find({ assignedTo: req.user._id }).sort('-createdAt').populate('incident'),
    VolunteerTask.find({ status: 'open' }).sort('-createdAt').limit(20),
    Resource.find().select('name category quantity unit status'),
    Incident.find({ status: { $in: ['reported', 'verified', 'in-progress'] } }).sort(
      '-createdAt'
    ),
  ])

  res.json({
    success: true,
    data: { myTasks, openTasks, resources, activeIncidents },
  })
})
