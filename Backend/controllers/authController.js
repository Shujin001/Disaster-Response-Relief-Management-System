<<<<<<< HEAD
import crypto from 'crypto'
=======
>>>>>>> 93c33bf26d2a7b20a09be11ef6fc0a5d0068f4b8
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register a new user (citizen, volunteer, or admin)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, location, skills } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email, and password are required')
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    res.status(409)
    throw new Error('An account with this email already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    role: ['admin', 'citizen', 'volunteer'].includes(role) ? role : 'citizen',
    phone,
    location,
    skills,
  })

  res.status(201).json({
    success: true,
    data: user.toSafeObject(),
    token: generateToken(user._id),
  })
})

<<<<<<< HEAD
// @desc    Silently create (and log in as) an anonymous citizen account, so
//          citizens can use the app without ever filling out a login form.
//          The account is real (so incident reports/relief requests have a
//          consistent reportedBy) but requires no credentials from the person.
// @route   POST /api/auth/guest
// @access  Public
export const guestLogin = asyncHandler(async (req, res) => {
  const suffix = crypto.randomBytes(6).toString('hex')
  const user = await User.create({
    name: 'Guest Citizen',
    email: `guest-${suffix}@guest.local`,
    password: crypto.randomBytes(16).toString('hex'),
    role: 'citizen',
  })

  res.status(201).json({
    success: true,
    data: user.toSafeObject(),
    token: generateToken(user._id),
  })
})

=======
>>>>>>> 93c33bf26d2a7b20a09be11ef6fc0a5d0068f4b8
// @desc    Log in a user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.json({
    success: true,
    data: user.toSafeObject(),
    token: generateToken(user._id),
  })
})

// @desc    Get the logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toSafeObject() })
})
<<<<<<< HEAD

// @desc    Update the logged-in user's own profile (name, phone, location, skills)
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, location, skills, availability } = req.body

  if (name !== undefined) req.user.name = name
  if (phone !== undefined) req.user.phone = phone
  if (location !== undefined) req.user.location = location
  if (skills !== undefined) req.user.skills = skills
  if (availability !== undefined && req.user.role === 'volunteer') req.user.availability = availability

  await req.user.save()

  res.json({ success: true, data: req.user.toSafeObject() })
})
=======
>>>>>>> 93c33bf26d2a7b20a09be11ef6fc0a5d0068f4b8
