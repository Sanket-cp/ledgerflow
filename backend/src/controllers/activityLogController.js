import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Private
export const getActivityLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const logs = await ActivityLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete activity log
// @route   DELETE /api/activity-logs/:id
// @access  Private
export const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!log) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    await log.deleteOne();
    
    res.json({ message: 'Activity log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all activity logs
// @route   DELETE /api/activity-logs
// @access  Private
export const clearActivityLogs = async (req, res) => {
  try {
    await ActivityLog.deleteMany({ userId: req.user._id });
    
    res.json({ message: 'All activity logs cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
