/**
 * AlbumDetailPage tests
 * Tests for album detail page rendering and functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlbumDetailPage from '../AlbumDetailPage';
import { AlbumDetail } from '../../../shared/types/album';
import { ArtistRole } from '../../../shared/types/artist';

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

jest.mock('../../hooks/useAudioPlayer', () => ({
  useAudioPlayer: () => ({
    loadSong: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
  }),
}));

describe('AlbumDetailPage', () => {
  const mockAlbumData: AlbumDetail = {
    id: 'album-1',
    title: 'Test Album',
    artworkUrl: '/test-artwork.jpg',
    releaseDate: '2024-01-15',
    genre: 'Rock',
    description: 'This is a test album description',
    price: 9.99,
    totalDuration: 3600,
    artists: [
      {
        id: 'artist-1',
        name: 'Primary Artist',
        role: ArtistRole.PRIMARY,
      },
      {
        id: 'artist-2',
        name: 'Featured Artist',
        role: ArtistRole.FEATURED,
      },
    ],
    tracks: [
      {
        id: 'track-1',
        trackNumber: 1,
        title: 'Track One',
        duration: 240,
        audioUrl: '/audio/track-1.mp3',
      },
      {
        id: 'track-2',
        trackNumber: 2,
        title: 'Track Two',
        duration: 180,
        audioUrl: '/audio/track-2.mp3',
      },
    ],
  };

  test('renders album detail page with all metadata', () => {
    render(<AlbumDetailPage initialData={mockAlbumData} />);

    expect(
      screen.getByRole('heading', { name: 'Test Album' })
    ).toBeInTheDocument();
    expect(screen.getByText('Primary Artist')).toBeInTheDocument();
    expect(screen.getByText(/Featuring: Featured Artist/)).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(
      screen.getByText(/This is a test album description/)
    ).toBeInTheDocument();
  });

  test('displays all tracks in correct order', () => {
    render(<AlbumDetailPage initialData={mockAlbumData} />);

    expect(screen.getByText('Track One')).toBeInTheDocument();
    expect(screen.getByText('Track Two')).toBeInTheDocument();

    const trackItems = screen.getAllByTestId('track-item');
    expect(trackItems).toHaveLength(2);
  });

  test('shows play buttons for each track', () => {
    render(<AlbumDetailPage initialData={mockAlbumData} />);

    const playButtons = screen.getAllByTestId('track-play-button');
    expect(playButtons).toHaveLength(2);
  });

  test('displays album price and add to cart button', () => {
    render(<AlbumDetailPage initialData={mockAlbumData} />);

    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('Add Album to Cart')).toBeInTheDocument();
  });

  test('shows breadcrumb navigation', () => {
    render(<AlbumDetailPage initialData={mockAlbumData} />);

    expect(screen.getByText('Catalog')).toBeInTheDocument();
    const breadcrumbLinks = screen.getAllByRole('link');
    expect(breadcrumbLinks.length).toBeGreaterThan(0);
  });
});
