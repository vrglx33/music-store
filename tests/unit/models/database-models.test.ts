/**
 * Database Model Tests
 * Tests for Prisma models and relationships
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cleanup function to run after each test
afterEach(async () => {
  // Delete in reverse order of dependencies
  await prisma.cartItem.deleteMany();
  await prisma.songArtist.deleteMany();
  await prisma.albumArtist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
});

// Close Prisma connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Database Models', () => {
  describe('Artist Model', () => {
    test('should create artist and enforce uniqueness constraint on name', async () => {
      // Create first artist
      const artist1 = await prisma.artist.create({
        data: {
          name: 'Test Artist',
          bio: 'Test bio',
        },
      });

      expect(artist1.id).toBeDefined();
      expect(artist1.name).toBe('Test Artist');
      expect(artist1.createdAt).toBeInstanceOf(Date);
      expect(artist1.updatedAt).toBeInstanceOf(Date);

      // Attempt to create duplicate artist should fail
      await expect(
        prisma.artist.create({
          data: {
            name: 'Test Artist',
            bio: 'Different bio',
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('Album-Artist Relationship', () => {
    test('should create album with artist relationship', async () => {
      // Create artist
      const artist = await prisma.artist.create({
        data: { name: 'Album Test Artist' },
      });

      // Create album
      const album = await prisma.album.create({
        data: {
          title: 'Test Album',
          releaseDate: new Date('2024-01-01'),
          genre: 'Rock',
          price: 9.99,
        },
      });

      // Create album-artist relationship
      await prisma.albumArtist.create({
        data: {
          albumId: album.id,
          artistId: artist.id,
          role: 'primary',
        },
      });

      // Query album with artists
      const albumWithArtists = await prisma.album.findUnique({
        where: { id: album.id },
        include: {
          albumArtists: {
            include: {
              artist: true,
            },
          },
        },
      });

      expect(albumWithArtists).toBeDefined();
      expect(albumWithArtists?.albumArtists).toHaveLength(1);
      expect(albumWithArtists?.albumArtists[0].artist.name).toBe(
        'Album Test Artist'
      );
      expect(albumWithArtists?.albumArtists[0].role).toBe('primary');
    });
  });

  describe('Song-Album Relationship', () => {
    test('should create song with optional album relationship', async () => {
      // Test 1: Song without album (single)
      const standaloneSong = await prisma.song.create({
        data: {
          title: 'Standalone Single',
          durationSeconds: 180,
          audioFileUrl: '/uploads/audio/test.mp3',
          genre: 'Pop',
          releaseDate: new Date('2024-01-01'),
          price: 0.99,
        },
      });

      expect(standaloneSong.albumId).toBeNull();

      // Test 2: Song with album
      const album = await prisma.album.create({
        data: {
          title: 'Song Test Album',
          releaseDate: new Date('2024-01-01'),
          genre: 'Rock',
        },
      });

      const albumSong = await prisma.song.create({
        data: {
          title: 'Album Track',
          albumId: album.id,
          trackNumber: 1,
          durationSeconds: 200,
          audioFileUrl: '/uploads/audio/track1.mp3',
          genre: 'Rock',
          releaseDate: new Date('2024-01-01'),
          price: 0.99,
        },
      });

      expect(albumSong.albumId).toBe(album.id);
      expect(albumSong.trackNumber).toBe(1);

      // Query album with songs
      const albumWithSongs = await prisma.album.findUnique({
        where: { id: album.id },
        include: { songs: true },
      });

      expect(albumWithSongs?.songs).toHaveLength(1);
      expect(albumWithSongs?.songs[0].title).toBe('Album Track');
    });
  });

  describe('Cart Item with Session', () => {
    test('should create cart item with session management', async () => {
      // Create album
      const album = await prisma.album.create({
        data: {
          title: 'Cart Test Album',
          releaseDate: new Date('2024-01-01'),
          genre: 'Jazz',
          price: 12.99,
        },
      });

      // Create cart item for album
      const sessionId = 'test-session-123';
      const cartItem = await prisma.cartItem.create({
        data: {
          sessionId,
          itemType: 'album',
          itemId: album.id,
          albumId: album.id,
          quantity: 1,
          priceAtAddition: 12.99,
        },
      });

      expect(cartItem.sessionId).toBe(sessionId);
      expect(cartItem.itemType).toBe('album');
      expect(cartItem.quantity).toBe(1);
      expect(cartItem.priceAtAddition.toNumber()).toBe(12.99);

      // Query cart items by session
      const cartItems = await prisma.cartItem.findMany({
        where: { sessionId },
        include: { album: true },
      });

      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].album?.title).toBe('Cart Test Album');
    });
  });
});
