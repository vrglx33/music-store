/**
 * CartItem Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '../CartItem';

describe('CartItem', () => {
  const mockOnUpdateQuantity = jest.fn();
  const mockOnRemove = jest.fn();

  const defaultProps = {
    id: 'cart-item-1',
    itemType: 'album' as const,
    title: 'Test Album',
    artist: 'Test Artist',
    price: 9.99,
    quantity: 2,
    onUpdateQuantity: mockOnUpdateQuantity,
    onRemove: mockOnRemove,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render cart item with title, artist, price, and quantity', () => {
    render(<CartItem {...defaultProps} />);

    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('should trigger updateQuantity callback when plus button is clicked', () => {
    render(<CartItem {...defaultProps} />);

    const plusButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(plusButton);

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart-item-1', 3);
  });

  it('should trigger updateQuantity callback when minus button is clicked', () => {
    render(<CartItem {...defaultProps} />);

    const minusButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(minusButton);

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart-item-1', 1);
  });

  it('should trigger removeItem callback when remove button is clicked', () => {
    render(<CartItem {...defaultProps} />);

    const removeButton = screen.getByLabelText('Remove item');
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith('cart-item-1');
  });
});
