/**
 * CartItem Component
 * Displays individual cart item with quantity controls
 */

import React from 'react';

interface CartItemProps {
  id: string;
  itemType: 'album' | 'song';
  title: string;
  artist: string;
  artworkUrl?: string;
  price: number;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  itemType,
  title,
  artist,
  artworkUrl,
  price,
  quantity,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 10) {
      onUpdateQuantity(id, quantity + 1);
    }
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const subtotal = (price * quantity).toFixed(2);

  return (
    <div className="flex gap-4 border-b border-gray-200 py-4">
      {/* Artwork */}
      <div className="flex-shrink-0">
        {artworkUrl ? (
          <img
            src={artworkUrl}
            alt={title}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Art</span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{artist}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
              {itemType === 'album' ? 'Album' : 'Song'}
            </span>
          </div>
          <button
            onClick={handleRemove}
            aria-label="Remove item"
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        </div>

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">${price}</span> each
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-12 text-center border border-gray-300 rounded py-1"
            />
            <button
              onClick={handleIncrease}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-sm font-medium text-gray-900">
            ${subtotal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
