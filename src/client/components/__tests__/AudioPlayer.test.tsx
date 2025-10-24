/**
 * AudioPlayer component tests
 * Focused tests for critical audio player functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioPlayer from '../AudioPlayer';
import * as useAudioPlayerModule from '../../hooks/useAudioPlayer';

// Mock the useAudioPlayer hook
jest.mock('../../hooks/useAudioPlayer');

describe('AudioPlayer', () => {
  const mockSong = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    audioUrl: '/test-audio.mp3',
    artworkUrl: '/test-artwork.jpg',
  };

  const mockUseAudioPlayer = {
    currentSong: mockSong,
    isPlaying: false,
    currentTime: 30,
    duration: 180,
    volume: 0.7,
    isLoading: false,
    error: null,
    loadSong: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    seek: jest.fn(),
    setVolume: jest.fn(),
    toggleMute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAudioPlayerModule.useAudioPlayer as jest.Mock).mockReturnValue(
      mockUseAudioPlayer
    );
  });

  test('renders audio player with song information', () => {
    render(<AudioPlayer />);

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByAltText('Test Song')).toHaveAttribute(
      'src',
      '/test-artwork.jpg'
    );
  });

  test('play/pause toggle works correctly', () => {
    const { rerender } = render(<AudioPlayer />);

    const playPauseButton = screen.getByTestId('play-pause-button');

    // Click to play
    fireEvent.click(playPauseButton);
    expect(mockUseAudioPlayer.play).toHaveBeenCalledTimes(1);

    // Update mock to show playing state
    (useAudioPlayerModule.useAudioPlayer as jest.Mock).mockReturnValue({
      ...mockUseAudioPlayer,
      isPlaying: true,
    });

    rerender(<AudioPlayer />);

    // Click to pause
    fireEvent.click(playPauseButton);
    expect(mockUseAudioPlayer.pause).toHaveBeenCalledTimes(1);
  });

  test('volume control adjusts volume', () => {
    render(<AudioPlayer />);

    const volumeSlider = screen.getByTestId(
      'volume-slider'
    ) as HTMLInputElement;

    fireEvent.change(volumeSlider, { target: { value: '0.5' } });

    expect(mockUseAudioPlayer.setVolume).toHaveBeenCalledWith(0.5);
  });

  test('seek functionality works on progress bar click', () => {
    render(<AudioPlayer />);

    const progressBar = screen.getByTestId('progress-bar');

    // Mock getBoundingClientRect
    progressBar.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: 100,
      top: 0,
      right: 100,
      bottom: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // Click at 50% of progress bar
    fireEvent.click(progressBar, { clientX: 50 });

    // Should seek to 50% of duration (180 * 0.5 = 90)
    expect(mockUseAudioPlayer.seek).toHaveBeenCalledWith(90);
  });

  test('mute button toggles mute', () => {
    render(<AudioPlayer />);

    const muteButton = screen.getByTestId('mute-button');

    fireEvent.click(muteButton);

    expect(mockUseAudioPlayer.toggleMute).toHaveBeenCalledTimes(1);
  });

  test('displays loading state', () => {
    (useAudioPlayerModule.useAudioPlayer as jest.Mock).mockReturnValue({
      ...mockUseAudioPlayer,
      isLoading: true,
    });

    render(<AudioPlayer />);

    const playPauseButton = screen.getByTestId('play-pause-button');
    expect(playPauseButton).toBeDisabled();
  });

  test('displays error message with retry button', () => {
    const errorMessage = 'Failed to load audio file';
    (useAudioPlayerModule.useAudioPlayer as jest.Mock).mockReturnValue({
      ...mockUseAudioPlayer,
      error: errorMessage,
    });

    render(<AudioPlayer />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockUseAudioPlayer.play).toHaveBeenCalledTimes(1);
  });

  test('does not render when no song is loaded', () => {
    (useAudioPlayerModule.useAudioPlayer as jest.Mock).mockReturnValue({
      ...mockUseAudioPlayer,
      currentSong: null,
    });

    const { container } = render(<AudioPlayer />);

    expect(container.firstChild).toBeNull();
  });
});
