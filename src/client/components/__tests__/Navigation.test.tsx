/**
 * Tests for Navigation component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';

describe('Navigation', () => {
  it('should render navigation correctly', () => {
    render(<Navigation cartCount={0} />);

    expect(screen.getByText('Music Store')).toBeInTheDocument();
    expect(screen.getAllByText('Browse Music').length).toBeGreaterThan(0);
  });

  it('should display cart badge when count is greater than 0', () => {
    render(<Navigation cartCount={3} />);

    const badges = screen.getAllByLabelText('3 items in cart');
    expect(badges.length).toBeGreaterThan(0);
    expect(badges[0]).toHaveTextContent('3');
  });

  it('should not display cart badge when count is 0', () => {
    const { container } = render(<Navigation cartCount={0} />);

    const badge = container.querySelector('.cart-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('should toggle mobile menu on button click', () => {
    render(<Navigation cartCount={0} />);

    const menuButton = screen.getByLabelText('Toggle menu');

    // Menu should be closed initially
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toHaveClass('hidden');

    // Click to open
    fireEvent.click(menuButton);
    expect(mobileMenu).not.toHaveClass('hidden');

    // Click to close
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass('hidden');
  });
});
