/**
 * Catalog Routes
 * Routes for catalog browsing endpoints
 */

import { Router } from 'express';
import * as catalogController from '../../controllers/catalogController';

const router = Router();

// GET /api/catalog - Get paginated catalog with sorting and filtering
router.get('/', catalogController.getCatalog);

export default router;
