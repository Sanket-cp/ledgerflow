import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['payment_due', 'interest_due', 'custom'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  schedule: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly'],
    default: 'once',
  },
  channel: {
    type: String,
    enum: ['browser', 'sms', 'whatsapp', 'email'],
    default: 'browser',
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastSent: {
    type: Date,
  },
  nextDue: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for faster queries
reminderSchema.index({ userId: 1, dueDate: 1 });
reminderSchema.index({ userId: 1, status: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
