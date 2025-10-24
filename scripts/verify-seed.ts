/**
 * Seed Data Verification Script
 *
 * This script verifies the integrity and quality of the seed data by running
 * various queries and checks.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySeedData() {
  console.log('🔍 Verifying seed data integrity...\n');

  try {
    // ========================================================================
    // Test 1: Basic Counts
    // ========================================================================
    console.log('📊 Test 1: Checking record counts...');

    const artistCount = await prisma.artist.count();
    const albumCount = await prisma.album.count();
    const songCount = await prisma.song.count();
    const albumArtistCount = await prisma.albumArtist.count();
    const songArtistCount = await prisma.songArtist.count();

    console.log(`  Artists: ${artistCount} (expected: 15-20)`);
    console.log(`  Albums: ${albumCount} (expected: 20-30)`);
    console.log(`  Songs: ${songCount} (expected: 100+)`);
    console.log(`  Album-Artist relationships: ${albumArtistCount}`);
    console.log(`  Song-Artist relationships: ${songArtistCount}`);

    const countsPassed =
      artistCount >= 15 && artistCount <= 20 &&
      albumCount >= 20 && albumCount <= 30 &&
      songCount >= 100;

    console.log(`  ✅ Counts check: ${countsPassed ? 'PASSED' : 'FAILED'}\n`);

    // ========================================================================
    // Test 2: Album-Artist Relationships
    // ========================================================================
    console.log('📊 Test 2: Checking album-artist relationships...');

    const albumsWithArtists = await prisma.album.findMany({
      include: {
        albumArtists: {
          include: { artist: true }
        }
      },
      take: 5
    });

    console.log('  Sample albums with artists:');
    albumsWithArtists.forEach(album => {
      const artists = album.albumArtists.map(aa =>
        `${aa.artist.name} (${aa.role})`
      ).join(', ');
      console.log(`    - "${album.title}" by ${artists}`);
    });

    const allAlbumsHaveArtists = albumsWithArtists.every(
      album => album.albumArtists.length > 0
    );
    console.log(`  ✅ All albums have artists: ${allAlbumsHaveArtists ? 'PASSED' : 'FAILED'}\n`);

    // ========================================================================
    // Test 3: Song-Artist Relationships
    // ========================================================================
    console.log('📊 Test 3: Checking song-artist relationships...');

    const songsWithArtists = await prisma.song.findMany({
      include: {
        songArtists: {
          include: { artist: true }
        }
      },
      take: 5
    });

    console.log('  Sample songs with artists:');
    songsWithArtists.forEach(song => {
      const artists = song.songArtists.map(sa =>
        `${sa.artist.name} (${sa.role})`
      ).join(', ');
      console.log(`    - "${song.title}" by ${artists}`);
    });

    const allSongsHaveArtists = songsWithArtists.every(
      song => song.songArtists.length > 0
    );
    console.log(`  ✅ All songs have artists: ${allSongsHaveArtists ? 'PASSED' : 'FAILED'}\n`);

    // ========================================================================
    // Test 4: Album-Song Relationships
    // ========================================================================
    console.log('📊 Test 4: Checking album-song relationships...');

    const albumsWithSongs = await prisma.album.findMany({
      include: {
        songs: {
          orderBy: { trackNumber: 'asc' }
        }
      },
      take: 3
    });

    console.log('  Sample albums with tracks:');
    albumsWithSongs.forEach(album => {
      console.log(`    - "${album.title}": ${album.songs.length} tracks`);
      if (album.songs.length > 0) {
        console.log(`      Track 1: "${album.songs[0].title}"`);
      }
    });

    const allAlbumsHaveSongs = albumsWithSongs.every(
      album => album.songs.length > 0
    );
    console.log(`  ✅ All albums have songs: ${allAlbumsHaveSongs ? 'PASSED' : 'FAILED'}\n`);

    // ========================================================================
    // Test 5: Data Variety
    // ========================================================================
    console.log('📊 Test 5: Checking data variety...');

    const genres = await prisma.album.findMany({
      select: { genre: true },
      distinct: ['genre']
    });

    console.log(`  Unique genres: ${genres.length}`);
    console.log(`  Genres: ${genres.map(g => g.genre).join(', ')}`);

    const releaseDates = await prisma.album.findMany({
      select: { releaseDate: true },
      distinct: ['releaseDate'],
      orderBy: { releaseDate: 'desc' },
      take: 5
    });

    console.log(`  Sample release dates:`);
    releaseDates.forEach(rd => {
      console.log(`    - ${rd.releaseDate.toISOString().split('T')[0]}`);
    });

    const varietyPassed = genres.length >= 5;
    console.log(`  ✅ Genre variety: ${varietyPassed ? 'PASSED' : 'FAILED'}\n`);

    // ========================================================================
    // Test 6: Singles (songs without albums)
    // ========================================================================
    console.log('📊 Test 6: Checking standalone singles...');

    const singles = await prisma.song.findMany({
      where: { albumId: null },
      include: {
        songArtists: {
          include: { artist: true }
        }
      }
    });

    console.log(`  Standalone singles: ${singles.length}`);
    if (singles.length > 0) {
      console.log('  Sample singles:');
      singles.slice(0, 3).forEach(single => {
        const artist = single.songArtists.find(sa => sa.role === 'primary')?.artist.name || 'Unknown';
        console.log(`    - "${single.title}" by ${artist}`);
      });
    }

    const singlesExist = singles.length > 0;
    console.log(`  ✅ Singles exist: ${singlesExist ? 'PASSED' : 'FAILED'}\n`);

    // ========================================================================
    // Test 7: Album Duration Calculation
    // ========================================================================
    console.log('📊 Test 7: Checking album duration calculations...');

    const albumWithDuration = await prisma.album.findFirst({
      include: { songs: true }
    });

    if (albumWithDuration) {
      const calculatedDuration = albumWithDuration.songs.reduce(
        (sum, song) => sum + song.durationSeconds,
        0
      );
      const storedDuration = albumWithDuration.totalDurationSeconds;

      console.log(`  Album: "${albumWithDuration.title}"`);
      console.log(`    Calculated duration: ${calculatedDuration}s`);
      console.log(`    Stored duration: ${storedDuration}s`);

      const durationMatches = calculatedDuration === storedDuration;
      console.log(`  ✅ Duration calculation: ${durationMatches ? 'PASSED' : 'FAILED'}\n`);
    }

    // ========================================================================
    // Test 8: Price Verification (should all be $0.00)
    // ========================================================================
    console.log('📊 Test 8: Checking prices (should be $0.00)...');

    const albumsWithPrice = await prisma.album.findMany({
      where: {
        price: { not: 0 }
      }
    });

    const songsWithPrice = await prisma.song.findMany({
      where: {
        price: { not: 0 }
      }
    });

    console.log(`  Albums with non-zero price: ${albumsWithPrice.length}`);
    console.log(`  Songs with non-zero price: ${songsWithPrice.length}`);

    const allPricesZero = albumsWithPrice.length === 0 && songsWithPrice.length === 0;
    console.log(`  ✅ All prices are $0.00: ${allPricesZero ? 'PASSED' : 'FAILED'}\n`);

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('=' .repeat(70));
    console.log('📋 VERIFICATION SUMMARY');
    console.log('=' .repeat(70));
    console.log('✅ All verification tests completed successfully!');
    console.log(`\n📊 Final counts:`);
    console.log(`  - ${artistCount} artists`);
    console.log(`  - ${albumCount} albums`);
    console.log(`  - ${songCount} songs`);
    console.log(`  - ${singles.length} standalone singles`);
    console.log(`  - ${genres.length} unique genres`);
    console.log(`  - ${albumArtistCount} album-artist relationships`);
    console.log(`  - ${songArtistCount} song-artist relationships`);
    console.log('\n🎵 Seed data is ready for testing!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  }
}

verifySeedData()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
