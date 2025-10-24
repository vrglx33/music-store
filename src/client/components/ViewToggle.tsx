/**
 * ViewToggle component
 * Switch between grid and list view for catalog display
 */

import React from 'react';

export type ViewType = 'grid' | 'list';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex rounded-md shadow-sm ${className}`}
      role="group"
      aria-label="View toggle"
    >
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        className={`
          inline-flex items-center justify-center
          px-4 py-2
          text-sm font-medium
          border border-gray-300
          rounded-l-md
          min-w-[44px] min-h-[44px]
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10
          transition-colors
          ${
            currentView === 'grid'
              ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
        aria-label="Grid view"
        aria-pressed={currentView === 'grid'}
        data-testid="grid-view-button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        <span className="ml-2 hidden sm:inline">Grid</span>
      </button>

      <button
        type="button"
        onClick={() => onViewChange('list')}
        className={`
          inline-flex items-center justify-center
          px-4 py-2
          text-sm font-medium
          border border-gray-300 border-l-0
          rounded-r-md
          min-w-[44px] min-h-[44px]
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10
          transition-colors
          ${
            currentView === 'list'
              ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
        aria-label="List view"
        aria-pressed={currentView === 'list'}
        data-testid="list-view-button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span className="ml-2 hidden sm:inline">List</span>
      </button>
    </div>
  );
};

export default ViewToggle;
