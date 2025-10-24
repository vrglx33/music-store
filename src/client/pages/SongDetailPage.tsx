/**
 * SongDetailPage component
 * Individual song information with credits
 */

import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AddToCartButton from '../components/AddToCartButton';
import AudioPlayer from '../components/AudioPlayer';
import { SongDetail } from '../../shared/types/song';
import { useAudioPlayerContext } from '../context/AudioPlayerContext';

interface SongDetailPageProps {
  initialData: SongDetail;
}

const SongDetailPage: React.FC<SongDetailPageProps> = ({ initialData }) => {
  const { loadSong, play } = useAudioPlayerContext();
  const song = initialData;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePlay = () => {
    loadSong({
      id: song.id,
      title: song.title,
      artist:
        song.artists.find((a) => a.role === 'primary')?.name ||
        'Unknown Artist',
      audioUrl: song.audioUrl,
      artworkUrl: song.album?.artworkUrl,
    });
    play();
  };

  const primaryArtists = song.artists.filter((a) => a.role === 'primary');
  const featuredArtists = song.artists.filter((a) => a.role === 'featured');
  const producers = song.artists.filter((a) => a.role === 'producer');
  const songwriters = song.artists.filter((a) => a.role === 'songwriter');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation cartCount={0} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <a href="/" className="text-indigo-600 hover:text-indigo-800">
            Catalog
          </a>
          {song.album && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <a
                href={`/albums/${song.album.id}`}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {song.album.title}
              </a>
            </>
          )}
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{song.title}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Song Header */}
          <div className="md:flex">
            {/* Artwork */}
            <div className="md:flex-shrink-0">
              <div className="h-64 md:h-80 md:w-80">
                <img
                  src={song.album?.artworkUrl || '/placeholder.jpg'}
                  alt={`${song.title} artwork`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-8 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {song.title}
              </h1>

              {/* Artists */}
              <div className="mb-4">
                <p className="text-lg text-gray-700">
                  {primaryArtists.map((a) => a.name).join(', ') ||
                    'Unknown Artist'}
                </p>
                {featuredArtists.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Featuring: {featuredArtists.map((a) => a.name).join(', ')}
                  </p>
                )}
              </div>

              {/* Album Link */}
              {song.album && (
                <div className="mb-4">
                  <a
                    href={`/albums/${song.album.id}`}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    From: {song.album.title}
                  </a>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                {song.trackNumber && (
                  <span className="font-medium">Track {song.trackNumber}</span>
                )}
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {song.genre}
                </span>
                <span>{formatDate(song.releaseDate)}</span>
                <span className="font-mono">
                  {formatDuration(song.duration)}
                </span>
              </div>

              {/* Price and Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-200">
                <div className="text-2xl font-bold text-gray-900">
                  ${song.price.toFixed(2)}
                </div>
                <button
                  onClick={handlePlay}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  data-testid="play-song-button"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Play Song
                </button>
                <AddToCartButton
                  itemType="song"
                  itemId={song.id}
                  label="Add Song to Cart"
                />
              </div>
            </div>
          </div>

          {/* Description/Lyrics */}
          {(song.description || song.lyrics) && (
            <div className="border-t border-gray-200 p-8">
              {song.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    About This Song
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {song.description}
                  </p>
                </div>
              )}

              {song.lyrics && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Lyrics
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                      {song.lyrics}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Credits */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Credits</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {primaryArtists.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Primary Artist{primaryArtists.length > 1 ? 's' : ''}
                  </h3>
                  <ul className="space-y-1">
                    {primaryArtists.map((artist) => (
                      <li key={artist.id} className="text-gray-900">
                        {artist.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {featuredArtists.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Featured Artist{featuredArtists.length > 1 ? 's' : ''}
                  </h3>
                  <ul className="space-y-1">
                    {featuredArtists.map((artist) => (
                      <li key={artist.id} className="text-gray-900">
                        {artist.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {producers.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Producer{producers.length > 1 ? 's' : ''}
                  </h3>
                  <ul className="space-y-1">
                    {producers.map((artist) => (
                      <li key={artist.id} className="text-gray-900">
                        {artist.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {songwriters.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Songwriter{songwriters.length > 1 ? 's' : ''}
                  </h3>
                  <ul className="space-y-1">
                    {songwriters.map((artist) => (
                      <li key={artist.id} className="text-gray-900">
                        {artist.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AudioPlayer />
    </div>
  );
};

export default SongDetailPage;
