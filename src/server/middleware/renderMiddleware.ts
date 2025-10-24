/**
 * SSR Middleware
 * Handles React server-side rendering with Express
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';

interface RenderOptions {
  title: string;
  initialData?: unknown;
  className?: string;
  pageType?: string;
}

/**
 * Generate complete HTML document with SSR content
 */
export function renderToHTML(
  component: React.ReactElement,
  options: RenderOptions
): string {
  const { title, initialData, className = '', pageType = 'catalog' } = options;

  let componentHTML = '';
  let error: Error | null = null;

  try {
    componentHTML = ReactDOMServer.renderToString(component);
  } catch (err) {
    error = err as Error;
    console.error('SSR rendering error:', err);
    componentHTML = `
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h1 class="text-2xl font-bold text-red-600 mb-4">Rendering Error</h1>
          <p class="text-gray-700">An error occurred while rendering this page.</p>
          <a href="/" class="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Return to Home
          </a>
        </div>
      </div>
    `;
  }

  // Create hydration script with initial data and page type
  const hydrationScript = `
    ${
      initialData
        ? `
      <script id="initial-data" type="application/json">
        ${JSON.stringify(initialData)}
      </script>
      <script>
        window.__INITIAL_DATA__ = JSON.parse(document.getElementById('initial-data').textContent);
      </script>
    `
        : ''
    }
    <script>
      window.__PAGE_TYPE__ = ${JSON.stringify(pageType)};
    </script>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Music Store - Browse and discover music from independent artists">
  <title>${title}</title>

  <!-- Tailwind CSS (in production, this would be a built CSS file) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Tailwind Configuration -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            indigo: {
              50: '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    /* Fallback styles to ensure content is visible */
    body {
      background: #f9fafb !important;
      color: #111827 !important;
      font-family: system-ui, -apple-system, sans-serif !important;
    }
    #root {
      min-height: 100vh !important;
    }
    #root * {
      visibility: visible !important;
      opacity: 1 !important;
    }
  </style>
</head>
<body class="${className}">
  <div id="root">${componentHTML}</div>

  ${hydrationScript}

  <!-- Client-side hydration bundle -->
  <script src="/js/bundle.js"></script>

  ${
    error
      ? `
  <script>
    console.error('SSR Error:', ${JSON.stringify(error.message)});
  </script>
  `
      : ''
  }
</body>
</html>
  `.trim();
}

/**
 * Helper to extract initial data from request
 */
export function getInitialData(req: Express.Request): unknown {
  return (req as any).initialData || {};
}

/**
 * Helper to set initial data for SSR
 */
export function setInitialData(req: Express.Request, data: unknown): void {
  (req as any).initialData = data;
}
