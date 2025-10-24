/**
 * Application route constants
 */

// API Routes
export const API_ROUTES = {
  CATALOG: '/api/catalog',
  ALBUMS: '/api/albums',
  SONGS: '/api/songs',
  CART: '/api/cart',
  CART_ITEMS: '/api/cart/items',
} as const;

// Page Routes
export const PAGE_ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  ALBUM_DETAIL: (id: string) => `/albums/${id}`,
  SONG_DETAIL: (id: string) => `/songs/${id}`,
  NOT_FOUND: '/404',
} as const;

// Static File Routes
export const STATIC_ROUTES = {
  AUDIO: '/uploads/audio',
  ARTWORK: '/uploads/artwork',
} as const;
