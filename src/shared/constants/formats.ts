/**
 * Audio and image format constants
 */

export const AUDIO_FORMATS = {
  MP3: 'audio/mpeg',
  FLAC: 'audio/flac',
  WAV: 'audio/wav',
} as const;

export const IMAGE_FORMATS = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
} as const;

export const SUPPORTED_AUDIO_EXTENSIONS = ['.mp3', '.flac', '.wav'];
export const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
