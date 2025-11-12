/**
 * Cart Service Unit Tests
 * Tests for cart management operations following TDD methodology
 */

// Mock Prisma client before importing the service
const mockFindFirst = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockDeleteMany = jest.fn();
const mockCount = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockFindMany = jest.fn();

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    cartItem: {
      findFirst: mockFindFirst,
      update: mockUpdate,
      delete: mockDelete,
      deleteMany: mockDeleteMany,
      count: mockCount,
      create: mockCreate,
      findMany: mockFindMany,
    },
    album: {
      findUnique: mockFindUnique,
    },
    song: {
      findUnique: mockFindUnique,
    },
  },
}));

import { cartService } from '../cartService';

/**
 * Mock Data Factories
 */
function createMockPrismaDecimal(value: string = '9.99') {
  return {
    toString: () => value,
  };
}

function createMockCartItem(overrides: any = {}) {
  return {
    id: 'cart-item-1',
    sessionId: 'session-123',
    itemType: 'album',
    itemId: 'album-1',
    albumId: 'album-1',
    songId: null,
    quantity: 1,
    priceAtAddition: createMockPrismaDecimal('9.99'),
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Test Suite: CartService
 */
describe('CartService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for updateCartItemQuantity method
   */
  describe('updateCartItemQuantity', () => {
    it('should successfully update quantity for existing cart item', async () => {
      // Arrange: Mock finding and updating cart item
      const mockCartItem = createMockCartItem({
        id: 'cart-item-1',
        sessionId: 'session-123',
        quantity: 2,
      });

      mockFindFirst.mockResolvedValue(mockCartItem);
      mockUpdate.mockResolvedValue({
        ...mockCartItem,
        quantity: 5,
      });

      // Act: Update quantity to 5
      const result = await cartService.updateCartItemQuantity(
        'session-123',
        'cart-item-1',
        5
      );

      // Assert: Verify cart item was updated correctly
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-item-1',
          sessionId: 'session-123',
        },
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'cart-item-1' },
        data: { quantity: 5 },
      });
      expect(result).toBeDefined();
      expect(result.quantity).toBe(5);
    });

    it('should enforce maximum quantity limit of 10', async () => {
      // Arrange: Mock cart item
      const mockCartItem = createMockCartItem();
      mockFindFirst.mockResolvedValue(mockCartItem);

      // Act & Assert: Attempt to set quantity to 15
      await expect(
        cartService.updateCartItemQuantity('session-123', 'cart-item-1', 15)
      ).rejects.toThrow('Quantity must be between 1 and 10');
    });

    it('should enforce minimum quantity limit of 1', async () => {
      // Arrange: Mock cart item
      const mockCartItem = createMockCartItem();
      mockFindFirst.mockResolvedValue(mockCartItem);

      // Act & Assert: Attempt to set quantity to 0
      await expect(
        cartService.updateCartItemQuantity('session-123', 'cart-item-1', 0)
      ).rejects.toThrow('Quantity must be between 1 and 10');
    });

    it('should throw error when cart item not found', async () => {
      // Arrange: Mock returning null (cart item doesn't exist)
      mockFindFirst.mockResolvedValue(null);

      // Act & Assert: Attempt to update non-existent cart item
      await expect(
        cartService.updateCartItemQuantity('session-123', 'nonexistent-id', 5)
      ).rejects.toThrow('Cart item not found');
    });
  });

  /**
   * Tests for removeCartItem method
   */
  describe('removeCartItem', () => {
    it('should successfully remove cart item from database', async () => {
      // Arrange: Mock finding and deleting cart item
      const mockCartItem = createMockCartItem({
        id: 'cart-item-1',
        sessionId: 'session-123',
      });

      mockFindFirst.mockResolvedValue(mockCartItem);
      mockDelete.mockResolvedValue(mockCartItem);

      // Act: Remove cart item
      await cartService.removeCartItem('session-123', 'cart-item-1');

      // Assert: Verify cart item was found and deleted
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-item-1',
          sessionId: 'session-123',
        },
      });
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 'cart-item-1' },
      });
    });

    it('should throw error when cart item not found', async () => {
      // Arrange: Mock returning null (cart item doesn't exist)
      mockFindFirst.mockResolvedValue(null);

      // Act & Assert: Attempt to remove non-existent cart item
      await expect(
        cartService.removeCartItem('session-123', 'nonexistent-id')
      ).rejects.toThrow('Cart item not found');
    });
  });

  /**
   * Tests for clearCart method
   */
  describe('clearCart', () => {
    it('should delete all cart items for given session ID', async () => {
      // Arrange: Mock deleting multiple items
      mockDeleteMany.mockResolvedValue({ count: 3 });

      // Act: Clear cart for session
      const result = await cartService.clearCart('session-123');

      // Assert: Verify all items deleted for session
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { sessionId: 'session-123' },
      });
      expect(result).toEqual({ deletedCount: 3 });
    });

    it('should return success with count 0 when cart is already empty', async () => {
      // Arrange: Mock deleting 0 items
      mockDeleteMany.mockResolvedValue({ count: 0 });

      // Act: Clear already empty cart
      const result = await cartService.clearCart('session-123');

      // Assert: Verify returns 0 count without error
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { sessionId: 'session-123' },
      });
      expect(result).toEqual({ deletedCount: 0 });
    });

    it('should not affect other sessions cart items', async () => {
      // Arrange: Mock deleting items only for specific session
      mockDeleteMany.mockResolvedValue({ count: 2 });

      // Act: Clear cart for session-123
      await cartService.clearCart('session-123');

      // Assert: Verify only specified session's items are targeted
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { sessionId: 'session-123' },
      });
      // In real implementation, this would be verified by checking
      // that other sessions' data remains intact
    });
  });
});
