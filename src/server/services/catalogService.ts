/**
 * Catalog Service
 * Business logic for catalog browsing and retrieval
 */

import prisma from '../config/database';

// Service Types
export interface CatalogParams {
  page: number;
  limit: number;
  sort: 'newest' | 'artist' | 'title';
  type: 'all' | 'albums' | 'songs';
}

export interface CatalogItem {
  id: string;
  type: 'album' | 'song';
  title: string;
  artworkUrl: string | null;
  artist: {
    id: string;
    name: string;
  };
  releaseDate: string;
  genre: string;
  price: number;
  duration: number;
}

export interface CatalogResponse {
  items: CatalogItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Catalog Service
 */
class CatalogService {
  /**
   * Get paginated and sorted catalog
   */
  async getCatalog(params: CatalogParams): Promise<CatalogResponse> {
    const { page, limit, sort, type } = params;
    const skip = (page - 1) * limit;

    // Build sort criteria
    const albumOrderBy = this.buildAlbumSort(sort);
    const songOrderBy = this.buildSongSort(sort);

    // Fetch albums and songs based on type filter
    let albums: any[] = [];
    let songs: any[] = [];

    if (type === 'all' || type === 'albums') {
      albums = await prisma.album.findMany({
        include: {
          albumArtists: {
            where: { role: 'primary' },
            include: { artist: true },
            take: 1,
          },
        },
        orderBy: albumOrderBy,
      });
    }

    if (type === 'all' || type === 'songs') {
      songs = await prisma.song.findMany({
        include: {
          album: true,
          songArtists: {
            where: { role: 'primary' },
            include: { artist: true },
            take: 1,
          },
        },
        orderBy: songOrderBy,
      });
    }

    // Format and combine items
    const formattedAlbums = albums.map((album) =>
      this.formatAlbumForCatalog(album)
    );
    const formattedSongs = songs.map((song) => this.formatSongForCatalog(song));

    // Combine and sort all items
    let allItems = [...formattedAlbums, ...formattedSongs];
    allItems = this.sortCombinedItems(allItems, sort);

    // Apply pagination
    const totalItems = allItems.length;
    const paginatedItems = allItems.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Build sort criteria for albums
   */
  private buildAlbumSort(sort: string): any {
    switch (sort) {
      case 'artist':
        return [{ albumArtists: { _count: 'desc' } }, { title: 'asc' }];
      case 'title':
        return { title: 'asc' };
      case 'newest':
      default:
        return { releaseDate: 'desc' };
    }
  }

  /**
   * Build sort criteria for songs
   */
  private buildSongSort(sort: string): any {
    switch (sort) {
      case 'artist':
        return [{ songArtists: { _count: 'desc' } }, { title: 'asc' }];
      case 'title':
        return { title: 'asc' };
      case 'newest':
      default:
        return { releaseDate: 'desc' };
    }
  }

  /**
   * Sort combined items array
   */
  private sortCombinedItems(items: CatalogItem[], sort: string): CatalogItem[] {
    switch (sort) {
      case 'artist':
        return items.sort((a, b) => {
          const nameCompare = a.artist.name.localeCompare(b.artist.name);
          return nameCompare !== 0
            ? nameCompare
            : a.title.localeCompare(b.title);
        });
      case 'title':
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
      default:
        return items.sort((a, b) => {
          return (
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
          );
        });
    }
  }

  /**
   * Format album data for catalog display
   */
  private formatAlbumForCatalog(album: any): CatalogItem {
    const primaryArtist = album.albumArtists[0]?.artist || {
      id: 'unknown',
      name: 'Unknown Artist',
    };

    return {
      id: album.id,
      type: 'album',
      title: album.title,
      artworkUrl: album.artworkUrl,
      artist: {
        id: primaryArtist.id,
        name: primaryArtist.name,
      },
      releaseDate: album.releaseDate.toISOString().split('T')[0],
      genre: album.genre,
      price: parseFloat(album.price.toString()),
      duration: album.totalDurationSeconds,
    };
  }

  /**
   * Format song data for catalog display
   */
  private formatSongForCatalog(song: any): CatalogItem {
    const primaryArtist = song.songArtists[0]?.artist || {
      id: 'unknown',
      name: 'Unknown Artist',
    };

    // Use album artwork if available, otherwise null
    const artworkUrl = song.album?.artworkUrl || null;

    return {
      id: song.id,
      type: 'song',
      title: song.title,
      artworkUrl,
      artist: {
        id: primaryArtist.id,
        name: primaryArtist.name,
      },
      releaseDate: song.releaseDate.toISOString().split('T')[0],
      genre: song.genre,
      price: parseFloat(song.price.toString()),
      duration: song.durationSeconds,
    };
  }
}

// Export singleton instance
export const catalogService = new CatalogService();
