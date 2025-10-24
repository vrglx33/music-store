/**
 * Cart Service
 * Business logic for shopping cart operations
 */

import prisma from '../config/database';
import { ItemType } from '@prisma/client';

// Service Types
export interface CartItemInfo {
  id: string;
  itemType: string;
  itemId: string;
  quantity: number;
  priceAtAddition: number;
  item?: {
    title: string;
    artist: string;
    artworkUrl: string | null;
  };
}

export interface AddToCartResult {
  cartItem: {
    id: string;
    itemType: string;
    itemId: string;
    quantity: number;
    priceAtAddition: number;
  };
  cartCount: number;
}

export interface Cart {
  items: CartItemInfo[];
  totalItems: number;
  subtotal: number;
}

/**
 * Cart Service
 */
class CartService {
  /**
   * Add item to cart
   */
  async addItemToCart(
    sessionId: string,
    itemType: 'album' | 'song',
    itemId: string
  ): Promise<AddToCartResult> {
    // Verify item exists and get price
    let price = 0;
    let itemExists = false;

    if (itemType === 'album') {
      const album = await prisma.album.findUnique({
        where: { id: itemId },
        select: { price: true },
      });
      if (album) {
        itemExists = true;
        price = parseFloat(album.price.toString());
      }
    } else if (itemType === 'song') {
      const song = await prisma.song.findUnique({
        where: { id: itemId },
        select: { price: true },
      });
      if (song) {
        itemExists = true;
        price = parseFloat(song.price.toString());
      }
    }

    if (!itemExists) {
      throw new Error(`${itemType} not found`);
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        sessionId,
        itemType: itemType as ItemType,
        itemId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity if already exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });
    } else {
      // Create new cart item
      const createData: any = {
        sessionId,
        itemType: itemType as ItemType,
        itemId,
        quantity: 1,
        priceAtAddition: price,
      };

      // Set album or song ID based on type
      if (itemType === 'album') {
        createData.albumId = itemId;
      } else {
        createData.songId = itemId;
      }

      cartItem = await prisma.cartItem.create({
        data: createData,
      });
    }

    // Get total cart count
    const cartCount = await prisma.cartItem.count({
      where: { sessionId },
    });

    return {
      cartItem: {
        id: cartItem.id,
        itemType: cartItem.itemType,
        itemId: cartItem.itemId,
        quantity: cartItem.quantity,
        priceAtAddition: parseFloat(cartItem.priceAtAddition.toString()),
      },
      cartCount,
    };
  }

  /**
   * Get cart contents
   */
  async getCart(sessionId: string): Promise<Cart> {
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: {
        album: {
          include: {
            albumArtists: {
              where: { role: 'primary' },
              include: { artist: true },
              take: 1,
            },
          },
        },
        song: {
          include: {
            album: true,
            songArtists: {
              where: { role: 'primary' },
              include: { artist: true },
              take: 1,
            },
          },
        },
      },
    });

    // Format cart items with details
    const formattedItems: CartItemInfo[] = cartItems.map((item) => {
      let itemDetails = null;

      if (item.itemType === 'album' && item.album) {
        const primaryArtist = item.album.albumArtists[0]?.artist;
        itemDetails = {
          title: item.album.title,
          artist: primaryArtist?.name || 'Unknown Artist',
          artworkUrl: item.album.artworkUrl,
        };
      } else if (item.itemType === 'song' && item.song) {
        const primaryArtist = item.song.songArtists[0]?.artist;
        itemDetails = {
          title: item.song.title,
          artist: primaryArtist?.name || 'Unknown Artist',
          artworkUrl: item.song.album?.artworkUrl || null,
        };
      }

      return {
        id: item.id,
        itemType: item.itemType,
        itemId: item.itemId,
        quantity: item.quantity,
        priceAtAddition: parseFloat(item.priceAtAddition.toString()),
        item: itemDetails || undefined,
      };
    });

    // Calculate totals
    const totalItems = formattedItems.length;
    const subtotal = formattedItems.reduce(
      (sum, item) => sum + item.priceAtAddition * item.quantity,
      0
    );

    return {
      items: formattedItems,
      totalItems,
      subtotal,
    };
  }
}

// Export singleton instance
export const cartService = new CartService();
