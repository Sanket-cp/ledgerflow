import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    default: 'Admin',
  },
}, {
  timestamps: true,
});

// Index for faster queries
activityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
