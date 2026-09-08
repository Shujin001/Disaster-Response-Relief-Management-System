import mongoose from 'mongoose'

const volunteerTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    location: { type: String, trim: true },
    priority: {
      type: String,
      enum: ['critical', 'warning', 'safe', 'info'],
      default: 'info',
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in-progress', 'completed'],
      default: 'open',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: Date,
  },
  { timestamps: true }
)

export default mongoose.model('VolunteerTask', volunteerTaskSchema)
