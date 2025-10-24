/**
 * Page rendering helper utilities
 */

import { Request, Response } from 'express';
import React from 'react';
import { renderToHTML } from '../middleware/renderMiddleware';

interface PageRenderOptions {
  title: string;
  initialData?: unknown;
  className?: string;
  pageType?: string;
}

/**
 * Render a React page component with SSR
 */
export function renderPage(
  _req: Request,
  res: Response,
  component: React.ReactElement,
  options: PageRenderOptions
): void {
  try {
    const html = renderToHTML(component, options);
    res.status(200).send(html);
  } catch (error) {
    console.error('Page rendering error:', error);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * Render a 404 error page
 */
export function render404(
  _req: Request,
  res: Response,
  message?: string
): void {
  const errorMessage = message || 'Page not found';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Not Found | Music Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="text-6xl font-bold text-indigo-600 mb-4">404</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
      <p class="text-gray-600 mb-6">${errorMessage}</p>
      <a
        href="/"
        class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
      >
        Browse Catalog
      </a>
    </div>
  </div>
</body>
</html>
  `.trim();

  res.status(404).send(html);
}

/**
 * Render a 500 error page
 */
export function render500(_req: Request, res: Response, error?: Error): void {
  // Log error server-side but don't expose details to client
  if (error) {
    console.error('Server error:', error);
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>500 - Server Error | Music Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="text-6xl font-bold text-red-600 mb-4">500</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p class="text-gray-600 mb-6">We're working to fix the issue. Please try again later.</p>
      <a
        href="/"
        class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
      >
        Return Home
      </a>
    </div>
  </div>
</body>
</html>
  `.trim();

  res.status(500).send(html);
}

/**
 * Extract query parameters with defaults
 */
export function extractQueryParams(req: Request): {
  page: number;
  limit: number;
  sort: string;
  type: string;
  view: string;
} {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 24)
  );
  const sort = (req.query.sort as string) || 'newest';
  const type = (req.query.type as string) || 'all';
  const view = (req.query.view as string) || 'grid';

  return { page, limit, sort, type, view };
}
