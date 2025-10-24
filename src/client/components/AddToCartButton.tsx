/**
 * AddToCartButton component
 * Interactive button for adding items to cart with feedback
 */

import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';

interface AddToCartButtonProps {
  itemType: 'album' | 'song';
  itemId: string;
  label?: string;
  className?: string;
  onSuccess?: (cartCount: number) => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  itemType,
  itemId,
  label,
  className = '',
  onSuccess,
}) => {
  const { addToCart, isLoading, cartCount } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setError(null);

    const success = await addToCart(itemType, itemId);

    if (success) {
      setShowSuccess(true);
      if (onSuccess) {
        onSuccess(cartCount);
      }

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } else {
      setError('Failed to add to cart');
    }
  };

  const buttonLabel =
    label || `Add ${itemType === 'album' ? 'Album' : 'Song'} to Cart`;

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading || showSuccess}
        className={`
          inline-flex items-center justify-center
          px-4 py-2
          bg-indigo-600 hover:bg-indigo-700
          text-white font-medium rounded-md
          disabled:bg-gray-400 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          transition-all duration-200
          min-h-[44px]
          ${showSuccess ? 'bg-green-600 hover:bg-green-600' : ''}
          ${className}
        `}
        aria-label={buttonLabel}
        data-testid="add-to-cart-button"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding...
          </>
        ) : showSuccess ? (
          <>
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Added!
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {buttonLabel}
          </>
        )}
      </button>

      {error && (
        <div
          className="absolute top-full left-0 mt-1 px-3 py-2 bg-red-100 text-red-700 text-sm rounded shadow-lg whitespace-nowrap z-10"
          data-testid="error-message"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
