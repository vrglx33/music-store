/**
 * AlbumCard component
 * Displays album information in catalog grid/list view
 */

import React from 'react';
import AddToCartButton from './AddToCartButton';

interface AlbumCardProps {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  artworkUrl?: string;
  releaseDate: string;
  genre: string;
  price: number;
  duration: number;
  view?: 'grid' | 'list';
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  id,
  title,
  artist,
  artworkUrl,
  releaseDate,
  genre,
  price,
  duration,
  view = 'grid',
}) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (view === 'list') {
    return (
      <a
        href={`/albums/${id}`}
        className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-300"
        data-testid="album-card-list"
      >
        {/* Artwork */}
        <div className="flex-shrink-0">
          <img
            src={artworkUrl || '/placeholder.jpg'}
            alt={`${title} album cover`}
            className="w-20 h-20 rounded object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-600 truncate">{artist.name}</p>
        </div>

        {/* Metadata */}
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">{genre}</span>
          <span>{formatDate(releaseDate)}</span>
          <span>{formatDuration(duration)}</span>
        </div>

        {/* Price and Cart */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-semibold text-gray-900">
            ${price.toFixed(2)}
          </span>
          <div onClick={(e) => e.preventDefault()}>
            <AddToCartButton itemType="album" itemId={id} label="Add" />
          </div>
        </div>
      </a>
    );
  }

  // Grid view
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 hover:border-indigo-300 flex flex-col"
      data-testid="album-card-grid"
    >
      <a href={`/albums/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={artworkUrl || '/placeholder.jpg'}
            alt={`${title} album cover`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </a>

      <div className="p-4 flex-1 flex flex-col">
        <a href={`/albums/${id}`} className="block flex-1">
          <h3
            className="font-semibold text-gray-900 truncate mb-1"
            title={title}
          >
            {title}
          </h3>
          <p
            className="text-sm text-gray-600 truncate mb-2"
            title={artist.name}
          >
            {artist.name}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span className="px-2 py-1 bg-gray-100 rounded">{genre}</span>
            <span>{formatDate(releaseDate)}</span>
          </div>
        </a>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="font-semibold text-gray-900">
            ${price.toFixed(2)}
          </span>
          <AddToCartButton
            itemType="album"
            itemId={id}
            label="Add to Cart"
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
