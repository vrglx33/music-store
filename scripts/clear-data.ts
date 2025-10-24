/**
 * Clear Data Script
 *
 * This script clears all data from the database while preserving the schema.
 * Useful for starting fresh without re-running migrations.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
  console.log('🗑️  Clearing all data from database...\n');

  try {
    // Delete in correct order due to foreign key constraints
    console.log('Deleting cart items...');
    await prisma.cartItem.deleteMany({});

    console.log('Deleting song-artist relationships...');
    await prisma.songArtist.deleteMany({});

    console.log('Deleting album-artist relationships...');
    await prisma.albumArtist.deleteMany({});

    console.log('Deleting songs...');
    await prisma.song.deleteMany({});

    console.log('Deleting albums...');
    await prisma.album.deleteMany({});

    console.log('Deleting artists...');
    await prisma.artist.deleteMany({});

    console.log('Deleting sessions...');
    await prisma.session.deleteMany({});

    console.log('\n✅ All data cleared successfully!');
    console.log('💡 Run "npm run prisma:seed" to generate new seed data.');

  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

clearData()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
