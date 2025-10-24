/**
 * Song type definitions
 */

import { ArtistWithRole } from './artist';

export interface Song {
  id: string;
  title: string;
  trackNumber?: number;
  durationSeconds: number;
  audioFileUrl: string;
  genre: string;
  releaseDate: string;
  description?: string;
  lyrics?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SongArtist {
  id: string;
  name: string;
  role: string;
}

export interface SongAlbum {
  id: string;
  title: string;
  artworkUrl?: string;
}

export interface SongDetail {
  id: string;
  title: string;
  trackNumber?: number;
  duration: number;
  audioUrl: string;
  releaseDate: string;
  genre: string;
  description?: string;
  lyrics?: string;
  price: number;
  album?: SongAlbum;
  artists: ArtistWithRole[];
}
