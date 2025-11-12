/**
 * CartSummary Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartSummary from '../CartSummary';

describe('CartSummary', () => {
  const mockOnClearCart = jest.fn();

  const defaultProps = {
    itemCount: 3,
    subtotal: 29.97,
    onClearCart: mockOnClearCart,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display correct subtotal calculation', () => {
    render(<CartSummary {...defaultProps} />);

    expect(screen.getByText('$29.97')).toBeInTheDocument();
    expect(screen.getByText(/3 items/i)).toBeInTheDocument();
  });

  it('should trigger clearCart callback when clear button is clicked', () => {
    render(<CartSummary {...defaultProps} />);

    const clearButton = screen.getByText(/clear cart/i);
    fireEvent.click(clearButton);

    expect(mockOnClearCart).toHaveBeenCalled();
  });
});
