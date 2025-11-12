/**
 * Cart Routes
 * Routes for cart management endpoints
 */

import { Router } from 'express';
import * as cartController from '../../controllers/cartController';

const router = Router();

// POST /api/cart/items - Add item to cart
router.post('/items', cartController.addItemToCart);

// PATCH /api/cart/items/:id - Update cart item quantity
router.patch('/items/:id', cartController.updateCartItemQuantity);

// DELETE /api/cart/items/:id - Remove cart item
router.delete('/items/:id', cartController.removeCartItem);

// GET /api/cart - Get cart contents
router.get('/', cartController.getCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', cartController.clearCart);

export default router;
