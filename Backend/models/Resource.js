import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['food', 'water', 'medical', 'shelter-supplies', 'clothing', 'equipment', 'other'],
      default: 'other',
    },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'units' },
    location: { type: String, trim: true },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' },
    status: {
      type: String,
      enum: ['available', 'low', 'depleted'],
      default: 'available',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Resource', resourceSchema)
