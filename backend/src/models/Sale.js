import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['sale', 'expense', 'purchase'],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'upi', 'online'],
    default: 'cash',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    min: 0,
  },
}, {
  timestamps: true,
});

// Index for faster queries
saleSchema.index({ userId: 1, date: -1 });
saleSchema.index({ userId: 1, category: 1 });

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;
