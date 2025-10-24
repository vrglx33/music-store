/**
 * 404 Not Found Page
 * Displayed when a requested resource cannot be found
 */

import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Album or Song Not Found
          </h2>
          <p className="text-lg text-gray-600">
            We couldn't find what you're looking for. The album or song may have
            been removed or the link might be incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse Full Catalog
          </a>
          <p className="text-sm text-gray-500">
            Discover new music from independent artists
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
