/**
 * Album Routes
 * Routes for album detail endpoints
 */

import { Router } from 'express';
import * as albumController from '../../controllers/albumController';

const router = Router();

// GET /api/albums/:id - Get album by ID with complete details
router.get('/:id', albumController.getAlbumById);

export default router;
