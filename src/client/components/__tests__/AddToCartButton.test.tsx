/**
 * AddToCartButton component tests
 * Focused tests for cart functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddToCartButton from '../AddToCartButton';
import * as useCartModule from '../../hooks/useCart';

// Mock the useCart hook
jest.mock('../../hooks/useCart');

describe('AddToCartButton', () => {
  const mockAddToCart = jest.fn();
  const mockGetCartCount = jest.fn();

  const mockUseCart = {
    cartCount: 0,
    isLoading: false,
    error: null,
    addToCart: mockAddToCart,
    getCartCount: mockGetCartCount,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCartModule.useCart as jest.Mock).mockReturnValue(mockUseCart);
  });

  test('button click triggers addToCart API call', async () => {
    mockAddToCart.mockResolvedValueOnce(true);

    render(<AddToCartButton itemType="album" itemId="test-album-id" />);

    const button = screen.getByTestId('add-to-cart-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith('album', 'test-album-id');
    });
  });

  test('displays success feedback after successful add', async () => {
    mockAddToCart.mockResolvedValueOnce(true);

    render(<AddToCartButton itemType="song" itemId="test-song-id" />);

    const button = screen.getByTestId('add-to-cart-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Added!')).toBeInTheDocument();
    });
  });

  test('displays error message when add fails', async () => {
    mockAddToCart.mockResolvedValueOnce(false);

    render(<AddToCartButton itemType="album" itemId="test-album-id" />);

    const button = screen.getByTestId('add-to-cart-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('Failed to add to cart')).toBeInTheDocument();
    });
  });

  test('shows loading state during API call', async () => {
    mockAddToCart.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
    );

    (useCartModule.useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      isLoading: true,
    });

    render(<AddToCartButton itemType="album" itemId="test-album-id" />);

    const button = screen.getByTestId('add-to-cart-button');

    expect(button).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });

  test('uses custom label when provided', () => {
    render(
      <AddToCartButton
        itemType="album"
        itemId="test-album-id"
        label="Custom Add Label"
      />
    );

    expect(screen.getByText('Custom Add Label')).toBeInTheDocument();
  });

  test('calls onSuccess callback with cart count', async () => {
    const onSuccess = jest.fn();
    mockAddToCart.mockResolvedValueOnce(true);

    (useCartModule.useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      cartCount: 5,
    });

    render(
      <AddToCartButton
        itemType="album"
        itemId="test-album-id"
        onSuccess={onSuccess}
      />
    );

    const button = screen.getByTestId('add-to-cart-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(5);
    });
  });
});
