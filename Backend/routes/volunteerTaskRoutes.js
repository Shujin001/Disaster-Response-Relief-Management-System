import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import VolunteerTask from '../models/VolunteerTask.js'
import buildCrudController from '../controllers/crudFactory.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
const { getAll, getOne, createOne, updateOne, deleteOne } = buildCrudController(VolunteerTask, {
  populate: 'incident assignedTo',
  searchableFields: ['title', 'description', 'location'],
})

// @desc  Volunteer claims/self-assigns an open task
// @route PATCH /api/volunteer-tasks/:id/assign
router.patch(
  '/:id/assign',
  protect,
  authorize('volunteer', 'admin'),
  asyncHandler(async (req, res) => {
    const task = await VolunteerTask.findById(req.params.id)
    if (!task) {
      res.status(404)
      throw new Error('Task not found')
    }

    task.assignedTo = req.body.userId || req.user._id
    task.status = 'assigned'
    await task.save()

    res.json({ success: true, data: task })
  })
)

router
  .route('/')
  .get(protect, getAll)
  .post(protect, authorize('admin'), createOne)

router
  .route('/:id')
  .get(protect, getOne)
  .put(protect, authorize('admin', 'volunteer'), updateOne)
  .delete(protect, authorize('admin'), deleteOne)

export default router
