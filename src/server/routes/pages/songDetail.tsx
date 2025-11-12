/**
 * Song detail page SSR route
 * Handles server-side rendering of song detail pages
 */

import { Router, Request, Response } from 'express';
import React from 'react';
import { songService } from '../../services/songService';
import { renderPage, render404, render500 } from '../../utils/pageHelpers';
import SongDetailPage from '../../../client/pages/SongDetailPage';
import { SongDetail } from '../../../shared/types/song';
import { ArtistRole, SongArtistRole } from '../../../shared/types/artist';
import { AudioPlayerProvider } from '../../../client/context/AudioPlayerContext';

const router = Router();

/**
 * GET /songs/:id
 * Render song detail page with server-side data
 */
router.get('/songs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch song data
    const song = await songService.getSongById(id);

    if (!song) {
      return render404(req, res, 'Song not found');
    }

    // Convert to frontend-compatible type
    const frontendData: SongDetail = {
      id: song.id,
      title: song.title,
      trackNumber: song.trackNumber ?? undefined,
      duration: song.duration,
      audioUrl: song.audioUrl,
      releaseDate: song.releaseDate,
      genre: song.genre,
      description: song.description || undefined,
      lyrics: song.lyrics || undefined,
      price: song.price,
      album: song.album
        ? {
            id: song.album.id,
            title: song.album.title,
            artworkUrl: song.album.artworkUrl || undefined,
          }
        : undefined,
      artists: song.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        role: artist.role as ArtistRole | SongArtistRole,
      })),
    };

    // Render page with SSR
    const pageComponent = React.createElement(SongDetailPage, {
      initialData: frontendData,
    });

    // Wrap with AudioPlayerProvider
    const component = React.createElement(
      AudioPlayerProvider,
      null,
      pageComponent
    );

    renderPage(req, res, component, {
      title: `${song.title} | Music Store`,
      initialData: {
        initialData: frontendData,
      },
      pageType: 'song-detail',
    });
  } catch (error) {
    console.error('Song detail page error:', error);
    render500(req, res, error as Error);
  }
});

export default router;
