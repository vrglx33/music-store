/**
 * API response type definitions
 */

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface CatalogItem {
  id: string;
  type: 'album' | 'song';
  title: string;
  artworkUrl?: string;
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
  pagination: PaginationMeta;
}

export interface ApiError {
  error: string;
  code: string;
}
