/**
 * Album Service Tests
 * Focused tests for album service business logic
 */

import { albumService } from '../albumService';
import prisma from '../../config/database';

describe('AlbumService', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getAlbumById', () => {
    it('should retrieve album with tracks and artists', async () => {
      // Get any album from database for testing
      const anyAlbum = await prisma.album.findFirst();
      if (!anyAlbum) {
        console.log('No albums in database for testing, skipping test');
        return;
      }

      const result = await albumService.getAlbumById(anyAlbum.id);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('artists');
      expect(result).toHaveProperty('tracks');
      expect(Array.isArray(result!.artists)).toBe(true);
      expect(Array.isArray(result!.tracks)).toBe(true);
    });

    it('should return null for non-existent album', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const result = await albumService.getAlbumById(fakeId);

      expect(result).toBeNull();
    });

    it('should order tracks by track number', async () => {
      // Get an album with multiple tracks
      const albumWithTracks = await prisma.album.findFirst({
        include: { songs: true },
        where: {
          songs: {
            some: {},
          },
        },
      });

      if (!albumWithTracks) {
        console.log('No albums with tracks found, skipping test');
        return;
      }

      const result = await albumService.getAlbumById(albumWithTracks.id);

      if (result && result.tracks.length > 1) {
        const trackNumbers = result.tracks.map((t) => t.trackNumber);
        const isSorted = trackNumbers.every(
          (num, i) => i === 0 || trackNumbers[i - 1]! <= num!
        );
        expect(isSorted).toBe(true);
      }
    });

    it('should calculate totalDuration as the sum of track durations', async () => {
      const albumWithTracks = await prisma.album.findFirst({
        include: { songs: true },
        where: {
          songs: {
            some: {},
          },
        },
      });

      if (!albumWithTracks) {
        console.log('No albums with tracks found, skipping totalDuration test');
        return;
      }

      const result = await albumService.getAlbumById(albumWithTracks.id);

      if (!result || result.tracks.length === 0) {
        console.log('Album has no tracks in result, skipping totalDuration test');
        return;
      }

      const expectedTotal = result.tracks.reduce(
        (sum, track) => sum + track.duration,
        0
      );

      expect(result.totalDuration).toBe(expectedTotal);
    });
  });
});
