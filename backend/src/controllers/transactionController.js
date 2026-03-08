import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper function to log activity
const logActivity = async (userId, action, details) => {
  await ActivityLog.create({ userId, action, details, user: 'Admin' });
};

// Helper function to update customer balance
const updateCustomerBalance = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) return;

  const transactions = await Transaction.find({ customerId });
  
  let totalGiven = 0;
  let totalTaken = 0;
  
  transactions.forEach(tx => {
    if (tx.type === 'given') totalGiven += tx.amount;
    if (tx.type === 'taken') totalTaken += tx.amount;
  });

  customer.totalGiven = totalGiven;
  customer.totalTaken = totalTaken;
  customer.balance = customer.openingBalance + totalGiven - totalTaken;
  
  await customer.save();
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { customerId } = req.query;
    const query = { userId: req.user._id };
    
    if (customerId) {
      query.customerId = customerId;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate('customerId', 'name phone');
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    }).populate('customerId', 'name phone');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user._id,
    });

    // Update customer balance
    await updateCustomerBalance(transaction.customerId);

    await logActivity(
      req.user._id,
      'Transaction Added',
      `₹${transaction.amount.toLocaleString('en-IN')} ${transaction.type} ${transaction.type === 'given' ? 'to' : 'from'} ${transaction.customerName}`
    );
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const oldCustomerId = transaction.customerId;
    
    Object.assign(transaction, req.body);
    await transaction.save();

    // Update customer balance for both old and new customer if changed
    await updateCustomerBalance(oldCustomerId);
    if (req.body.customerId && req.body.customerId !== oldCustomerId.toString()) {
      await updateCustomerBalance(req.body.customerId);
    }

    await logActivity(req.user._id, 'Transaction Updated', `Transaction updated`);
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const customerId = transaction.customerId;
    await transaction.deleteOne();

    // Update customer balance
    await updateCustomerBalance(customerId);

    await logActivity(
      req.user._id,
      'Transaction Deleted',
      `₹${transaction.amount.toLocaleString('en-IN')} ${transaction.type} entry for ${transaction.customerName} deleted`
    );
    
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
