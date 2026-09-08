import { Router } from 'express'
import { governmentStats, citizenStats, volunteerStats } from '../controllers/dashboardController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/government', protect, authorize('admin'), governmentStats)
router.get('/citizen', protect, citizenStats)
router.get('/volunteer', protect, authorize('volunteer', 'admin'), volunteerStats)

export default router
