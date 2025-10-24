/**
 * Pagination component
 * Navigate between catalog pages with controls
 */

import React, { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const [jumpToPage, setJumpToPage] = useState('');

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);

    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage('');
    }
  };

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
      data-testid="pagination"
    >
      {/* Page Info */}
      <div className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          className={`
            inline-flex items-center justify-center
            px-4 py-2
            text-sm font-medium
            border border-gray-300 rounded-md
            min-w-[44px] min-h-[44px]
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-colors
            ${
              isPreviousDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
          aria-label="Previous page"
          data-testid="previous-button"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`
            inline-flex items-center justify-center
            px-4 py-2
            text-sm font-medium
            border border-gray-300 rounded-md
            min-w-[44px] min-h-[44px]
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-colors
            ${
              isNextDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
          aria-label="Next page"
          data-testid="next-button"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-5 h-5 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Jump to Page */}
      {totalPages > 1 && (
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <label htmlFor="jump-to-page" className="text-sm text-gray-700">
            Go to:
          </label>
          <input
            id="jump-to-page"
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            placeholder="Page"
            className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            data-testid="jump-to-page-input"
          />
          <button
            type="submit"
            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            data-testid="jump-button"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
};

export default Pagination;
