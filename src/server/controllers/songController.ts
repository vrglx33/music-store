/**
 * Song Controller
 * HTTP request handlers for song endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { songService } from '../services/songService';
import { validate as isValidUUID } from 'uuid';

/**
 * GET /api/songs/:id
 * Retrieve song by ID with complete details
 */
export async function getSongById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      res.status(400).json({
        error: 'Invalid song ID format',
        code: 'INVALID_ID',
        message: 'Song ID must be a valid UUID',
      });
      return;
    }

    // Call service
    const song = await songService.getSongById(id);

    // Return 404 if not found
    if (!song) {
      res.status(404).json({
        error: 'Song not found',
        code: 'SONG_NOT_FOUND',
      });
      return;
    }

    // Return song data
    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
}
