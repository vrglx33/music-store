/**
 * CartPage Component Tests
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CartPage from '../CartPage';
import { useCart } from '../../hooks/useCart';

// Mock useCart hook
jest.mock('../../hooks/useCart');

describe('CartPage', () => {
  const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display list of CartItem components when cart has items', async () => {
    mockUseCart.mockReturnValue({
      cartCount: 2,
      isLoading: false,
      error: null,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
      getCartCount: jest.fn(),
    });

    // Mock fetch for cart data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: 'item-1',
            itemType: 'album',
            title: 'Album 1',
            quantity: 2,
            priceAtAddition: 9.99,
            item: { title: 'Album 1', artist: 'Artist 1', artworkUrl: null },
          },
          {
            id: 'item-2',
            itemType: 'song',
            title: 'Song 1',
            quantity: 1,
            priceAtAddition: 1.99,
            item: { title: 'Song 1', artist: 'Artist 2', artworkUrl: null },
          },
        ],
        totalItems: 2,
        subtotal: 21.97,
      }),
    });

    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText('Album 1')).toBeInTheDocument();
      expect(screen.getByText('Song 1')).toBeInTheDocument();
    });
  });

  it('should show empty cart message when cart is empty', async () => {
    mockUseCart.mockReturnValue({
      cartCount: 0,
      isLoading: false,
      error: null,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
      getCartCount: jest.fn(),
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        totalItems: 0,
        subtotal: 0,
      }),
    });

    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  it('should display loading state while fetching cart', () => {
    mockUseCart.mockReturnValue({
      cartCount: 0,
      isLoading: true,
      error: null,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
      getCartCount: jest.fn(),
    });

    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to keep loading state
        })
    );

    render(<CartPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
