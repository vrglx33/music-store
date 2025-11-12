/**
 * useCart hook
 * Custom hook for managing cart state and operations
 */

import { useState, useCallback } from 'react';

interface AddToCartResponse {
  cartItem: {
    id: string;
    itemType: string;
    itemId: string;
    quantity: number;
    priceAtAddition: number;
  };
  cartCount: number;
}

interface UseCartReturn {
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (itemType: 'album' | 'song', itemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  removeItem: (cartItemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  getCartCount: () => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCartCount = useCallback(async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCartCount(data.totalItems || 0);
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setError('Failed to load cart');
    }
  }, []);

  const addToCart = useCallback(
    async (itemType: 'album' | 'song', itemId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemType,
            itemId,
          }),
          credentials: 'include', // Important for session cookies
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add item to cart');
        }

        const data: AddToCartResponse = await response.json();
        setCartCount(data.cartCount);
        setIsLoading(false);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add item to cart';
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update quantity');
        }

        await response.json();
        setIsLoading(false);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update quantity';
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const removeItem = useCallback(
    async (cartItemId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove item');
        }

        await response.json();
        setIsLoading(false);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to remove item';
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clear cart');
      }

      await response.json();
      setCartCount(0);
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    cartCount,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartCount,
  };
};
