/**
 * AlbumDetailPage component
 * Complete album information with track listing
 */

import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AddToCartButton from '../components/AddToCartButton';
import AudioPlayer from '../components/AudioPlayer';
import { AlbumDetail } from '../../shared/types/album';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AlbumDetailPageProps {
  initialData: AlbumDetail;
}

const AlbumDetailPage: React.FC<AlbumDetailPageProps> = ({ initialData }) => {
  const { loadSong } = useAudioPlayer();
  const album = initialData;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePlayTrack = (track: any) => {
    loadSong({
      id: track.id,
      title: track.title,
      artist:
        album.artists.find((a) => a.role === 'primary')?.name ||
        'Unknown Artist',
      audioUrl: track.audioUrl,
      artworkUrl: album.artworkUrl,
    });
  };

  const primaryArtist = album.artists.find((a) => a.role === 'primary');
  const featuredArtists = album.artists.filter((a) => a.role === 'featured');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation cartCount={0} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <a href="/" className="text-indigo-600 hover:text-indigo-800">
            Catalog
          </a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{album.title}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Album Header */}
          <div className="md:flex">
            {/* Artwork */}
            <div className="md:flex-shrink-0">
              <div className="h-64 md:h-96 md:w-96">
                <img
                  src={album.artworkUrl || '/placeholder.jpg'}
                  alt={`${album.title} album cover`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-8 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {album.title}
              </h1>

              {/* Artists */}
              <div className="mb-4">
                <p className="text-lg text-gray-700">
                  {primaryArtist?.name || 'Unknown Artist'}
                </p>
                {featuredArtists.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Featuring: {featuredArtists.map((a) => a.name).join(', ')}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {album.genre}
                </span>
                <span>{formatDate(album.releaseDate)}</span>
                <span>{formatTotalDuration(album.totalDuration)}</span>
                <span>{album.tracks.length} tracks</span>
              </div>

              {/* Description */}
              {album.description && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {album.description}
                  </p>
                </div>
              )}

              {/* Price and Actions */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="text-2xl font-bold text-gray-900">
                  ${album.price.toFixed(2)}
                </div>
                <AddToCartButton
                  itemType="album"
                  itemId={album.id}
                  label="Add Album to Cart"
                />
              </div>
            </div>
          </div>

          {/* Track Listing */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracks</h2>

            <div className="space-y-2">
              {album.tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-4 p-3 rounded hover:bg-gray-50 transition-colors group"
                  data-testid="track-item"
                >
                  {/* Track Number */}
                  <div className="w-8 text-center text-gray-500 text-sm font-medium">
                    {track.trackNumber}
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label={`Play ${track.title}`}
                    data-testid="track-play-button"
                  >
                    <svg
                      className="w-4 h-4 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>

                  {/* Track Title */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/songs/${track.id}`}
                      className="font-medium text-gray-900 hover:text-indigo-600 truncate block"
                    >
                      {track.title}
                    </a>
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-gray-500 font-mono">
                    {formatDuration(track.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AudioPlayer />
    </div>
  );
};

export default AlbumDetailPage;
