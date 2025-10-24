/**
 * Cart Routes
 * Routes for cart management endpoints
 */

import { Router } from 'express';
import * as cartController from '../../controllers/cartController';

const router = Router();

// POST /api/cart/items - Add item to cart
router.post('/items', cartController.addItemToCart);

// GET /api/cart - Get cart contents
router.get('/', cartController.getCart);

export default router;
