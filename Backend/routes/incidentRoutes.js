import { Router } from 'express'
import Incident from '../models/Incident.js'
import buildCrudController from '../controllers/crudFactory.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
const { getAll, getOne, createOne, updateOne, deleteOne } = buildCrudController(Incident, {
  populate: 'reportedBy assignedVolunteers',
  searchableFields: ['description', 'type'],
})

router
  .route('/')
  .get(protect, getAll)
  .post(protect, (req, res, next) => {
    // Auto-attach the reporter if not explicitly provided
    if (!req.body.reportedBy) req.body.reportedBy = req.user._id
    next()
  }, createOne)

router
  .route('/:id')
  .get(protect, getOne)
  .put(protect, authorize('admin', 'volunteer'), updateOne)
  .delete(protect, authorize('admin'), deleteOne)

export default router
