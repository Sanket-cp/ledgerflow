import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'Please provide SKU'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  buyPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  sellPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  minStock: {
    type: Number,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    default: 'piece',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
productSchema.index({ userId: 1, sku: 1 }, { unique: true });
productSchema.index({ userId: 1, name: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
