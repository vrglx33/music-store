/**
 * SongDetailPage tests
 * Tests for song detail page rendering and functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SongDetailPage from '../SongDetailPage';
import { SongDetail } from '../../../shared/types/song';
import { SongArtistRole } from '../../../shared/types/artist';
import * as AudioPlayerContextModule from '../../context/AudioPlayerContext';

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

jest.mock('../../context/AudioPlayerContext', () => ({
  useAudioPlayerContext: jest.fn(),
}));

describe('SongDetailPage', () => {
  const mockSongData: SongDetail = {
    id: 'song-1',
    title: 'Test Song',
    trackNumber: 3,
    duration: 240,
    audioUrl: '/audio/test-song.mp3',
    releaseDate: '2024-01-20',
    genre: 'Pop',
    description: 'This is a test song',
    lyrics: 'Test lyrics\nLine 2\nLine 3',
    price: 0.99,
    album: {
      id: 'album-1',
      title: 'Test Album',
      artworkUrl: '/test-artwork.jpg',
    },
    artists: [
      {
        id: 'artist-1',
        name: 'Primary Artist',
        role: SongArtistRole.PRIMARY,
      },
      {
        id: 'artist-2',
        name: 'Producer Name',
        role: SongArtistRole.PRODUCER,
      },
      {
        id: 'artist-3',
        name: 'Songwriter Name',
        role: SongArtistRole.SONGWRITER,
      },
    ],
  };

  const mockAudioContext = {
    loadSong: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    // Other properties are not used directly in this component
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (AudioPlayerContextModule.useAudioPlayerContext as jest.Mock).mockReturnValue(
      mockAudioContext
    );
  });

  test('renders song detail page with all metadata', () => {
    render(<SongDetailPage initialData={mockSongData} />);

    expect(
      screen.getByRole('heading', { name: 'Test Song' })
    ).toBeInTheDocument();
    // Check that Primary Artist appears (it appears multiple times - in header and credits)
    expect(screen.getAllByText('Primary Artist').length).toBeGreaterThan(0);
    expect(screen.getByText('Pop')).toBeInTheDocument();
    expect(screen.getByText(/Track 3/)).toBeInTheDocument();
  });

  test('displays album link when song has album', () => {
    render(<SongDetailPage initialData={mockSongData} />);

    expect(screen.getByText(/From: Test Album/)).toBeInTheDocument();
  });

  test('shows credits section with all roles', () => {
    render(<SongDetailPage initialData={mockSongData} />);

    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Producer Name')).toBeInTheDocument();
    expect(screen.getByText('Songwriter Name')).toBeInTheDocument();
  });

  test('displays play button and add to cart', () => {
    render(<SongDetailPage initialData={mockSongData} />);

    expect(screen.getByTestId('play-song-button')).toBeInTheDocument();
    expect(screen.getByText('Add Song to Cart')).toBeInTheDocument();
  });

  test('shows description and lyrics when available', () => {
    render(<SongDetailPage initialData={mockSongData} />);

    expect(screen.getByText('About This Song')).toBeInTheDocument();
    expect(screen.getByText('This is a test song')).toBeInTheDocument();
    expect(screen.getByText('Lyrics')).toBeInTheDocument();
  });

  test('handles song without album', () => {
    const songWithoutAlbum: SongDetail = {
      ...mockSongData,
      album: undefined,
      trackNumber: undefined,
    };

    render(<SongDetailPage initialData={songWithoutAlbum} />);

    expect(
      screen.getByRole('heading', { name: 'Test Song' })
    ).toBeInTheDocument();
    expect(screen.queryByText(/From:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Track/)).not.toBeInTheDocument();
  });
});
