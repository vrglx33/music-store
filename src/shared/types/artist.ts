/**
 * Artist type definitions
 */

export enum ArtistRole {
  PRIMARY = 'primary',
  FEATURED = 'featured',
  COLLABORATOR = 'collaborator',
}

export enum SongArtistRole {
  PRIMARY = 'primary',
  FEATURED = 'featured',
  PRODUCER = 'producer',
  SONGWRITER = 'songwriter',
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtistWithRole {
  id: string;
  name: string;
  role: ArtistRole | SongArtistRole;
}
