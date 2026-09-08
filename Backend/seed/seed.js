import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'

import User from '../models/User.js'
import Incident from '../models/Incident.js'
import Alert from '../models/Alert.js'
import Shelter from '../models/Shelter.js'
import Resource from '../models/Resource.js'
import VolunteerTask from '../models/VolunteerTask.js'

async function run() {
  await connectDB()

  const destroy = process.argv.includes('--destroy')

  if (destroy) {
    await Promise.all([
      User.deleteMany(),
      Incident.deleteMany(),
      Alert.deleteMany(),
      Shelter.deleteMany(),
      Resource.deleteMany(),
      VolunteerTask.deleteMany(),
    ])
    console.log('All collections cleared.')
    await mongoose.disconnect()
    process.exit(0)
  }

  // Clear existing data first so the seed is idempotent
  await Promise.all([
    User.deleteMany(),
    Incident.deleteMany(),
    Alert.deleteMany(),
    Shelter.deleteMany(),
    Resource.deleteMany(),
    VolunteerTask.deleteMany(),
  ])

  // --- Users (one per role, plus a few extra citizens/volunteers) ---
  const admin = await User.create({
    name: 'Suresh Karki',
    email: 'admin@ndrm.gov.np',
    password: 'password123',
    role: 'admin',
    phone: '+977-9800000001',
    location: { address: 'Ministry of Home Affairs, Kathmandu', lat: 27.7000, lng: 85.3333 },
  })

  const citizen = await User.create({
    name: 'Anita Shrestha',
    email: 'citizen@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '+977-9800000002',
    location: { address: 'Baneshwor, Kathmandu', lat: 27.6939, lng: 85.3336 },
  })

  const volunteer = await User.create({
    name: 'Bikash Thapa',
    email: 'volunteer@example.com',
    password: 'password123',
    role: 'volunteer',
    phone: '+977-9800000003',
    location: { address: 'Patan, Lalitpur', lat: 27.6730, lng: 85.3250 },
    skills: ['first-aid', 'search-and-rescue', 'logistics'],
    availability: 'available',
  })

  const volunteer2 = await User.create({
    name: 'Sunita Gurung',
    email: 'sunita.volunteer@example.com',
    password: 'password123',
    role: 'volunteer',
    phone: '+977-9800000004',
    location: { address: 'Bhaktapur', lat: 27.6710, lng: 85.4298 },
    skills: ['medical', 'translation'],
    availability: 'busy',
  })

  const citizen2 = await User.create({
    name: 'Ramesh Adhikari',
    email: 'ramesh.citizen@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '+977-9800000005',
    location: { address: 'Chabahil, Kathmandu', lat: 27.7167, lng: 85.3500 },
  })

  console.log('Users seeded.')

  // --- Shelters ---
  const shelters = await Shelter.insertMany([
    {
      name: 'Tundikhel Emergency Camp',
      location: { address: 'Tundikhel, Kathmandu', lat: 27.6997, lng: 85.3160 },
      capacity: 500,
      occupancy: 412,
      resourcesAvailable: ['food', 'water', 'medical', 'blankets'],
      contactPerson: 'Gopal Rana',
      contactPhone: '+977-9811111111',
      status: 'open',
    },
    {
      name: 'Bhaktapur Durbar Square Relief Center',
      location: { address: 'Bhaktapur Durbar Square', lat: 27.6710, lng: 85.4298 },
      capacity: 250,
      occupancy: 250,
      resourcesAvailable: ['food', 'water'],
      contactPerson: 'Maya Shakya',
      contactPhone: '+977-9822222222',
      status: 'full',
    },
    {
      name: 'Lalitpur Community Hall',
      location: { address: 'Pulchowk, Lalitpur', lat: 27.6780, lng: 85.3170 },
      capacity: 300,
      occupancy: 90,
      resourcesAvailable: ['food', 'water', 'medical', 'clothing'],
      contactPerson: 'Hari Bahadur',
      contactPhone: '+977-9833333333',
      status: 'open',
    },
  ])

  console.log('Shelters seeded.')

  // --- Resources ---
  await Resource.insertMany([
    { name: 'Rice sacks (25kg)', category: 'food', quantity: 340, unit: 'sacks', location: 'Tundikhel Emergency Camp', shelter: shelters[0]._id, status: 'available' },
    { name: 'Bottled drinking water', category: 'water', quantity: 60, unit: 'crates', location: 'Tundikhel Emergency Camp', shelter: shelters[0]._id, status: 'low' },
    { name: 'First-aid kits', category: 'medical', quantity: 15, unit: 'kits', location: 'Lalitpur Community Hall', shelter: shelters[2]._id, status: 'low' },
    { name: 'Tarpaulin sheets', category: 'shelter-supplies', quantity: 0, unit: 'sheets', location: 'Bhaktapur Durbar Square Relief Center', shelter: shelters[1]._id, status: 'depleted' },
    { name: 'Winter blankets', category: 'clothing', quantity: 220, unit: 'pieces', location: 'Lalitpur Community Hall', shelter: shelters[2]._id, status: 'available' },
    { name: 'Water purification tablets', category: 'water', quantity: 500, unit: 'strips', location: 'Central Warehouse, Kathmandu', status: 'available' },
    { name: 'Generators (portable)', category: 'equipment', quantity: 4, unit: 'units', location: 'Central Warehouse, Kathmandu', status: 'low' },
  ])

  console.log('Resources seeded.')

  // --- Incidents ---
  const incidents = await Incident.insertMany([
    {
      type: 'flood',
      description: 'Bagmati river overflow flooding low-lying settlements near the riverbank.',
      location: { address: 'Sinamangal, Kathmandu', lat: 27.6989, lng: 85.3592 },
      severity: 'critical',
      status: 'in-progress',
      reportedBy: citizen._id,
      assignedVolunteers: [volunteer._id],
      peopleAffected: 180,
    },
    {
      type: 'landslide',
      description: 'Landslide blocking the Prithvi Highway after continuous rainfall.',
      location: { address: 'Prithvi Highway, near Mugling', lat: 27.8500, lng: 84.5500 },
      severity: 'critical',
      status: 'verified',
      reportedBy: citizen2._id,
      assignedVolunteers: [],
      peopleAffected: 25,
    },
    {
      type: 'earthquake',
      description: 'Minor structural damage reported to two residential buildings after a 4.2M tremor.',
      location: { address: 'Gongabu, Kathmandu', lat: 27.7360, lng: 85.3240 },
      severity: 'warning',
      status: 'reported',
      reportedBy: citizen._id,
      assignedVolunteers: [],
      peopleAffected: 12,
    },
    {
      type: 'fire',
      description: 'Market fire contained; assessing damage to nearby stalls.',
      location: { address: 'Asan Bazaar, Kathmandu', lat: 27.7060, lng: 85.3110 },
      severity: 'warning',
      status: 'in-progress',
      reportedBy: citizen2._id,
      assignedVolunteers: [volunteer2._id],
      peopleAffected: 8,
    },
    {
      type: 'medical',
      description: 'Cluster of waterborne illness cases reported at Tundikhel camp, needs medical team.',
      location: { address: 'Tundikhel Emergency Camp, Kathmandu', lat: 27.6997, lng: 85.3160 },
      severity: 'warning',
      status: 'verified',
      reportedBy: volunteer._id,
      assignedVolunteers: [volunteer2._id],
      peopleAffected: 34,
    },
    {
      type: 'storm',
      description: 'High winds reported, downed power lines cleared, area now safe.',
      location: { address: 'Boudha, Kathmandu', lat: 27.7215, lng: 85.3616 },
      severity: 'safe',
      status: 'resolved',
      reportedBy: citizen._id,
      assignedVolunteers: [volunteer._id],
      peopleAffected: 0,
    },
    {
      type: 'relief-request',
      description: 'Items needed: Drinking water, blankets, dry food for 6 households displaced by flooding.',
      location: { address: 'Sinamangal, Kathmandu', lat: 27.6989, lng: 85.3592 },
      severity: 'warning',
      status: 'reported',
      reportedBy: citizen2._id,
      assignedVolunteers: [],
      peopleAffected: 24,
    },
    {
      type: 'missing-person',
      description: 'Missing person: Kabita Lama. Last seen near the riverbank before the flooding started, wearing a red jacket.',
      location: { address: 'Sinamangal, Kathmandu', lat: 27.6970, lng: 85.3580 },
      severity: 'critical',
      status: 'reported',
      reportedBy: citizen._id,
      assignedVolunteers: [],
      peopleAffected: 1,
    },
  ])

  console.log('Incidents seeded.')

  // --- Alerts ---
  await Alert.insertMany([
    {
      title: 'Flood Warning: Bagmati River Basin',
      message: 'Water levels rising rapidly. Residents in low-lying areas near Sinamangal and Thapathali should evacuate to higher ground immediately.',
      severity: 'critical',
      area: 'Kathmandu Valley — Bagmati Basin',
      issuedBy: admin._id,
      active: true,
    },
    {
      title: 'Highway Closure: Prithvi Highway',
      message: 'Landslide debris has closed the highway near Mugling. Use the alternate route via Malekhu until cleared.',
      severity: 'warning',
      area: 'Prithvi Highway',
      issuedBy: admin._id,
      active: true,
    },
    {
      title: 'Aftershock Advisory',
      message: 'Minor aftershocks possible over the next 48 hours. Avoid re-entering visibly damaged structures.',
      severity: 'info',
      area: 'Kathmandu Valley',
      issuedBy: admin._id,
      active: true,
    },
    {
      title: 'Boudha Storm Cleared',
      message: 'Downed power lines in Boudha have been cleared. Area is now safe.',
      severity: 'safe',
      area: 'Boudha, Kathmandu',
      issuedBy: admin._id,
      active: false,
    },
  ])

  console.log('Alerts seeded.')

  // --- Volunteer tasks ---
  await VolunteerTask.insertMany([
    {
      title: 'Evacuate residents near Sinamangal riverbank',
      description: 'Coordinate boat/vehicle evacuation for households closest to the water.',
      incident: incidents[0]._id,
      location: 'Sinamangal, Kathmandu',
      priority: 'critical',
      status: 'assigned',
      assignedTo: volunteer._id,
    },
    {
      title: 'Assess landslide-blocked highway',
      description: 'Survey the blockage extent and report to the highway department.',
      incident: incidents[1]._id,
      location: 'Prithvi Highway, near Mugling',
      priority: 'critical',
      status: 'open',
    },
    {
      title: 'Distribute first-aid kits at Lalitpur Community Hall',
      description: 'Stock is low — deliver from central warehouse and restock the medical tent.',
      location: 'Lalitpur Community Hall',
      priority: 'warning',
      status: 'open',
    },
    {
      title: 'Run medical triage at Tundikhel camp',
      description: 'Waterborne illness cluster — set up a triage station and log cases.',
      incident: incidents[4]._id,
      location: 'Tundikhel Emergency Camp',
      priority: 'warning',
      status: 'in-progress',
      assignedTo: volunteer2._id,
    },
    {
      title: 'Restock tarpaulin sheets at Bhaktapur relief center',
      description: 'Shelter is at full capacity and out of tarpaulin sheets.',
      location: 'Bhaktapur Durbar Square Relief Center',
      priority: 'warning',
      status: 'open',
    },
  ])

  console.log('Volunteer tasks seeded.')

  console.log('\nSeed complete. Sample login credentials (password: "password123"):')
  console.log(`  Admin:     ${admin.email}`)
  console.log(`  Citizen:   ${citizen.email}`)
  console.log(`  Volunteer: ${volunteer.email}`)

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
