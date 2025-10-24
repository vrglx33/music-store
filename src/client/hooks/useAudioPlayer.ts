/**
 * useAudioPlayer hook
 * Custom hook for managing audio playback state and controls
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  artworkUrl?: string;
}

interface AudioPlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

interface AudioPlayerControls {
  loadSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export type UseAudioPlayerReturn = AudioPlayerState & AudioPlayerControls;

const VOLUME_STORAGE_KEY = 'musicStoreVolume';
const DEFAULT_VOLUME = 0.7;

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_VOLUME;
    const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
    return savedVolume ? parseFloat(savedVolume) : DEFAULT_VOLUME;
  });
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(volume);

  // Initialize audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update volume on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Failed to load audio file');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
    };
  }, []);

  const loadSong = useCallback((song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setError(null);
    setCurrentSong(song);

    // Stop current playback
    audio.pause();
    audio.currentTime = 0;

    // Load new song
    audio.src = song.audioUrl;
    audio.load();

    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to play audio');
        setIsPlaying(false);
        console.error('Audio playback error:', err);
      });
  }, [currentSong]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = Math.max(0, Math.min(time, duration));
      setCurrentTime(audio.currentTime);
    },
    [duration]
  );

  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      setVolumeState(clampedVolume);

      if (typeof window !== 'undefined') {
        localStorage.setItem(VOLUME_STORAGE_KEY, clampedVolume.toString());
      }

      if (isMuted && clampedVolume > 0) {
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume: isMuted ? 0 : volume,
    isLoading,
    error,
    loadSong,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
  };
};
