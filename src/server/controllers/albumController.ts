/**
 * Album Controller
 * HTTP request handlers for album endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { albumService } from '../services/albumService';
import { validate as isValidUUID } from 'uuid';

/**
 * GET /api/albums/:id
 * Retrieve album by ID with complete details
 */
export async function getAlbumById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      res.status(400).json({
        error: 'Invalid album ID format',
        code: 'INVALID_ID',
        message: 'Album ID must be a valid UUID',
      });
      return;
    }

    // Call service
    const album = await albumService.getAlbumById(id);

    // Return 404 if not found
    if (!album) {
      res.status(404).json({
        error: 'Album not found',
        code: 'ALBUM_NOT_FOUND',
      });
      return;
    }

    // Return album data
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
}
