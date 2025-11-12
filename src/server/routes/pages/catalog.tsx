/**
 * Catalog page SSR route
 * Handles server-side rendering of the catalog page
 */

import { Router, Request, Response } from 'express';
import React from 'react';
import { catalogService } from '../../services/catalogService';
import {
  renderPage,
  render500,
  extractQueryParams,
} from '../../utils/pageHelpers';
import CatalogPage from '../../../client/pages/CatalogPage';
import { AudioPlayerProvider } from '../../../client/context/AudioPlayerContext';

const router = Router();

/**
 * GET / or GET /browse
 * Render catalog page with server-side data
 */
router.get(['/', '/browse'], async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { page, limit, sort, type, view } = extractQueryParams(req);

    // Validate sort parameter
    const validSort = ['newest', 'artist', 'title'].includes(sort)
      ? sort
      : 'newest';

    // Fetch catalog data
    const catalogData = await catalogService.getCatalog({
      page,
      limit,
      sort: validSort as 'newest' | 'artist' | 'title',
      type: type as 'all' | 'albums' | 'songs',
    });

    // Convert null to undefined for frontend compatibility
    const frontendData = {
      ...catalogData,
      items: catalogData.items.map((item) => ({
        ...item,
        artworkUrl: item.artworkUrl || undefined,
      })),
    };

    // Render page with SSR
    const pageComponent = React.createElement(CatalogPage, {
      initialData: frontendData,
      currentSort: validSort,
      currentView: view,
    });

    // Wrap with AudioPlayerProvider
    const component = React.createElement(
      AudioPlayerProvider,
      null,
      pageComponent
    );

    // Pass props that match component expectations
    renderPage(req, res, component, {
      title: 'Browse Music | Music Store',
      initialData: {
        initialData: frontendData,
        currentSort: validSort,
        currentView: view,
      },
      pageType: 'catalog',
    });
  } catch (error) {
    console.error('Catalog page error:', error);
    render500(req, res, error as Error);
  }
});

export default router;
