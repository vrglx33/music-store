/**
 * Song Service Tests
 * Focused tests for song service business logic
 */

import { songService } from '../songService';
import prisma from '../../config/database';

describe('SongService', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getSongById', () => {
    it('should retrieve song with album and artists', async () => {
      // Get any song from database for testing
      const anySong = await prisma.song.findFirst();
      if (!anySong) {
        console.log('No songs in database for testing, skipping test');
        return;
      }

      const result = await songService.getSongById(anySong.id);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('artists');
      expect(Array.isArray(result!.artists)).toBe(true);
    });

    it('should return null for non-existent song', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const result = await songService.getSongById(fakeId);

      expect(result).toBeNull();
    });

    it('should include album info when song has album', async () => {
      // Find a song that's part of an album
      const songWithAlbum = await prisma.song.findFirst({
        where: {
          albumId: {
            not: null,
          },
        },
      });

      if (!songWithAlbum) {
        console.log('No songs with albums found, skipping test');
        return;
      }

      const result = await songService.getSongById(songWithAlbum.id);

      expect(result).not.toBeNull();
      expect(result!.album).not.toBeNull();
      expect(result!.album).toHaveProperty('id');
      expect(result!.album).toHaveProperty('title');
    });

    it('should handle standalone singles without album', async () => {
      // Find a standalone single (no album)
      const standaloneSong = await prisma.song.findFirst({
        where: {
          albumId: null,
        },
      });

      if (!standaloneSong) {
        console.log('No standalone singles found, skipping test');
        return;
      }

      const result = await songService.getSongById(standaloneSong.id);

      expect(result).not.toBeNull();
      expect(result!.album).toBeNull();
    });
  });
});
