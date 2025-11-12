/**
 * useCart Hook Tests
 * Tests for cart management hook following TDD methodology
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCart } from '../useCart';

// Mock fetch globally
global.fetch = jest.fn();

describe('useCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('updateQuantity', () => {
    it('should successfully update quantity and return updated cart', async () => {
      // Arrange: Mock successful PATCH response
      const mockUpdatedItem = {
        id: 'cart-item-1',
        itemType: 'album',
        itemId: 'album-1',
        quantity: 5,
        priceAtAddition: 9.99,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedItem,
      });

      // Act: Render hook and call updateQuantity
      const { result } = renderHook(() => useCart());

      let success = false;
      await act(async () => {
        success = await result.current.updateQuantity('cart-item-1', 5);
      });

      // Assert: Verify request was made and success returned
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cart/items/cart-item-1',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: 5 }),
          credentials: 'include',
        })
      );
      expect(success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle API error gracefully with error state', async () => {
      // Arrange: Mock error response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Invalid quantity',
          code: 'INVALID_QUANTITY_RANGE',
          message: 'Quantity must be between 1 and 10',
        }),
      });

      // Act: Render hook and call updateQuantity
      const { result } = renderHook(() => useCart());

      let success = true;
      await act(async () => {
        success = await result.current.updateQuantity('cart-item-1', 15);
      });

      // Assert: Verify error handling
      expect(success).toBe(false);
      expect(result.current.error).toBeTruthy();
    });

    it('should update loading state during operation', async () => {
      // Arrange: Mock delayed response
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ id: 'cart-item-1', quantity: 3 }),
                }),
              50
            )
          )
      );

      // Act: Render hook
      const { result } = renderHook(() => useCart());

      // Assert: Initial state
      expect(result.current.isLoading).toBe(false);

      // Act: Call updateQuantity
      act(() => {
        result.current.updateQuantity('cart-item-1', 3);
      });

      // Assert: Loading state should be true during operation
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Assert: Loading state should return to false after completion
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 200 }
      );
    });
  });

  describe('removeItem', () => {
    it('should successfully remove item and update cart count', async () => {
      // Arrange: Mock successful DELETE response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Cart item removed successfully',
        }),
      });

      // Act: Render hook and call removeItem
      const { result } = renderHook(() => useCart());

      let success = false;
      await act(async () => {
        success = await result.current.removeItem('cart-item-1');
      });

      // Assert: Verify request was made and success returned
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cart/items/cart-item-1',
        expect.objectContaining({
          method: 'DELETE',
          credentials: 'include',
        })
      );
      expect(success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle API error and maintain cart state', async () => {
      // Arrange: Mock error response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND',
          message: 'The specified cart item does not exist',
        }),
      });

      // Act: Render hook and call removeItem
      const { result } = renderHook(() => useCart());

      let success = true;
      await act(async () => {
        success = await result.current.removeItem('invalid-id');
      });

      // Assert: Verify error handling
      expect(success).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('clearCart', () => {
    it('should successfully clear all items and set cart count to 0', async () => {
      // Arrange: Mock successful DELETE response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Cart cleared successfully',
          deletedCount: 3,
        }),
      });

      // Act: Render hook and call clearCart
      const { result } = renderHook(() => useCart());

      let success = false;
      await act(async () => {
        success = await result.current.clearCart();
      });

      // Assert: Verify request was made and cart count reset
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cart',
        expect.objectContaining({
          method: 'DELETE',
          credentials: 'include',
        })
      );
      expect(success).toBe(true);
      expect(result.current.cartCount).toBe(0);
      expect(result.current.error).toBeNull();
    });

    it('should handle API error gracefully', async () => {
      // Arrange: Mock error response
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      // Act: Render hook and call clearCart
      const { result } = renderHook(() => useCart());

      let success = true;
      await act(async () => {
        success = await result.current.clearCart();
      });

      // Assert: Verify error handling
      expect(success).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });
});
