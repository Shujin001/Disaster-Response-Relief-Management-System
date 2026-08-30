import { Router } from 'express'
<<<<<<< HEAD
import { register, login, guestLogin, getMe, updateMe } from '../controllers/authController.js'
=======
import { register, login, getMe } from '../controllers/authController.js'
>>>>>>> 93c33bf26d2a7b20a09be11ef6fc0a5d0068f4b8
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
<<<<<<< HEAD
router.post('/guest', guestLogin)
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)
=======
router.get('/me', protect, getMe)
>>>>>>> 93c33bf26d2a7b20a09be11ef6fc0a5d0068f4b8

export default router
