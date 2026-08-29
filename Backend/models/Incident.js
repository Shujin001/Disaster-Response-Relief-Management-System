import mongoose from 'mongoose'

const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'flood',
        'earthquake',
        'landslide',
        'fire',
        'storm',
        'medical',
        'relief-request',
        'missing-person',
        'other',
      ],
    },
    description: { type: String, trim: true },
    location: {
      address: { type: String, required: true, trim: true },
      lat: Number,
      lng: Number,
    },
    severity: {
      type: String,
      enum: ['critical', 'warning', 'safe', 'info'],
      default: 'warning',
    },
    status: {
      type: String,
      enum: ['reported', 'verified', 'in-progress', 'resolved'],
      default: 'reported',
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    peopleAffected: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
)

incidentSchema.index({ status: 1, severity: 1 })

export default mongoose.model('Incident', incidentSchema)
