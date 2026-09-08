import { Router } from 'express'

import {
  register,
  login,
  guestLogin,
  getMe,
  updateMe,
  listUsers,
  updateUserStatus,
} from '../controllers/authController.js'
import { protect, authorize } from '../middleware/auth.js'
import { register, login, guestLogin, getMe, updateMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/guest', guestLogin)
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)
router.get('/users', protect, authorize('admin'), listUsers)
router.patch('/users/:id/status', protect, authorize('admin'), updateUserStatus)
router.post('/guest', guestLogin)
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)

export default router
