import mongoose from 'mongoose'

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: {
      address: { type: String, required: true, trim: true },
      lat: Number,
      lng: Number,
    },
    capacity: { type: Number, required: true, default: 0 },
    occupancy: { type: Number, default: 0 },
    resourcesAvailable: [{ type: String }],
    contactPerson: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['open', 'full', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Shelter', shelterSchema)
