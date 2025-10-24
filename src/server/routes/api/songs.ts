/**
 * Song Routes
 * Routes for song detail endpoints
 */

import { Router } from 'express';
import * as songController from '../../controllers/songController';

const router = Router();

// GET /api/songs/:id - Get song by ID with complete details
router.get('/:id', songController.getSongById);

export default router;
