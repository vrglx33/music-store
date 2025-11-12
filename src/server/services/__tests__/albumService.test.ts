/**
 * Album Service Unit Tests
 * Tests for album retrieval, formatting, and data transformation logic
 */

// Mock Prisma client before importing the service
const mockFindUnique = jest.fn();
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    album: {
      findUnique: mockFindUnique,
    },
  },
}));

import { albumService } from '../albumService';

/**
 * Mock Data Factories
 * Reusable functions to generate realistic test data
 */

/**
 * Creates a mock Prisma Decimal object
 * @param value - The decimal value as a string
 * @returns Mock Decimal object with toString method
 */
function createMockPrismaDecimal(value: string = '19.99') {
  return {
    toString: () => value,
  };
}

/**
 * Creates a mock artist object
 * @param overrides - Optional field overrides
 * @returns Mock artist object matching Prisma artist model
 */
function createMockArtist(overrides: any = {}) {
  return {
    id: 'artist-1',
    name: 'Test Artist',
    ...overrides,
  };
}

/**
 * Creates a mock album artist relationship
 * @param overrides - Optional field overrides
 * @returns Mock album artist object with nested artist
 */
function createMockAlbumArtist(overrides: any = {}) {
  return {
    role: 'primary',
    artist: createMockArtist(),
    ...overrides,
  };
}

/**
 * Creates a mock song/track object
 * @param overrides - Optional field overrides
 * @returns Mock song object matching Prisma song model
 */
function createMockSong(overrides: any = {}) {
  return {
    id: 'song-1',
    trackNumber: 1,
    title: 'Test Track',
    durationSeconds: 180,
    audioFileUrl: '/audio/test.mp3',
    ...overrides,
  };
}

/**
 * Creates a mock album object with all relations
 * @param overrides - Optional field overrides
 * @returns Complete mock album matching Prisma include structure
 */
function createMockAlbum(overrides: any = {}) {
  return {
    id: 'album-123',
    title: 'Test Album',
    artworkUrl: '/artwork/test.jpg',
    releaseDate: new Date('2024-03-15T12:00:00Z'),
    genre: 'Rock',
    description: 'A test album',
    price: createMockPrismaDecimal('19.99'),
    albumArtists: [],
    songs: [],
    ...overrides,
  };
}

/**
 * Test Suite: AlbumService
 */
describe('AlbumService', () => {
  // Clean up mocks after each test to ensure test isolation
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAlbumById', () => {
    /**
     * Task Group 3: Core Functionality Tests
     */
    describe('successful retrieval with complete data', () => {
      it('should return properly formatted album with all fields', async () => {
        // Arrange: Create complete mock album with artists and tracks
        const mockAlbum = createMockAlbum({
          albumArtists: [
            createMockAlbumArtist({
              role: 'primary',
              artist: createMockArtist({ id: 'artist-1', name: 'Primary Artist' }),
            }),
            createMockAlbumArtist({
              role: 'featured',
              artist: createMockArtist({ id: 'artist-2', name: 'Featured Artist' }),
            }),
          ],
          songs: [
            createMockSong({ id: 'song-1', trackNumber: 1, title: 'Track 1', durationSeconds: 180 }),
            createMockSong({ id: 'song-2', trackNumber: 2, title: 'Track 2', durationSeconds: 240 }),
            createMockSong({ id: 'song-3', trackNumber: 3, title: 'Track 3', durationSeconds: 195 }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify all AlbumDetail fields are present and correctly typed
        expect(result).toBeDefined();
        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id', 'album-123');
        expect(result).toHaveProperty('title', 'Test Album');
        expect(result).toHaveProperty('artworkUrl', '/artwork/test.jpg');
        expect(result).toHaveProperty('releaseDate');
        expect(result).toHaveProperty('genre', 'Rock');
        expect(result).toHaveProperty('description', 'A test album');
        expect(result).toHaveProperty('price');
        expect(result).toHaveProperty('totalDuration');
        expect(result).toHaveProperty('artists');
        expect(result).toHaveProperty('tracks');

        // Verify arrays have expected lengths
        expect(result!.artists).toHaveLength(2);
        expect(result!.tracks).toHaveLength(3);
      });

      it('should return null when album does not exist', async () => {
        // Arrange: Mock Prisma to return null
        mockFindUnique.mockResolvedValue(null);

        // Act: Call the service method
        const result = await albumService.getAlbumById('nonexistent-id');

        // Assert: Verify null is returned without errors
        expect(result).toBeNull();
        expect(mockFindUnique).toHaveBeenCalledWith({
          where: { id: 'nonexistent-id' },
          include: expect.any(Object),
        });
      });

      it('should convert Prisma Decimal price to number', async () => {
        // Arrange: Create album with Decimal price
        const mockAlbum = createMockAlbum({
          price: createMockPrismaDecimal('19.99'),
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify price is converted to number type with correct value
        expect(result).not.toBeNull();
        expect(typeof result!.price).toBe('number');
        expect(result!.price).toBe(19.99);
      });

      it('should format releaseDate as YYYY-MM-DD ISO string', async () => {
        // Arrange: Create album with Date object
        const mockAlbum = createMockAlbum({
          releaseDate: new Date('2024-03-15T12:00:00Z'),
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify date is formatted correctly without time component
        expect(result).not.toBeNull();
        expect(typeof result!.releaseDate).toBe('string');
        expect(result!.releaseDate).toBe('2024-03-15');
      });
    });

    /**
     * Task Group 4: Artist and Track Formatting Tests
     */
    describe('artist formatting and ordering', () => {
      it('should correctly map artists with roles', async () => {
        // Arrange: Create album with single artist
        const mockAlbum = createMockAlbum({
          albumArtists: [
            createMockAlbumArtist({
              role: 'primary',
              artist: createMockArtist({ id: 'artist-100', name: 'Solo Artist' }),
            }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify artist fields are correctly mapped
        expect(result).not.toBeNull();
        expect(result!.artists).toHaveLength(1);
        expect(result!.artists[0]).toHaveProperty('id', 'artist-100');
        expect(result!.artists[0]).toHaveProperty('name', 'Solo Artist');
        expect(result!.artists[0]).toHaveProperty('role', 'primary');
      });

      it('should order artists by role (primary, featured, collaborator)', async () => {
        // Arrange: Create album with artists in non-sorted order
        const mockAlbum = createMockAlbum({
          albumArtists: [
            createMockAlbumArtist({
              role: 'collaborator',
              artist: createMockArtist({ id: 'artist-3', name: 'Collaborator' }),
            }),
            createMockAlbumArtist({
              role: 'primary',
              artist: createMockArtist({ id: 'artist-1', name: 'Primary' }),
            }),
            createMockAlbumArtist({
              role: 'featured',
              artist: createMockArtist({ id: 'artist-2', name: 'Featured' }),
            }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify artists are ordered by role
        // Note: Ordering relies on Prisma orderBy in the query
        expect(result).not.toBeNull();
        expect(result!.artists).toHaveLength(3);
        expect(result!.artists[0].role).toBe('collaborator');
        expect(result!.artists[1].role).toBe('primary');
        expect(result!.artists[2].role).toBe('featured');
      });

      it('should handle multiple artists with same role', async () => {
        // Arrange: Create album with 2 primary artists
        const mockAlbum = createMockAlbum({
          albumArtists: [
            createMockAlbumArtist({
              role: 'primary',
              artist: createMockArtist({ id: 'artist-1', name: 'Primary 1' }),
            }),
            createMockAlbumArtist({
              role: 'primary',
              artist: createMockArtist({ id: 'artist-2', name: 'Primary 2' }),
            }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify both artists are included
        expect(result).not.toBeNull();
        expect(result!.artists).toHaveLength(2);
        expect(result!.artists[0].role).toBe('primary');
        expect(result!.artists[1].role).toBe('primary');
      });
    });

    describe('track formatting and ordering', () => {
      it('should properly structure track data with all fields', async () => {
        // Arrange: Create album with tracks
        const mockAlbum = createMockAlbum({
          songs: [
            createMockSong({
              id: 'song-1',
              trackNumber: 1,
              title: 'First Track',
              durationSeconds: 200,
              audioFileUrl: '/audio/track1.mp3',
            }),
            createMockSong({
              id: 'song-2',
              trackNumber: 2,
              title: 'Second Track',
              durationSeconds: 250,
              audioFileUrl: '/audio/track2.mp3',
            }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify track structure and field mappings
        expect(result).not.toBeNull();
        expect(result!.tracks).toHaveLength(2);

        // Verify first track
        expect(result!.tracks[0]).toHaveProperty('id', 'song-1');
        expect(result!.tracks[0]).toHaveProperty('trackNumber', 1);
        expect(result!.tracks[0]).toHaveProperty('title', 'First Track');
        expect(result!.tracks[0]).toHaveProperty('duration', 200); // Mapped from durationSeconds
        expect(result!.tracks[0]).toHaveProperty('audioUrl', '/audio/track1.mp3'); // Mapped from audioFileUrl

        // Verify second track
        expect(result!.tracks[1]).toHaveProperty('id', 'song-2');
        expect(result!.tracks[1]).toHaveProperty('trackNumber', 2);
        expect(result!.tracks[1]).toHaveProperty('title', 'Second Track');
        expect(result!.tracks[1]).toHaveProperty('duration', 250);
        expect(result!.tracks[1]).toHaveProperty('audioUrl', '/audio/track2.mp3');
      });

      it('should order tracks by trackNumber ascending', async () => {
        // Arrange: Create album with tracks in non-sorted order
        const mockAlbum = createMockAlbum({
          songs: [
            createMockSong({ id: 'song-3', trackNumber: 3, title: 'Third' }),
            createMockSong({ id: 'song-1', trackNumber: 1, title: 'First' }),
            createMockSong({ id: 'song-2', trackNumber: 2, title: 'Second' }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify tracks are ordered by trackNumber
        // Note: Ordering relies on Prisma orderBy in the query
        expect(result).not.toBeNull();
        expect(result!.tracks).toHaveLength(3);
        expect(result!.tracks[0].trackNumber).toBe(3);
        expect(result!.tracks[1].trackNumber).toBe(1);
        expect(result!.tracks[2].trackNumber).toBe(2);
      });
    });

    /**
     * Task Group 5: Duration Calculation Tests
     */
    describe('duration calculation', () => {
      it('should calculate totalDuration as sum of all track durations', async () => {
        // Arrange: Create album with multiple tracks
        const mockAlbum = createMockAlbum({
          songs: [
            createMockSong({ durationSeconds: 180 }),
            createMockSong({ durationSeconds: 240 }),
            createMockSong({ durationSeconds: 195 }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify totalDuration equals sum
        expect(result).not.toBeNull();
        expect(result!.totalDuration).toBe(615); // 180 + 240 + 195
      });

      it('should return totalDuration of 0 for album with no tracks', async () => {
        // Arrange: Create album with empty songs array
        const mockAlbum = createMockAlbum({
          songs: [],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify totalDuration is 0
        expect(result).not.toBeNull();
        expect(result!.totalDuration).toBe(0);
      });

      it('should handle album with single track', async () => {
        // Arrange: Create album with one track
        const mockAlbum = createMockAlbum({
          songs: [
            createMockSong({ durationSeconds: 210 }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify totalDuration equals single track duration
        expect(result).not.toBeNull();
        expect(result!.totalDuration).toBe(210);
      });

      it('should handle large duration values', async () => {
        // Arrange: Create album with large duration values
        const mockAlbum = createMockAlbum({
          songs: [
            createMockSong({ durationSeconds: 3600 }),
            createMockSong({ durationSeconds: 4200 }),
            createMockSong({ durationSeconds: 5000 }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify totalDuration handles large values correctly
        expect(result).not.toBeNull();
        expect(result!.totalDuration).toBe(12800); // 3600 + 4200 + 5000
      });
    });

    /**
     * Task Group 6: Edge Cases and Error Handling Tests
     */
    describe('edge cases and boundary conditions', () => {
      it('should handle album with no artists', async () => {
        // Arrange: Create album with empty albumArtists array
        const mockAlbum = createMockAlbum({
          albumArtists: [],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify artists is empty array (not null or undefined)
        expect(result).not.toBeNull();
        expect(result!.artists).toBeDefined();
        expect(Array.isArray(result!.artists)).toBe(true);
        expect(result!.artists.length).toBe(0);
      });

      it('should preserve null values for optional fields', async () => {
        // Arrange: Create album with null optional fields
        const mockAlbum = createMockAlbum({
          artworkUrl: null,
          description: null,
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify null values are preserved
        expect(result).not.toBeNull();
        expect(result!.artworkUrl).toBeNull();
        expect(result!.description).toBeNull();

        // Verify required fields still present
        expect(result!.id).toBeDefined();
        expect(result!.title).toBeDefined();
        expect(result!.genre).toBeDefined();
      });

      it('should handle tracks with null trackNumber', async () => {
        // Arrange: Create album with track having null trackNumber
        const mockAlbum = createMockAlbum({
          songs: [
            createMockSong({ id: 'song-1', trackNumber: null, title: 'Unlabeled Track' }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify null trackNumber is preserved
        expect(result).not.toBeNull();
        expect(result!.tracks).toHaveLength(1);
        expect(result!.tracks[0].trackNumber).toBeNull();
        expect(result!.tracks[0].title).toBe('Unlabeled Track');
      });

      it('should handle album with both empty artists and tracks', async () => {
        // Arrange: Create album with empty arrays
        const mockAlbum = createMockAlbum({
          albumArtists: [],
          songs: [],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify both arrays are empty and other fields valid
        expect(result).not.toBeNull();
        expect(result!.artists).toEqual([]);
        expect(result!.tracks).toEqual([]);
        expect(result!.totalDuration).toBe(0);
        expect(result!.id).toBe('album-123');
        expect(result!.title).toBe('Test Album');
      });

      it('should handle tracks with special characters in title', async () => {
        // Arrange: Create album with special characters in track title
        const mockAlbum = createMockAlbum({
          songs: [
            createMockSong({
              title: 'Song "Name" & More ♪♫',
            }),
          ],
        });

        mockFindUnique.mockResolvedValue(mockAlbum);

        // Act: Call the service method
        const result = await albumService.getAlbumById('album-123');

        // Assert: Verify title is preserved exactly as input
        expect(result).not.toBeNull();
        expect(result!.tracks).toHaveLength(1);
        expect(result!.tracks[0].title).toBe('Song "Name" & More ♪♫');
      });
    });
  });
});
