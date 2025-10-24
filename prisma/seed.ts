/**
 * Prisma Seed Script for Music Store Platform
 *
 * This script generates comprehensive seed data for testing the music catalog browsing feature.
 * It creates:
 * - 15-20 artists with diverse genres and styles
 * - 20-30 albums with metadata across multiple years
 * - 100+ songs with proper track relationships
 * - Album-Artist and Song-Artist relationships with roles
 * - Placeholder audio files and artwork
 */

import { PrismaClient, ArtistRole, SongArtistRole } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================================
// SAMPLE DATA DEFINITIONS
// ============================================================================

const ARTISTS_DATA = [
  { name: 'Luna Martinez', bio: 'Indie pop singer-songwriter known for dreamy melodies and introspective lyrics. Based in Portland, OR.', genre: 'Indie Pop' },
  { name: 'The Midnight Owls', bio: 'Alternative rock band from Seattle bringing raw energy and emotional depth to every performance.', genre: 'Alternative Rock' },
  { name: 'Jasmine Chen', bio: 'Electronic music producer and DJ creating atmospheric soundscapes that blend ambient and techno.', genre: 'Electronic' },
  { name: 'Marcus Johnson', bio: 'Jazz guitarist and composer influenced by bebop legends and contemporary fusion artists.', genre: 'Jazz' },
  { name: 'Wildfire Collective', bio: 'Folk ensemble featuring acoustic instrumentation and harmonious storytelling from Nashville, TN.', genre: 'Folk' },
  { name: 'Neon Dreams', bio: 'Synthwave duo producing nostalgic 80s-inspired electronic music with modern production.', genre: 'Synthwave' },
  { name: 'Rosa Delgado', bio: 'Classical pianist and composer blending traditional techniques with contemporary minimalism.', genre: 'Classical' },
  { name: 'The Basement Sessions', bio: 'Indie rock band known for lo-fi production and honest, relatable songwriting.', genre: 'Indie Rock' },
  { name: 'DJ Solaris', bio: 'Hip-hop producer and beat maker crafting soulful instrumentals with boom-bap influences.', genre: 'Hip-Hop' },
  { name: 'Echo Valley', bio: 'Atmospheric post-rock band creating expansive instrumental journeys and cinematic soundscapes.', genre: 'Post-Rock' },
  { name: 'Sarah Winters', bio: 'Singer-songwriter blending folk, country, and Americana with powerful vocal performances.', genre: 'Americana' },
  { name: 'Voltage', bio: 'Electronic rock band fusing guitar-driven melodies with synthesizers and drum machines.', genre: 'Electronic Rock' },
  { name: 'The Blues Brothers Revival', bio: 'Modern blues band honoring traditional Chicago blues while adding contemporary flair.', genre: 'Blues' },
  { name: 'Cosmic Waves', bio: 'Psychedelic rock group exploring experimental sounds and extended instrumental improvisations.', genre: 'Psychedelic Rock' },
  { name: 'Maya Torres', bio: 'R&B vocalist and songwriter with smooth vocals and soul-influenced production.', genre: 'R&B' },
  { name: 'The Wanderers', bio: 'World music ensemble incorporating instruments and traditions from diverse global cultures.', genre: 'World' },
  { name: 'Apex Beats', bio: 'Electronic dance music producer specializing in progressive house and melodic techno.', genre: 'EDM' },
  { name: 'Oliver Grant', bio: 'Contemporary classical composer known for minimalist piano compositions and film scores.', genre: 'Modern Classical' },
];

const ALBUMS_DATA = [
  // Luna Martinez albums
  { title: 'Starlight Dreams', artistIndex: 0, year: 2024, genre: 'Indie Pop', description: 'A collection of ethereal pop songs exploring themes of love, loss, and self-discovery.', trackCount: 10 },
  { title: 'Midnight Reverie', artistIndex: 0, year: 2023, genre: 'Indie Pop', description: 'Sophomore album featuring intimate vocals over lush production.', trackCount: 8 },

  // The Midnight Owls albums
  { title: 'Concrete Hearts', artistIndex: 1, year: 2024, genre: 'Alternative Rock', description: 'Raw and powerful rock anthems about urban life and emotional resilience.', trackCount: 11 },
  { title: 'Echo Chamber', artistIndex: 1, year: 2022, genre: 'Alternative Rock', description: 'Debut album showcasing the band\'s signature sound and energy.', trackCount: 9 },

  // Jasmine Chen albums
  { title: 'Digital Horizons', artistIndex: 2, year: 2024, genre: 'Electronic', description: 'Experimental electronic album blending ambient textures with rhythmic elements.', trackCount: 8 },
  { title: 'Neon Nights', artistIndex: 2, year: 2023, genre: 'Electronic', description: 'Dance-oriented electronic music perfect for late-night listening.', trackCount: 10 },

  // Marcus Johnson albums
  { title: 'Blue Note Sessions', artistIndex: 3, year: 2023, genre: 'Jazz', description: 'Modern jazz guitar performances with a nod to the bebop tradition.', trackCount: 7 },

  // Wildfire Collective albums
  { title: 'Mountain Songs', artistIndex: 4, year: 2024, genre: 'Folk', description: 'Acoustic folk album celebrating nature and human connection.', trackCount: 12 },
  { title: 'Whispers in the Wind', artistIndex: 4, year: 2022, genre: 'Folk', description: 'Harmony-rich folk songs telling stories of love and adventure.', trackCount: 10 },

  // Neon Dreams albums
  { title: 'Retrowave Memories', artistIndex: 5, year: 2024, genre: 'Synthwave', description: 'Nostalgic synthwave tracks evoking 1980s aesthetics with modern polish.', trackCount: 9 },

  // Rosa Delgado albums
  { title: 'Piano Reflections', artistIndex: 6, year: 2023, genre: 'Classical', description: 'Contemporary piano compositions blending classical and minimalist styles.', trackCount: 6 },

  // The Basement Sessions albums
  { title: 'Homegrown', artistIndex: 7, year: 2024, genre: 'Indie Rock', description: 'Lo-fi indie rock recorded in a basement, full of heart and authenticity.', trackCount: 10 },
  { title: 'Late Night Thoughts', artistIndex: 7, year: 2023, genre: 'Indie Rock', description: 'Introspective indie rock exploring themes of anxiety and hope.', trackCount: 8 },

  // DJ Solaris albums
  { title: 'Boom Bap Chronicles', artistIndex: 8, year: 2024, genre: 'Hip-Hop', description: 'Instrumental hip-hop beats with soulful samples and crisp drums.', trackCount: 15 },

  // Echo Valley albums
  { title: 'Distant Shores', artistIndex: 9, year: 2024, genre: 'Post-Rock', description: 'Cinematic post-rock journeys building from quiet whispers to explosive crescendos.', trackCount: 7 },
  { title: 'Horizons', artistIndex: 9, year: 2022, genre: 'Post-Rock', description: 'Atmospheric instrumental album perfect for contemplative listening.', trackCount: 6 },

  // Sarah Winters albums
  { title: 'Wildflower', artistIndex: 10, year: 2024, genre: 'Americana', description: 'Heartfelt Americana songs about home, family, and the open road.', trackCount: 11 },

  // Voltage albums
  { title: 'Electric Soul', artistIndex: 11, year: 2023, genre: 'Electronic Rock', description: 'High-energy fusion of rock guitars and electronic production.', trackCount: 9 },

  // The Blues Brothers Revival albums
  { title: 'Chicago Nights', artistIndex: 12, year: 2024, genre: 'Blues', description: 'Modern blues album paying tribute to the Chicago blues tradition.', trackCount: 10 },

  // Cosmic Waves albums
  { title: 'Interstellar Journey', artistIndex: 13, year: 2023, genre: 'Psychedelic Rock', description: 'Psychedelic rock odyssey with extended jams and cosmic themes.', trackCount: 6 },

  // Maya Torres albums
  { title: 'Velvet Voice', artistIndex: 14, year: 2024, genre: 'R&B', description: 'Smooth R&B vocals over soulful production and romantic lyrics.', trackCount: 10 },
  { title: 'Midnight Soul', artistIndex: 14, year: 2022, genre: 'R&B', description: 'Debut R&B album showcasing vocal prowess and songwriting skills.', trackCount: 9 },

  // The Wanderers albums
  { title: 'Global Rhythms', artistIndex: 15, year: 2024, genre: 'World', description: 'World music fusion incorporating diverse cultural traditions and instruments.', trackCount: 11 },

  // Apex Beats albums
  { title: 'Progressive Waves', artistIndex: 16, year: 2024, genre: 'EDM', description: 'Progressive house and melodic techno designed for the dancefloor.', trackCount: 8 },

  // Oliver Grant albums
  { title: 'Silent Echoes', artistIndex: 17, year: 2023, genre: 'Modern Classical', description: 'Minimalist piano compositions exploring silence, space, and emotion.', trackCount: 7 },

  // Collaboration albums
  { title: 'Indie Nights Vol. 1', artistIndex: 0, year: 2023, genre: 'Indie Pop', description: 'Collaborative EP featuring Luna Martinez and friends.', trackCount: 5, featured: [7] },
  { title: 'Electronic Fusion', artistIndex: 2, year: 2022, genre: 'Electronic', description: 'Experimental collaboration between electronic artists.', trackCount: 6, featured: [5, 16] },
];

// Song title templates for variety
const SONG_TITLE_TEMPLATES = [
  'Intro', 'Awakening', 'Memories', 'Echoes', 'Dreams', 'Shadows', 'Lights', 'Journey',
  'Hope', 'Farewell', 'Tomorrow', 'Yesterday', 'Forever', 'Moments', 'Reflections',
  'Whispers', 'Thunder', 'Rainfall', 'Sunrise', 'Midnight', 'Stars', 'Ocean', 'Mountains',
  'City Lights', 'Lost & Found', 'Running', 'Falling', 'Rising', 'Dancing', 'Waiting',
  'Home', 'Away', 'Together', 'Alone', 'Fire', 'Ice', 'Wind', 'Earth'
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a release date for an album based on year
 */
function generateReleaseDate(year: number): Date {
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

/**
 * Generate song duration in seconds (3-6 minutes range)
 */
function generateDuration(): number {
  return Math.floor(Math.random() * (360 - 180 + 1)) + 180; // 180-360 seconds
}

/**
 * Generate song title based on track number and album context
 */
function generateSongTitle(trackNumber: number, albumTitle: string, totalTracks: number): string {
  if (trackNumber === 1 && Math.random() > 0.7) {
    return 'Intro';
  }
  if (trackNumber === totalTracks && Math.random() > 0.7) {
    return 'Outro';
  }

  const randomTitle = SONG_TITLE_TEMPLATES[Math.floor(Math.random() * SONG_TITLE_TEMPLATES.length)];

  // Sometimes add album title reference
  if (Math.random() > 0.8) {
    const albumWords = albumTitle.split(' ');
    return `${albumWords[0]} ${randomTitle}`;
  }

  return randomTitle;
}

/**
 * Generate lyrics for a song (only for some songs)
 */
function generateLyrics(songTitle: string): string | null {
  // Only generate lyrics for 30% of songs
  if (Math.random() > 0.3) {
    return null;
  }

  return `[Verse 1]
${songTitle} in the night
Finding my way through the light
Every moment feels so right
Dancing until the morning light

[Chorus]
Oh ${songTitle}, take me away
To a place where we can stay
In this moment, come what may
${songTitle}, here to stay

[Verse 2]
Memories of yesterday
Hoping they won't fade away
In my heart, you'll always stay
${songTitle}, light my way

[Chorus]
Oh ${songTitle}, take me away
To a place where we can stay
In this moment, come what may
${songTitle}, here to stay

[Bridge]
Time moves on, but we remain
Through the joy and through the pain
${songTitle}, say my name
Nothing will ever be the same

[Outro]
${songTitle}, forever more
That's what I've been waiting for`;
}

/**
 * Create placeholder audio file
 */
async function createPlaceholderAudio(filename: string): Promise<void> {
  const audioDir = path.join(process.cwd(), 'uploads', 'audio');
  const filepath = path.join(audioDir, filename);

  // Create empty placeholder file (in production, this would be actual audio)
  await fs.promises.writeFile(filepath, '');
}

/**
 * Create placeholder artwork file
 */
async function createPlaceholderArtwork(filename: string): Promise<void> {
  const artworkDir = path.join(process.cwd(), 'uploads', 'artwork');
  const filepath = path.join(artworkDir, filename);

  // Create empty placeholder file (in production, this would be actual image)
  await fs.promises.writeFile(filepath, '');
}

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

/**
 * Clear all existing data
 */
async function clearDatabase() {
  console.log('Clearing existing data...');

  // Delete in correct order due to foreign key constraints
  await prisma.cartItem.deleteMany({});
  await prisma.songArtist.deleteMany({});
  await prisma.albumArtist.deleteMany({});
  await prisma.song.deleteMany({});
  await prisma.album.deleteMany({});
  await prisma.artist.deleteMany({});

  console.log('Database cleared successfully.');
}

/**
 * Seed artists
 */
async function seedArtists() {
  console.log('Seeding artists...');

  const artists = [];

  for (const artistData of ARTISTS_DATA) {
    const artist = await prisma.artist.create({
      data: {
        name: artistData.name,
        bio: artistData.bio,
        profileImageUrl: `/uploads/artwork/artist-${artistData.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      },
    });
    artists.push(artist);
    console.log(`  Created artist: ${artist.name}`);
  }

  console.log(`Created ${artists.length} artists.`);
  return artists;
}

/**
 * Seed albums with relationships
 */
async function seedAlbums(artists: any[]) {
  console.log('Seeding albums...');

  const albums = [];

  for (const albumData of ALBUMS_DATA) {
    const artist = artists[albumData.artistIndex];
    const releaseDate = generateReleaseDate(albumData.year);
    const artworkFilename = `album-${artist.name.toLowerCase().replace(/\s+/g, '-')}-${albumData.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;

    // Create placeholder artwork
    await createPlaceholderArtwork(artworkFilename);

    const album = await prisma.album.create({
      data: {
        title: albumData.title,
        artworkUrl: `/uploads/artwork/${artworkFilename}`,
        releaseDate,
        genre: albumData.genre,
        description: albumData.description,
        price: 0.00,
        totalDurationSeconds: 0, // Will be calculated after songs are created
      },
    });
    albums.push({ ...album, trackCount: albumData.trackCount, artistIndex: albumData.artistIndex, featured: albumData.featured });

    // Create primary artist relationship
    await prisma.albumArtist.create({
      data: {
        albumId: album.id,
        artistId: artist.id,
        role: ArtistRole.primary,
      },
    });

    // Create featured artist relationships if any
    if (albumData.featured) {
      for (const featuredIndex of albumData.featured) {
        await prisma.albumArtist.create({
          data: {
            albumId: album.id,
            artistId: artists[featuredIndex].id,
            role: ArtistRole.featured,
          },
        });
      }
    }

    console.log(`  Created album: ${album.title} by ${artist.name}`);
  }

  console.log(`Created ${albums.length} albums.`);
  return albums;
}

/**
 * Seed songs with relationships
 */
async function seedSongs(albums: any[], artists: any[]) {
  console.log('Seeding songs...');

  let totalSongs = 0;

  for (const albumData of albums) {
    const album = await prisma.album.findUnique({ where: { id: albumData.id } });
    if (!album) continue;

    const artist = artists[albumData.artistIndex];
    let albumTotalDuration = 0;

    // Create songs for this album
    for (let trackNum = 1; trackNum <= albumData.trackCount; trackNum++) {
      const songTitle = generateSongTitle(trackNum, album.title, albumData.trackCount);
      const duration = generateDuration();
      const lyrics = generateLyrics(songTitle);
      const audioFilename = `song-${album.id}-track-${trackNum}.mp3`;

      // Create placeholder audio file
      await createPlaceholderAudio(audioFilename);

      const song = await prisma.song.create({
        data: {
          title: songTitle,
          albumId: album.id,
          trackNumber: trackNum,
          durationSeconds: duration,
          audioFileUrl: `/uploads/audio/${audioFilename}`,
          genre: album.genre,
          releaseDate: album.releaseDate,
          description: trackNum === 1 ? `Opening track from ${album.title}` : null,
          lyrics,
          price: 0.00,
        },
      });

      albumTotalDuration += duration;
      totalSongs++;

      // Create primary artist relationship
      await prisma.songArtist.create({
        data: {
          songId: song.id,
          artistId: artist.id,
          role: SongArtistRole.primary,
        },
      });

      // Randomly add featured artists, producers, songwriters
      if (Math.random() > 0.8 && albumData.featured) {
        const featuredArtist = artists[albumData.featured[0]];
        await prisma.songArtist.create({
          data: {
            songId: song.id,
            artistId: featuredArtist.id,
            role: SongArtistRole.featured,
          },
        });
      }

      // Randomly add producer credits
      if (Math.random() > 0.7) {
        const producerIndex = Math.floor(Math.random() * artists.length);
        const producer = artists[producerIndex];

        // Check if relationship already exists
        const existing = await prisma.songArtist.findUnique({
          where: {
            songId_artistId_role: {
              songId: song.id,
              artistId: producer.id,
              role: SongArtistRole.producer,
            },
          },
        });

        if (!existing && producer.id !== artist.id) {
          await prisma.songArtist.create({
            data: {
              songId: song.id,
              artistId: producer.id,
              role: SongArtistRole.producer,
            },
          });
        }
      }
    }

    // Update album total duration
    await prisma.album.update({
      where: { id: album.id },
      data: { totalDurationSeconds: albumTotalDuration },
    });

    console.log(`  Created ${albumData.trackCount} songs for album: ${album.title}`);
  }

  // Create some standalone singles (no album)
  console.log('Creating standalone singles...');
  const singlesCount = 10;

  for (let i = 0; i < singlesCount; i++) {
    const artistIndex = Math.floor(Math.random() * artists.length);
    const artist = artists[artistIndex];
    const songTitle = `${SONG_TITLE_TEMPLATES[Math.floor(Math.random() * SONG_TITLE_TEMPLATES.length)]} (Single)`;
    const duration = generateDuration();
    const audioFilename = `single-${artist.id}-${i}.mp3`;

    await createPlaceholderAudio(audioFilename);

    const song = await prisma.song.create({
      data: {
        title: songTitle,
        albumId: null,
        trackNumber: null,
        durationSeconds: duration,
        audioFileUrl: `/uploads/audio/${audioFilename}`,
        genre: ARTISTS_DATA[artistIndex].genre,
        releaseDate: generateReleaseDate(2024),
        description: 'Standalone single release',
        lyrics: generateLyrics(songTitle),
        price: 0.00,
      },
    });

    await prisma.songArtist.create({
      data: {
        songId: song.id,
        artistId: artist.id,
        role: SongArtistRole.primary,
      },
    });

    totalSongs++;
  }

  console.log(`Created ${singlesCount} standalone singles.`);
  console.log(`Total songs created: ${totalSongs}`);
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data
    await clearDatabase();
    console.log('');

    // Seed artists
    const artists = await seedArtists();
    console.log('');

    // Seed albums
    const albums = await seedAlbums(artists);
    console.log('');

    // Seed songs
    await seedSongs(albums, artists);
    console.log('');

    // Display summary
    const artistCount = await prisma.artist.count();
    const albumCount = await prisma.album.count();
    const songCount = await prisma.song.count();
    const albumArtistCount = await prisma.albumArtist.count();
    const songArtistCount = await prisma.songArtist.count();

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Artists: ${artistCount}`);
    console.log(`  - Albums: ${albumCount}`);
    console.log(`  - Songs: ${songCount}`);
    console.log(`  - Album-Artist relationships: ${albumArtistCount}`);
    console.log(`  - Song-Artist relationships: ${songArtistCount}`);
    console.log('');
    console.log('🎵 You can now run the application and browse the music catalog!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
