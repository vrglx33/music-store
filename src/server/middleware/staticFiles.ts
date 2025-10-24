/**
 * Static File Serving Middleware
 * Enhanced static file serving with range requests and proper headers
 */

import express from 'express';
import path from 'path';

/**
 * Configure static file serving for audio files with range request support
 */
export function configureAudioServing(app: express.Application): void {
  const audioPath = path.join(__dirname, '../../../public/uploads/audio');

  // Serve audio files with range request support (built-in with express.static)
  app.use(
    '/uploads/audio',
    express.static(audioPath, {
      setHeaders: (res, filePath) => {
        // Set appropriate MIME types for audio files
        if (filePath.endsWith('.mp3')) {
          res.setHeader('Content-Type', 'audio/mpeg');
        } else if (filePath.endsWith('.flac')) {
          res.setHeader('Content-Type', 'audio/flac');
        } else if (filePath.endsWith('.wav')) {
          res.setHeader('Content-Type', 'audio/wav');
        }

        // Set cache headers (1 week)
        res.setHeader('Cache-Control', 'public, max-age=604800');

        // Enable range requests
        res.setHeader('Accept-Ranges', 'bytes');
      },
    })
  );
}

/**
 * Configure static file serving for artwork images
 */
export function configureArtworkServing(app: express.Application): void {
  const artworkPath = path.join(__dirname, '../../../public/uploads/artwork');

  app.use(
    '/uploads/artwork',
    express.static(artworkPath, {
      setHeaders: (res, filePath) => {
        // Set appropriate MIME types for images
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
          res.setHeader('Content-Type', 'image/jpeg');
        } else if (filePath.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
        } else if (filePath.endsWith('.webp')) {
          res.setHeader('Content-Type', 'image/webp');
        }

        // Set cache headers (1 week)
        res.setHeader('Cache-Control', 'public, max-age=604800');
      },
    })
  );
}
