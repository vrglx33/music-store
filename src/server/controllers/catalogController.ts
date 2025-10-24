/**
 * Catalog Controller
 * HTTP request handlers for catalog endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { catalogService } from '../services/catalogService';

/**
 * GET /api/catalog
 * Retrieve paginated and filtered catalog
 */
export async function getCatalog(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract and validate query parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 24)
    );

    const sort = (req.query.sort as string) || 'newest';
    const type = (req.query.type as string) || 'all';

    // Validate sort parameter
    if (!['newest', 'artist', 'title'].includes(sort)) {
      res.status(400).json({
        error: 'Invalid sort parameter',
        code: 'INVALID_SORT',
        message: 'Sort must be one of: newest, artist, title',
      });
      return;
    }

    // Validate type parameter
    if (!['all', 'albums', 'songs'].includes(type)) {
      res.status(400).json({
        error: 'Invalid type parameter',
        code: 'INVALID_TYPE',
        message: 'Type must be one of: all, albums, songs',
      });
      return;
    }

    // Call service
    const result = await catalogService.getCatalog({
      page,
      limit,
      sort: sort as 'newest' | 'artist' | 'title',
      type: type as 'all' | 'albums' | 'songs',
    });

    // Return response
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
