import { Router } from 'express'
import Alert from '../models/Alert.js'
import buildCrudController from '../controllers/crudFactory.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
const { getAll, getOne, createOne, updateOne, deleteOne } = buildCrudController(Alert, {
  populate: 'issuedBy',
  searchableFields: ['title', 'message', 'area'],
})

router
  .route('/')
  .get(protect, getAll)
  .post(protect, authorize('admin'), (req, res, next) => {
    if (!req.body.issuedBy) req.body.issuedBy = req.user._id
    next()
  }, createOne)

router
  .route('/:id')
  .get(protect, getOne)
  .put(protect, authorize('admin'), updateOne)
  .delete(protect, authorize('admin'), deleteOne)

export default router
