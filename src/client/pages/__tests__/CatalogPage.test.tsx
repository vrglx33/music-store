/**
 * CatalogPage tests
 * Tests for catalog page rendering and functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CatalogPage from '../CatalogPage';
import { CatalogResponse } from '../../../shared/types/api';

// Mock modules
jest.mock('../../components/AudioPlayer', () => {
  return function MockAudioPlayer() {
    return <div data-testid="audio-player-mock">Audio Player</div>;
  };
});

jest.mock('../../components/Navigation', () => {
  return function MockNavigation({ cartCount }: { cartCount: number }) {
    return (
      <div data-testid="navigation-mock">Navigation (Cart: {cartCount})</div>
    );
  };
});

jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-mock">Footer</div>;
  };
});

describe('CatalogPage', () => {
  const mockCatalogData: CatalogResponse = {
    items: [
      {
        id: 'album-1',
        type: 'album',
        title: 'Test Album',
        artworkUrl: '/test-artwork.jpg',
        artist: {
          id: 'artist-1',
          name: 'Test Artist',
        },
        releaseDate: '2024-01-15',
        genre: 'Rock',
        price: 9.99,
        duration: 3600,
      },
      {
        id: 'song-1',
        type: 'song',
        title: 'Test Song',
        artworkUrl: '/test-artwork.jpg',
        artist: {
          id: 'artist-2',
          name: 'Another Artist',
        },
        releaseDate: '2024-01-20',
        genre: 'Pop',
        price: 0.99,
        duration: 240,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalItems: 100,
      itemsPerPage: 24,
    },
  };

  test('renders catalog page with items in grid view', () => {
    render(
      <CatalogPage
        initialData={mockCatalogData}
        currentSort="newest"
        currentView="grid"
      />
    );

    expect(screen.getByText('Browse Music')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByTestId('catalog-grid')).toBeInTheDocument();
  });

  test('renders catalog page with items in list view', () => {
    render(
      <CatalogPage
        initialData={mockCatalogData}
        currentSort="newest"
        currentView="list"
      />
    );

    expect(screen.getByTestId('catalog-list')).toBeInTheDocument();
  });

  test('displays correct pagination info', () => {
    render(
      <CatalogPage
        initialData={mockCatalogData}
        currentSort="newest"
        currentView="grid"
      />
    );

    expect(screen.getByText(/Showing 2 of 100 items/)).toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 5/)).toBeInTheDocument();
  });

  test('shows sort dropdown with correct value', () => {
    render(
      <CatalogPage
        initialData={mockCatalogData}
        currentSort="artist"
        currentView="grid"
      />
    );

    const sortSelect = screen.getByTestId('sort-select') as HTMLSelectElement;
    expect(sortSelect.value).toBe('artist');
  });

  test('renders empty state when no items', () => {
    const emptyData: CatalogResponse = {
      items: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 24,
      },
    };

    render(
      <CatalogPage
        initialData={emptyData}
        currentSort="newest"
        currentView="grid"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });
});
