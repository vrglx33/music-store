/**
 * Cart Controller
 * HTTP request handlers for cart endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cartService';

/**
 * POST /api/cart/items
 * Add item to cart
 */
export async function addItemToCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemType, itemId } = req.body;

    // Validate required fields
    if (!itemType || !itemId) {
      res.status(400).json({
        error: 'Missing required fields',
        code: 'MISSING_FIELDS',
        message: 'itemType and itemId are required',
      });
      return;
    }

    // Validate item type
    if (!['album', 'song'].includes(itemType)) {
      res.status(400).json({
        error: 'Invalid item type',
        code: 'INVALID_ITEM_TYPE',
        message: 'itemType must be either "album" or "song"',
      });
      return;
    }

    // Get or create session ID
    const sessionId = req.session.id;

    // Call service
    const result = await cartService.addItemToCart(sessionId, itemType, itemId);

    // Return 201 Created
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(400).json({
        error: 'Invalid item',
        code: 'INVALID_CART_ITEM',
        message: error.message,
      });
      return;
    }
    next(error);
  }
}

/**
 * GET /api/cart
 * Get cart contents
 */
export async function getCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get session ID
    const sessionId = req.session.id;

    // Call service
    const cart = await cartService.getCart(sessionId);

    // Return cart
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}
