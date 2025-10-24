/**
 * Album type definitions
 */

import { ArtistWithRole } from './artist';

export interface Album {
  id: string;
  title: string;
  artworkUrl?: string;
  releaseDate: string;
  genre: string;
  description?: string;
  totalDurationSeconds: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlbumArtist {
  id: string;
  name: string;
  role: string;
}

export interface AlbumTrack {
  id: string;
  trackNumber: number;
  title: string;
  duration: number;
  audioUrl: string;
}

export interface AlbumDetail {
  id: string;
  title: string;
  artworkUrl?: string;
  releaseDate: string;
  genre: string;
  description?: string;
  price: number;
  totalDuration: number;
  artists: ArtistWithRole[];
  tracks: AlbumTrack[];
}
