/**
 * Catalog Service Tests
 * Focused tests for catalog service business logic
 */

import { catalogService } from '../catalogService';
import prisma from '../../config/database';

describe('CatalogService', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getCatalog', () => {
    it('should retrieve paginated catalog items', async () => {
      const result = await catalogService.getCatalog({
        page: 1,
        limit: 10,
        sort: 'newest',
        type: 'all',
      });

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items.length).toBeLessThanOrEqual(10);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.itemsPerPage).toBe(10);
    });

    it('should sort by newest first (descending release date)', async () => {
      const result = await catalogService.getCatalog({
        page: 1,
        limit: 5,
        sort: 'newest',
        type: 'all',
      });

      if (result.items.length > 1) {
        const dates = result.items.map((item) =>
          new Date(item.releaseDate).getTime()
        );
        const isSorted = dates.every(
          (date, i) => i === 0 || dates[i - 1] >= date
        );
        expect(isSorted).toBe(true);
      }
    });

    it('should filter by type (albums only)', async () => {
      const result = await catalogService.getCatalog({
        page: 1,
        limit: 10,
        sort: 'newest',
        type: 'albums',
      });

      expect(result.items.every((item) => item.type === 'album')).toBe(true);
    });

    it('should filter by type (songs only)', async () => {
      const result = await catalogService.getCatalog({
        page: 1,
        limit: 10,
        sort: 'newest',
        type: 'songs',
      });

      expect(result.items.every((item) => item.type === 'song')).toBe(true);
    });
  });
});
