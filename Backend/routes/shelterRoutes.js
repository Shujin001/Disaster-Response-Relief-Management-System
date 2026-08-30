import { Router } from 'express'
import Shelter from '../models/Shelter.js'
import buildCrudController from '../controllers/crudFactory.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
const { getAll, getOne, createOne, updateOne, deleteOne } = buildCrudController(Shelter, {
  searchableFields: ['name'],
})

router.route('/').get(protect, getAll).post(protect, authorize('admin'), createOne)

router
  .route('/:id')
  .get(protect, getOne)
  .put(protect, authorize('admin', 'volunteer'), updateOne)
  .delete(protect, authorize('admin'), deleteOne)

export default router
