/**
 * Album detail page SSR route
 * Handles server-side rendering of album detail pages
 */

import { Router, Request, Response } from 'express';
import React from 'react';
import { albumService } from '../../services/albumService';
import { renderPage, render404, render500 } from '../../utils/pageHelpers';
import AlbumDetailPage from '../../../client/pages/AlbumDetailPage';
import { AlbumDetail } from '../../../shared/types/album';
import { ArtistRole, SongArtistRole } from '../../../shared/types/artist';
import { AudioPlayerProvider } from '../../../client/context/AudioPlayerContext';

const router = Router();

/**
 * GET /albums/:id
 * Render album detail page with server-side data
 */
router.get('/albums/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch album data
    const album = await albumService.getAlbumById(id);

    if (!album) {
      return render404(req, res, 'Album not found');
    }

    // Convert to frontend-compatible type
    const frontendData: AlbumDetail = {
      id: album.id,
      title: album.title,
      artworkUrl: album.artworkUrl || undefined,
      releaseDate: album.releaseDate,
      genre: album.genre,
      description: album.description || undefined,
      price: album.price,
      totalDuration: album.totalDuration,
      artists: album.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        role: artist.role as ArtistRole | SongArtistRole,
      })),
      tracks: album.tracks.map((track) => ({
        id: track.id,
        trackNumber: track.trackNumber ?? 0,
        title: track.title,
        duration: track.duration,
        audioUrl: track.audioUrl,
      })),
    };

    // Render page with SSR
    const pageComponent = React.createElement(AlbumDetailPage, {
      initialData: frontendData,
    });

    // Wrap with AudioPlayerProvider
    const component = React.createElement(
      AudioPlayerProvider,
      { children: pageComponent }
    );

    renderPage(req, res, component, {
      title: `${album.title} | Music Store`,
      initialData: {
        initialData: frontendData,
      },
      pageType: 'album-detail',
    });
  } catch (error) {
    console.error('Album detail page error:', error);
    render500(req, res, error as Error);
  }
});

export default router;
