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

/**
 * PATCH /api/cart/items/:id
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    // Validate quantity is provided
    if (quantity === undefined || quantity === null) {
      res.status(400).json({
        error: 'Missing required field',
        code: 'MISSING_QUANTITY',
        message: 'quantity is required',
      });
      return;
    }

    // Validate quantity is a number
    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
      res.status(400).json({
        error: 'Invalid quantity',
        code: 'INVALID_QUANTITY',
        message: 'quantity must be an integer',
      });
      return;
    }

    // Get session ID
    const sessionId = req.session.id;

    // Call service
    const updatedItem = await cartService.updateCartItemQuantity(
      sessionId,
      cartItemId,
      quantity
    );

    // Return 200 with updated cart item
    res.status(200).json(updatedItem);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Cart item not found') {
        res.status(404).json({
          error: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND',
          message: 'The specified cart item does not exist',
        });
        return;
      }
      if (error.message.includes('Quantity must be between')) {
        res.status(400).json({
          error: 'Invalid quantity',
          code: 'INVALID_QUANTITY_RANGE',
          message: error.message,
        });
        return;
      }
    }
    next(error);
  }
}

/**
 * DELETE /api/cart/items/:id
 * Remove cart item
 */
export async function removeCartItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cartItemId = req.params.id;

    // Get session ID
    const sessionId = req.session.id;

    // Call service
    await cartService.removeCartItem(sessionId, cartItemId);

    // Return 200 with success message
    res.status(200).json({
      success: true,
      message: 'Cart item removed successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart item not found') {
      res.status(404).json({
        error: 'Cart item not found',
        code: 'CART_ITEM_NOT_FOUND',
        message: 'The specified cart item does not exist',
      });
      return;
    }
    next(error);
  }
}

/**
 * DELETE /api/cart
 * Clear entire cart
 */
export async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get session ID
    const sessionId = req.session.id;

    // Call service
    const result = await cartService.clearCart(sessionId);

    // Return 200 with deleted count
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
}
