import asyncHandler from 'express-async-handler'

// Builds standard REST handlers (list/get/create/update/delete) for a Mongoose model.
// `populate` is an optional string/array passed straight to .populate().
// `searchableFields` enables ?search= on those string fields.
export function buildCrudController(Model, { populate = '', searchableFields = [] } = {}) {
  const getAll = asyncHandler(async (req, res) => {
    const query = {}

    // Simple equality filters, e.g. ?status=critical&severity=warning
    for (const [key, value] of Object.entries(req.query)) {
      if (['search', 'page', 'limit', 'sort'].includes(key)) continue
      query[key] = value
    }

    if (req.query.search && searchableFields.length) {
      query.$or = searchableFields.map((field) => ({
        [field]: { $regex: req.query.search, $options: 'i' },
      }))
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 50
    const skip = (page - 1) * limit

    let dbQuery = Model.find(query).sort(req.query.sort || '-createdAt').skip(skip).limit(limit)
    if (populate) dbQuery = dbQuery.populate(populate)

    const [items, total] = await Promise.all([dbQuery, Model.countDocuments(query)])

    res.json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: items,
    })
  })

  const getOne = asyncHandler(async (req, res) => {
    let dbQuery = Model.findById(req.params.id)
    if (populate) dbQuery = dbQuery.populate(populate)
    const item = await dbQuery

    if (!item) {
      res.status(404)
      throw new Error('Resource not found')
    }

    res.json({ success: true, data: item })
  })

  const createOne = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body)
    res.status(201).json({ success: true, data: item })
  })

  const updateOne = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!item) {
      res.status(404)
      throw new Error('Resource not found')
    }

    res.json({ success: true, data: item })
  })

  const deleteOne = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id)

    if (!item) {
      res.status(404)
      throw new Error('Resource not found')
    }

    res.json({ success: true, data: {} })
  })

  return { getAll, getOne, createOne, updateOne, deleteOne }
}

export default buildCrudController
