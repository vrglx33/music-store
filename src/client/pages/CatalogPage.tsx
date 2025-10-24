/**
 * CatalogPage component
 * Main browsing page with grid/list view, sorting, and pagination
 */

import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ViewToggle from '../components/ViewToggle';
import Pagination from '../components/Pagination';
import AlbumCard from '../components/AlbumCard';
import SongCard from '../components/SongCard';
import AudioPlayer from '../components/AudioPlayer';
import { CatalogResponse } from '../../shared/types/api';

interface CatalogPageProps {
  initialData: CatalogResponse;
  currentSort: string;
  currentView: string;
}

const CatalogPage: React.FC<CatalogPageProps> = ({
  initialData,
  currentSort,
  currentView: initialView,
}) => {
  const [view, setView] = useState<'grid' | 'list'>(
    (initialView as 'grid' | 'list') || 'grid'
  );
  const [sort, setSort] = useState(currentSort || 'newest');

  const { items, pagination } = initialData;

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('catalogView', newView);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);

    // Navigate to update URL with new sort
    const url = new URL(window.location.href);
    url.searchParams.set('sort', newSort);
    url.searchParams.set('page', '1'); // Reset to page 1 on sort change
    window.location.href = url.toString();
  };

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.location.href = url.toString();
  };

  // Restore view preference from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('catalogView');
      if (savedView === 'grid' || savedView === 'list') {
        setView(savedView);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation cartCount={0} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Browse Music
          </h1>
          <p className="text-gray-600">
            Discover music from independent artists
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-sm font-medium text-gray-700"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              data-testid="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="artist">Artist A-Z</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* View Toggle */}
          <ViewToggle currentView={view} onViewChange={handleViewChange} />
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {items.length} of {pagination.totalItems} items
          {pagination.totalPages > 1 &&
            ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
        </div>

        {/* Content Grid/List */}
        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No items found</p>
          </div>
        ) : view === 'grid' ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
            data-testid="catalog-grid"
          >
            {items.map((item) =>
              item.type === 'album' ? (
                <AlbumCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  artist={item.artist}
                  artworkUrl={item.artworkUrl}
                  releaseDate={item.releaseDate}
                  genre={item.genre}
                  price={item.price}
                  duration={item.duration}
                  view="grid"
                />
              ) : (
                <SongCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  artist={item.artist}
                  artworkUrl={item.artworkUrl}
                  releaseDate={item.releaseDate}
                  genre={item.genre}
                  price={item.price}
                  duration={item.duration}
                  view="grid"
                />
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8" data-testid="catalog-list">
            {items.map((item) =>
              item.type === 'album' ? (
                <AlbumCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  artist={item.artist}
                  artworkUrl={item.artworkUrl}
                  releaseDate={item.releaseDate}
                  genre={item.genre}
                  price={item.price}
                  duration={item.duration}
                  view="list"
                />
              ) : (
                <SongCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  artist={item.artist}
                  artworkUrl={item.artworkUrl}
                  releaseDate={item.releaseDate}
                  genre={item.genre}
                  price={item.price}
                  duration={item.duration}
                  view="list"
                />
              )
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <Footer />
      <AudioPlayer />
    </div>
  );
};

export default CatalogPage;
