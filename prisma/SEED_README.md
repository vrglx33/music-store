# Database Seeding Guide

This guide explains how to seed the Music Store database with sample data for testing and development.

## Overview

The seed script generates comprehensive sample data including:
- **18 artists** across diverse genres (Indie Pop, Alternative Rock, Electronic, Jazz, Folk, etc.)
- **26 albums** with metadata spanning years 2022-2024
- **230+ songs** (both album tracks and standalone singles)
- Complete artist-album and artist-song relationships with roles
- Placeholder audio files and artwork

All music prices are set to $0.00 for the MVP/testing phase.

## Running the Seed

### First Time Setup

1. Ensure PostgreSQL is running and the database exists:
```bash
# The database should be created automatically by Prisma migrations
# Check your .env file for DATABASE_URL
```

2. Run migrations if you haven't already:
```bash
npm run prisma:migrate
```

3. Run the seed script:
```bash
npm run prisma:seed
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run prisma:seed` | Run the seed script to populate the database |
| `npm run data:clear` | Clear all data from the database (preserves schema) |
| `npm run seed:reset` | Drop database, recreate, run migrations, and re-seed (full reset) |

## What Gets Created

### Artists (18 total)

The seed creates diverse artists across multiple genres:
- Luna Martinez (Indie Pop)
- The Midnight Owls (Alternative Rock)
- Jasmine Chen (Electronic)
- Marcus Johnson (Jazz)
- Wildfire Collective (Folk)
- Neon Dreams (Synthwave)
- Rosa Delgado (Classical)
- The Basement Sessions (Indie Rock)
- DJ Solaris (Hip-Hop)
- Echo Valley (Post-Rock)
- Sarah Winters (Americana)
- Voltage (Electronic Rock)
- The Blues Brothers Revival (Blues)
- Cosmic Waves (Psychedelic Rock)
- Maya Torres (R&B)
- The Wanderers (World)
- Apex Beats (EDM)
- Oliver Grant (Modern Classical)

### Albums (26 total)

Albums include:
- Full-length albums with 6-15 tracks
- EPs with 5-6 tracks
- Collaboration albums with featured artists
- Various release dates from 2022-2024
- Diverse genres matching their artists
- Album descriptions and metadata

### Songs (230+ total)

Songs feature:
- Album tracks with proper track numbers
- Standalone singles (no album association)
- Durations ranging from 3-6 minutes
- Lyrics for approximately 30% of songs
- Producer and songwriter credits
- Featured artist collaborations

### Relationships

The seed establishes:
- Primary artist assignments for all albums and songs
- Featured artist relationships
- Producer and songwriter credits
- Proper role-based associations

## File Structure

### Placeholder Files

The seed script creates placeholder files in:
- `/uploads/audio/` - Placeholder MP3 files for songs
- `/uploads/artwork/` - Placeholder image files for albums and artists

**Note:** These are empty placeholder files for testing. In production, you would replace these with actual audio files and artwork images.

### Naming Conventions

- Audio files: `song-{albumId}-track-{trackNumber}.mp3` or `single-{artistId}-{index}.mp3`
- Artwork files: `album-{artist-name}-{album-title}.jpg`
- Artist profiles: `artist-{artist-name}.jpg`

## Verifying the Seed

After running the seed, you can verify the data:

1. Use Prisma Studio to browse the data:
```bash
npm run prisma:studio
```

2. Check counts in the database:
```bash
# In Prisma Studio, check the record counts:
# - Artists: ~18
# - Albums: ~26
# - Songs: ~230+
# - AlbumArtists: ~30+
# - SongArtists: ~280+
```

3. Query sample data programmatically:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all artists
const artists = await prisma.artist.findMany();

// Get albums with artist relationships
const albums = await prisma.album.findMany({
  include: {
    albumArtists: {
      include: { artist: true }
    }
  }
});

// Get songs with full relationships
const songs = await prisma.song.findMany({
  include: {
    album: true,
    songArtists: {
      include: { artist: true }
    }
  }
});
```

## Resetting the Database

### Soft Reset (Clear Data Only)

To clear all data but keep the schema:
```bash
npm run data:clear
```

Then re-run the seed:
```bash
npm run prisma:seed
```

### Hard Reset (Drop and Recreate)

To completely reset the database (drops, recreates, migrates, and seeds):
```bash
npm run seed:reset
```

**Warning:** This will permanently delete all data and reset the database to a clean state.

## Customizing the Seed

To modify the seed data:

1. Edit `/prisma/seed.ts`
2. Modify the data arrays:
   - `ARTISTS_DATA` - Artist information
   - `ALBUMS_DATA` - Album information with track counts
   - `SONG_TITLE_TEMPLATES` - Song name variety

3. Adjust generation parameters:
   - Song duration range (currently 180-360 seconds)
   - Lyrics generation probability (currently 30%)
   - Featured artist probability
   - Producer/songwriter credit probability

4. Re-run the seed:
```bash
npm run prisma:seed
```

## Troubleshooting

### "Table doesn't exist" Error

Run migrations first:
```bash
npm run prisma:migrate
```

### "Database connection failed"

Check your DATABASE_URL in `.env`:
```
DATABASE_URL="postgresql://user@localhost:5432/music_store"
```

Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Foreign Key Constraint Errors

Clear the database first:
```bash
npm run data:clear
```

Then re-run the seed:
```bash
npm run prisma:seed
```

### Duplicate Key Errors

The seed script clears existing data automatically. If you still get duplicates, run:
```bash
npm run seed:reset
```

## Performance

The seed script typically takes:
- 10-20 seconds to complete on a local PostgreSQL instance
- Creates 230+ songs with all relationships
- Generates placeholder files for audio and artwork

## Next Steps

After seeding:

1. Start the development server:
```bash
npm run dev
```

2. Open Prisma Studio to explore the data:
```bash
npm run prisma:studio
```

3. Begin testing the catalog browsing features with realistic data
4. Replace placeholder audio files with actual MP3s for audio player testing
5. Replace placeholder artwork with actual images for visual testing

## Production Considerations

For production use:

1. DO NOT run the seed script in production environments
2. Replace placeholder files with actual audio and artwork
3. Implement proper file upload functionality for artists
4. Set appropriate prices instead of $0.00
5. Use actual artist data instead of generated samples
6. Implement proper data validation and sanitization
