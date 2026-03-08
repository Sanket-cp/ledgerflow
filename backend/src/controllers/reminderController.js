import Reminder from '../models/Reminder.js';
import ActivityLog from '../models/ActivityLog.js';
import { generateDailyReminders, generateInterestReminders, cleanupOldReminders } from '../services/reminderService.js';

// Helper function to log activity
const logActivity = async (userId, action, details) => {
  await ActivityLog.create({ userId, action, details, user: 'Admin' });
};

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req, res) => {
  try {
    const { status, customerId } = req.query;
    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;

    const reminders = await Reminder.find(query)
      .sort({ dueDate: 1, createdAt: -1 })
      .populate('customerId', 'name phone');
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
export const getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    }).populate('customerId', 'name phone');
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create({
      ...req.body,
      userId: req.user._id,
      nextDue: req.body.dueDate,
    });

    await logActivity(
      req.user._id,
      'Reminder Created',
      `Reminder set for ${reminder.customerName} - ${reminder.title}`
    );
    
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    Object.assign(reminder, req.body);
    await reminder.save();

    await logActivity(req.user._id, 'Reminder Updated', `Reminder updated for ${reminder.customerName}`);
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    await reminder.deleteOne();

    await logActivity(req.user._id, 'Reminder Deleted', `Reminder deleted for ${reminder.customerName}`);
    
    res.json({ message: 'Reminder removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark reminder as sent
// @route   PATCH /api/reminders/:id/mark-sent
// @access  Private
export const markReminderSent = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.status = 'sent';
    reminder.lastSent = new Date();
    
    // Calculate next due date for recurring reminders
    if (reminder.schedule !== 'once') {
      const nextDue = new Date(reminder.dueDate);
      switch (reminder.schedule) {
        case 'daily':
          nextDue.setDate(nextDue.getDate() + 1);
          break;
        case 'weekly':
          nextDue.setDate(nextDue.getDate() + 7);
          break;
        case 'monthly':
          nextDue.setMonth(nextDue.getMonth() + 1);
          break;
      }
      reminder.dueDate = nextDue;
      reminder.nextDue = nextDue;
      reminder.status = 'pending'; // Reset to pending for next occurrence
    } else {
      // For one-time reminders, mark as inactive after sending
      reminder.isActive = false;
    }
    
    await reminder.save();

    await logActivity(
      req.user._id,
      'Reminder Sent',
      `Reminder sent to ${reminder.customerName} via ${reminder.channel}`
    );
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending reminders (for notifications)
// @route   GET /api/reminders/pending/check
// @access  Private
export const getPendingReminders = async (req, res) => {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      userId: req.user._id,
      status: 'pending',
      isActive: true,
      dueDate: { $lte: now },
    })
      .sort({ dueDate: 1 })
      .populate('customerId', 'name phone');
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate automatic daily reminders
// @route   POST /api/reminders/generate/daily
// @access  Private
export const generateDaily = async (req, res) => {
  try {
    const paymentReminders = await generateDailyReminders(req.user._id);
    const interestReminders = await generateInterestReminders(req.user._id);
    
    res.json({
      message: 'Daily reminders generated successfully',
      paymentReminders: paymentReminders.length,
      interestReminders: interestReminders.length,
      total: paymentReminders.length + interestReminders.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cleanup old reminders
// @route   DELETE /api/reminders/cleanup
// @access  Private
export const cleanup = async (req, res) => {
  try {
    const deletedCount = await cleanupOldReminders(req.user._id);
    
    res.json({
      message: 'Old reminders cleaned up',
      deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
