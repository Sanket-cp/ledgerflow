import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  totalGiven: {
    type: Number,
    default: 0,
  },
  totalTaken: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  interestEnabled: {
    type: Boolean,
    default: false,
  },
  interestType: {
    type: String,
    enum: ['daily', 'monthly', 'yearly', 'none'],
    default: 'none',
  },
  interestRate: {
    type: Number,
    default: 0,
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  riskRating: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
customerSchema.index({ userId: 1, name: 1 });
customerSchema.index({ userId: 1, phone: 1 });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
