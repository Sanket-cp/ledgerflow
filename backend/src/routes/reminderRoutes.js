import express from 'express';
import {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  markReminderSent,
  getPendingReminders,
  generateDaily,
  cleanup,
} from '../controllers/reminderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.get('/pending/check', getPendingReminders);
router.post('/generate/daily', generateDaily);
router.delete('/cleanup', cleanup);

router.route('/:id')
  .get(getReminder)
  .put(updateReminder)
  .delete(deleteReminder);

router.patch('/:id/mark-sent', markReminderSent);

export default router;
