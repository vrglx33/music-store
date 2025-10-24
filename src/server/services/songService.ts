/**
 * Song Service
 * Business logic for song retrieval and management
 */

import prisma from '../config/database';

// Service Types
export interface SongArtistInfo {
  id: string;
  name: string;
  role: string;
}

export interface SongAlbumInfo {
  id: string;
  title: string;
  artworkUrl: string | null;
}

export interface SongDetail {
  id: string;
  title: string;
  trackNumber: number | null;
  duration: number;
  audioUrl: string;
  releaseDate: string;
  genre: string;
  description: string | null;
  lyrics: string | null;
  price: number;
  album: SongAlbumInfo | null;
  artists: SongArtistInfo[];
}

/**
 * Song Service
 */
class SongService {
  /**
   * Get song by ID with complete details
   */
  async getSongById(id: string): Promise<SongDetail | null> {
    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        album: {
          select: {
            id: true,
            title: true,
            artworkUrl: true,
          },
        },
        songArtists: {
          include: {
            artist: true,
          },
          orderBy: {
            role: 'asc', // primary first, then featured, then producer, songwriter
          },
        },
      },
    });

    if (!song) {
      return null;
    }

    return this.formatSongDetail(song);
  }

  /**
   * Format song with complete metadata
   */
  private formatSongDetail(song: any): SongDetail {
    // Format artists with roles
    const artists: SongArtistInfo[] = song.songArtists.map((sa: any) => ({
      id: sa.artist.id,
      name: sa.artist.name,
      role: sa.role,
    }));

    // Format album info (may be null for standalone singles)
    const album: SongAlbumInfo | null = song.album
      ? {
          id: song.album.id,
          title: song.album.title,
          artworkUrl: song.album.artworkUrl,
        }
      : null;

    return {
      id: song.id,
      title: song.title,
      trackNumber: song.trackNumber,
      duration: song.durationSeconds,
      audioUrl: song.audioFileUrl,
      releaseDate: song.releaseDate.toISOString().split('T')[0],
      genre: song.genre,
      description: song.description,
      lyrics: song.lyrics,
      price: parseFloat(song.price.toString()),
      album,
      artists,
    };
  }
}

// Export singleton instance
export const songService = new SongService();
