/**
 * 500 Server Error Page
 * Displayed when a server error occurs
 */

import React from 'react';

const ServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600">500</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h2>
          <p className="text-lg text-gray-600">
            We're experiencing technical difficulties. Our team has been
            notified and is working to fix the issue.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </a>
          <p className="text-sm text-gray-500">
            Please try again in a few moments
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
