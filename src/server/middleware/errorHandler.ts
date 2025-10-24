/**
 * Error handling middleware
 * Catches errors and renders appropriate error pages
 */

import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

/**
 * 404 Not Found handler
 * Must be registered after all other routes
 */
export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  const error: ErrorWithStatus = new Error('Not Found');
  error.status = 404;
  next(error);
}

/**
 * General error handler
 * Logs errors server-side and returns user-friendly responses
 */
export function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error details server-side
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err.status || err.statusCode || 500;

  // Set response status
  res.status(statusCode);

  // For API routes, return JSON error
  if (req.path.startsWith('/api/')) {
    res.json({
      error:
        statusCode === 404 ? 'Resource not found' : 'Internal server error',
      code: statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR',
    });
    return;
  }

  // For page routes, render error page
  // For now, send simple HTML response
  // This will be replaced with proper SSR rendering in later tasks
  if (statusCode === 404) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Not Found</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div class="max-w-md w-full text-center">
            <div class="mb-8">
              <h1 class="text-9xl font-bold text-indigo-600">404</h1>
            </div>
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Album or Song Not Found
              </h2>
              <p class="text-lg text-gray-600">
                We couldn't find what you're looking for. The album or song may have been removed or the link might be incorrect.
              </p>
            </div>
            <div class="space-y-4">
              <a
                href="/"
                class="inline-block w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Full Catalog
              </a>
              <p class="text-sm text-gray-500">
                Discover new music from independent artists
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Server Error</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div class="max-w-md w-full text-center">
            <div class="mb-8">
              <h1 class="text-9xl font-bold text-red-600">500</h1>
            </div>
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Something Went Wrong
              </h2>
              <p class="text-lg text-gray-600">
                We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.
              </p>
            </div>
            <div class="space-y-4">
              <a
                href="/"
                class="inline-block w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Home
              </a>
              <p class="text-sm text-gray-500">
                Please try again in a few moments
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  }
}
