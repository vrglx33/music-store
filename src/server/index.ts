import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import {
  connectDatabase,
  disconnectDatabase,
  checkDatabaseHealth,
} from './config/database';
import { sessionMiddleware } from './config/session';
import {
  configureAudioServing,
  configureArtworkServing,
} from './middleware/staticFiles';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

// Import API routes
import catalogRoutes from './routes/api/catalog';
import albumRoutes from './routes/api/albums';
import songRoutes from './routes/api/songs';
import cartRoutes from './routes/api/cart';

// Import page routes (SSR)
import catalogPageRoutes from './routes/pages/catalog';
import albumDetailPageRoutes from './routes/pages/albumDetail';
import songDetailPageRoutes from './routes/pages/songDetail';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware - Session management (must be before routes)
app.use(sessionMiddleware);

// Middleware - Static file serving with enhanced headers
configureAudioServing(app);
configureArtworkServing(app);

// Serve client-side JavaScript bundle
app.use('/js', express.static('public/js'));

// Middleware - Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint with database status
app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();

  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// API Routes (must come before page routes to avoid conflicts)
app.use('/api/catalog', catalogRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/cart', cartRoutes);

// SSR Page Routes
app.use(albumDetailPageRoutes); // /albums/:id
app.use(songDetailPageRoutes); // /songs/:id
app.use(catalogPageRoutes); // / and /browse

// 404 handler (must be after all other routes)
app.use(notFoundHandler);

// Centralized error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down gracefully...');
  try {
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export app for testing
export default app;
