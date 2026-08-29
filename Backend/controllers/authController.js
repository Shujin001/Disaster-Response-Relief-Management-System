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
