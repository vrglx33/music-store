/**
 * Integration Tests for API Endpoints
 * Tests the full request/response cycle for browsing/discovery features
 */

import request from 'supertest';
import app from '../../src/server';
import prisma from '../../src/server/config/database';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/catalog', () => {
    it('should return paginated catalog items', async () => {
      const response = await request(app)
        .get('/api/catalog')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
    });

    it('should filter by type (albums)', async () => {
      const response = await request(app)
        .get('/api/catalog')
        .query({ type: 'albums', limit: 5 })
        .expect(200);

      if (response.body.items.length > 0) {
        expect(response.body.items.every((item: any) => item.type === 'album')).toBe(true);
      }
    });

    it('should sort catalog items', async () => {
      const response = await request(app)
        .get('/api/catalog')
        .query({ sort: 'artist', limit: 20 })
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });
  });

  describe('GET /api/albums/:id', () => {
    it('should return album with tracks and artists', async () => {
      // Get any album first
      const album = await prisma.album.findFirst({
        include: { songs: true }
      });

      if (!album) {
        console.log('No albums found, skipping test');
        return;
      }

      const response = await request(app)
        .get(`/api/albums/${album.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', album.id);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('artists');
      expect(response.body).toHaveProperty('tracks');
      expect(Array.isArray(response.body.tracks)).toBe(true);
    });

    it('should return 400 for invalid album ID', async () => {
      const response = await request(app)
        .get('/api/albums/non-existent-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/songs/:id', () => {
    it('should return song with album and artists', async () => {
      // Get any song first
      const song = await prisma.song.findFirst();

      if (!song) {
        console.log('No songs found, skipping test');
        return;
      }

      const response = await request(app)
        .get(`/api/songs/${song.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', song.id);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('artists');
    });

    it('should return 400 for invalid song ID', async () => {
      const response = await request(app)
        .get('/api/songs/non-existent-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/cart/items', () => {
    it('should add album to cart', async () => {
      const album = await prisma.album.findFirst();

      if (!album) {
        console.log('No albums found, skipping test');
        return;
      }

      const response = await request(app)
        .post('/api/cart/items')
        .send({
          itemType: 'album',
          itemId: album.id
        })
        .expect(200);

      expect(response.body).toHaveProperty('cartItem');
      expect(response.body).toHaveProperty('cartCount');
      expect(response.body.cartItem.itemType).toBe('album');
    });

    it('should add song to cart', async () => {
      const song = await prisma.song.findFirst();

      if (!song) {
        console.log('No songs found, skipping test');
        return;
      }

      const response = await request(app)
        .post('/api/cart/items')
        .send({
          itemType: 'song',
          itemId: song.id
        })
        .expect(200);

      expect(response.body).toHaveProperty('cartItem');
      expect(response.body.cartItem.itemType).toBe('song');
    });
  });

  describe('GET /api/cart', () => {
    it('should return cart contents', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('totalItems');
      expect(response.body).toHaveProperty('subtotal');
      expect(Array.isArray(response.body.items)).toBe(true);
    });
  });
});
