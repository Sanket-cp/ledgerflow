import Customer from '../models/Customer.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper function to log activity
const logActivity = async (userId, action, details) => {
  await ActivityLog.create({ userId, action, details, user: 'Admin' });
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      userId: req.user._id,
      balance: req.body.openingBalance || 0,
    });

    await logActivity(req.user._id, 'Customer Added', `New customer ${customer.name} added`);
    
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    Object.assign(customer, req.body);
    await customer.save();

    await logActivity(req.user._id, 'Customer Updated', `Customer ${customer.name} updated`);
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.deleteOne();

    await logActivity(req.user._id, 'Customer Deleted', `Customer ${customer.name} deleted`);
    
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle customer status
// @route   PATCH /api/customers/:id/toggle-status
// @access  Private
export const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    await logActivity(
      req.user._id,
      'Customer Status Changed',
      `${customer.name} ${customer.isActive ? 'enabled' : 'disabled'}`
    );
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
