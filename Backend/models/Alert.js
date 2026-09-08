import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ['critical', 'warning', 'safe', 'info'],
      default: 'info',
    },
    area: { type: String, trim: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    active: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('Alert', alertSchema)
