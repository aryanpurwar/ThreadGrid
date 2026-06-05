import express from 'express';
import {
  createProduct,
  getProductBySlug,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').put(protect, admin, updateProduct);
router.get('/slug/:slug', getProductBySlug);

export default router;
