/**
 * CartSummary Component
 * Displays cart totals and actions
 */

import React from 'react';

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  onClearCart: () => void;
  isLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  itemCount,
  subtotal,
  onClearCart,
  isLoading = false,
}) => {
  const formattedSubtotal = subtotal.toFixed(2);

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-6">
      {/* Summary Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Subtotal:</span>
          <span>${formattedSubtotal}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onClearCart}
          disabled={isLoading || itemCount === 0}
          className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Cart
        </button>

        <a
          href="/catalog"
          className="block w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-center text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          Continue Shopping
        </a>

        <button
          disabled
          className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
          title="Checkout coming soon"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
