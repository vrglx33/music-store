/**
 * Album Service
 * Business logic for album retrieval and management
 */

import prisma from '../config/database';

// Service Types
export interface AlbumArtistInfo {
  id: string;
  name: string;
  role: string;
}

export interface AlbumTrack {
  id: string;
  trackNumber: number | null;
  title: string;
  duration: number;
  audioUrl: string;
}

export interface AlbumDetail {
  id: string;
  title: string;
  artworkUrl: string | null;
  releaseDate: string;
  genre: string;
  description: string | null;
  price: number;
  totalDuration: number;
  artists: AlbumArtistInfo[];
  tracks: AlbumTrack[];
}

/**
 * Album Service
 */
class AlbumService {
  /**
   * Get album by ID with complete details
   */
  async getAlbumById(id: string): Promise<AlbumDetail | null> {
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        albumArtists: {
          include: {
            artist: true,
          },
          orderBy: {
            role: 'asc', // primary first, then featured, then collaborator
          },
        },
        songs: {
          orderBy: {
            trackNumber: 'asc',
          },
        },
      },
    });

    if (!album) {
      return null;
    }

    return this.formatAlbumDetail(album);
  }

  /**
   * Format album with complete metadata
   */
  private formatAlbumDetail(album: any): AlbumDetail {
    // Format artists with roles
    const artists: AlbumArtistInfo[] = album.albumArtists.map((aa: any) => ({
      id: aa.artist.id,
      name: aa.artist.name,
      role: aa.role,
    }));

    // Format tracks
    const tracks: AlbumTrack[] = album.songs.map((song: any) => ({
      id: song.id,
      trackNumber: song.trackNumber,
      title: song.title,
      duration: song.durationSeconds,
      audioUrl: song.audioFileUrl,
    }));

    // Calculate total duration from tracks
    const totalDuration = tracks.reduce(
      (sum, track) => sum + track.duration,
      0
    );

    return {
      id: album.id,
      title: album.title,
      artworkUrl: album.artworkUrl,
      releaseDate: album.releaseDate.toISOString().split('T')[0],
      genre: album.genre,
      description: album.description,
      price: parseFloat(album.price.toString()),
      totalDuration,
      artists,
      tracks,
    };
  }
}

// Export singleton instance
export const albumService = new AlbumService();
