/**
 * Cart type definitions
 */

export enum ItemType {
  ALBUM = 'album',
  SONG = 'song',
}

export interface CartItem {
  id: string;
  itemType: ItemType;
  itemId: string;
  quantity: number;
  priceAtAddition: number;
  createdAt: Date;
  updatedAt: Date;
  item?: {
    title: string;
    artist: string;
    artworkUrl?: string;
  };
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}
