import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper function to log activity
const logActivity = async (userId, action, details) => {
  await ActivityLog.create({ userId, action, details, user: 'Admin' });
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .populate('productId', 'name sku');
    
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('productId', 'name sku');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create sale
// @route   POST /api/sales
// @access  Private
export const createSale = async (req, res) => {
  try {
    const sale = await Sale.create({
      ...req.body,
      userId: req.user._id,
    });

    // Update product stock if applicable
    if (sale.productId && sale.quantity) {
      const product = await Product.findOne({ _id: sale.productId, userId: req.user._id });
      if (product) {
        const stockChange = sale.category === 'purchase' ? sale.quantity : -sale.quantity;
        product.stock += stockChange;
        await product.save();
      }
    }

    await logActivity(
      req.user._id,
      'Sale Entry',
      `${sale.category} - ₹${sale.amount.toLocaleString('en-IN')}`
    );
    
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private
export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Revert old stock change if applicable
    if (sale.productId && sale.quantity) {
      const product = await Product.findOne({ _id: sale.productId, userId: req.user._id });
      if (product) {
        const stockChange = sale.category === 'purchase' ? -sale.quantity : sale.quantity;
        product.stock += stockChange;
        await product.save();
      }
    }

    Object.assign(sale, req.body);
    await sale.save();

    // Apply new stock change if applicable
    if (sale.productId && sale.quantity) {
      const product = await Product.findOne({ _id: sale.productId, userId: req.user._id });
      if (product) {
        const stockChange = sale.category === 'purchase' ? sale.quantity : -sale.quantity;
        product.stock += stockChange;
        await product.save();
      }
    }

    await logActivity(req.user._id, 'Sale Updated', `Sale entry updated`);
    
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Revert stock change if applicable
    if (sale.productId && sale.quantity) {
      const product = await Product.findOne({ _id: sale.productId, userId: req.user._id });
      if (product) {
        const stockChange = sale.category === 'purchase' ? -sale.quantity : sale.quantity;
        product.stock += stockChange;
        await product.save();
      }
    }

    await sale.deleteOne();

    await logActivity(req.user._id, 'Sale Deleted', `Sale entry deleted`);
    
    res.json({ message: 'Sale removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
