/**
 * Cart Service Tests
 * Focused tests for cart service business logic
 */

import { cartService } from '../cartService';
import prisma from '../../config/database';

describe('CartService', () => {
  const testSessionId = `test-session-${Date.now()}-${Math.random()}`;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up test cart items
    await prisma.cartItem.deleteMany({
      where: { sessionId: testSessionId },
    });
    await prisma.$disconnect();
  });

  describe('addItemToCart', () => {
    it('should add album to cart', async () => {
      // Get any album from database for testing
      const anyAlbum = await prisma.album.findFirst();
      if (!anyAlbum) {
        throw new Error('No albums in database for testing');
      }

      const result = await cartService.addItemToCart(
        testSessionId,
        'album',
        anyAlbum.id
      );

      expect(result).toHaveProperty('cartItem');
      expect(result).toHaveProperty('cartCount');
      expect(result.cartItem.itemType).toBe('album');
      expect(result.cartItem.itemId).toBe(anyAlbum.id);
      expect(result.cartCount).toBeGreaterThan(0);
    });

    it('should add song to cart', async () => {
      // Get any song from database for testing
      const anySong = await prisma.song.findFirst();
      if (!anySong) {
        throw new Error('No songs in database for testing');
      }

      const result = await cartService.addItemToCart(
        testSessionId,
        'song',
        anySong.id
      );

      expect(result).toHaveProperty('cartItem');
      expect(result).toHaveProperty('cartCount');
      expect(result.cartItem.itemType).toBe('song');
      expect(result.cartItem.itemId).toBe(anySong.id);
      expect(result.cartCount).toBeGreaterThan(0);
    });
  });

  describe('getCart', () => {
    it('should retrieve cart contents', async () => {
      const result = await cartService.getCart(testSessionId);

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('totalItems');
      expect(result).toHaveProperty('subtotal');
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.totalItems).toBeGreaterThanOrEqual(0);
    });

    it('should calculate correct totals', async () => {
      const result = await cartService.getCart(testSessionId);

      // Calculate expected subtotal
      const expectedSubtotal = result.items.reduce(
        (sum, item) =>
          sum + parseFloat(item.priceAtAddition.toString()) * item.quantity,
        0
      );

      expect(result.subtotal).toBeCloseTo(expectedSubtotal, 2);
      expect(result.totalItems).toBe(result.items.length);
    });
  });
});
