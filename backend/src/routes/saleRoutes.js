import express from 'express';
import {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
} from '../controllers/saleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSale)
  .put(updateSale)
  .delete(deleteSale);

export default router;
