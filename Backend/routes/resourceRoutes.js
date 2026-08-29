import { Router } from 'express'
import Resource from '../models/Resource.js'
import buildCrudController from '../controllers/crudFactory.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
const { getAll, getOne, createOne, updateOne, deleteOne } = buildCrudController(Resource, {
  populate: 'shelter',
  searchableFields: ['name', 'category'],
})

router
  .route('/')
  .get(protect, getAll)
  .post(protect, authorize('admin', 'volunteer'), createOne)

router
  .route('/:id')
  .get(protect, getOne)
  .put(protect, authorize('admin', 'volunteer'), updateOne)
  .delete(protect, authorize('admin'), deleteOne)

export default router
