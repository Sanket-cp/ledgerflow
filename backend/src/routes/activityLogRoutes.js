import express from 'express';
import {
  getActivityLogs,
  deleteActivityLog,
  clearActivityLogs,
} from '../controllers/activityLogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getActivityLogs)
  .delete(clearActivityLogs);

router.delete('/:id', deleteActivityLog);

export default router;
