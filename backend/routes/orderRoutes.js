import express from 'express';
import {
  createCheckoutSession,
  getMyOrders,
  getOrderBySession
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/checkout', createCheckoutSession);
router.get('/by-session/:sessionId', getOrderBySession);
router.get('/my-orders', protect, getMyOrders);

export default router;
