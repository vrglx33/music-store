/**
 * AudioPlayerContext
 * Provides global audio player state across the application
 */

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useAudioPlayer,
  UseAudioPlayerReturn,
} from '../hooks/useAudioPlayer';

const AudioPlayerContext = createContext<UseAudioPlayerReturn | undefined>(
  undefined
);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const audioPlayer = useAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = (): UseAudioPlayerReturn => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      'useAudioPlayerContext must be used within AudioPlayerProvider'
    );
  }
  return context;
};
