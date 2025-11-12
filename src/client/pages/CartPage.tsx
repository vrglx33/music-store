/**
 * CartPage Component
 * Full cart management UI
 */

import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

interface CartItemData {
  id: string;
  itemType: 'album' | 'song';
  itemId: string;
  quantity: number;
  priceAtAddition: number;
  item?: {
    title: string;
    artist: string;
    artworkUrl: string | null;
  };
}

interface CartData {
  items: CartItemData[];
  totalItems: number;
  subtotal: number;
}

const CartPage: React.FC = () => {
  const { isLoading, updateQuantity, removeItem, clearCart, getCartCount } = useCart();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart data on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setFetchLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cart', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data: CartData = await response.json();
      setCartData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cart';
      setError(errorMessage);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    const success = await updateQuantity(cartItemId, quantity);
    if (success) {
      await fetchCart();
      await getCartCount();
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    const success = await removeItem(cartItemId);
    if (success) {
      await fetchCart();
      await getCartCount();
    }
  };

  const handleClearCart = async () => {
    const success = await clearCart();
    if (success) {
      await fetchCart();
    }
  };

  // Loading state
  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <div className="py-12">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <a
              href="/catalog"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-sm text-gray-600 mt-1">
          {cartData.totalItems} {cartData.totalItems === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          {cartData.items.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              itemType={item.itemType}
              title={item.item?.title || 'Unknown'}
              artist={item.item?.artist || 'Unknown Artist'}
              artworkUrl={item.item?.artworkUrl || undefined}
              price={item.priceAtAddition}
              quantity={item.quantity}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CartSummary
          itemCount={cartData.totalItems}
          subtotal={cartData.subtotal}
          onClearCart={handleClearCart}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CartPage;
