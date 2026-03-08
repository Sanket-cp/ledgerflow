import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
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
    enum: ['given', 'taken'],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: 0,
  },
  purpose: {
    type: String,
    trim: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'upi', 'online'],
    default: 'cash',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attachment: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
transactionSchema.index({ userId: 1, customerId: 1 });
transactionSchema.index({ userId: 1, date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
