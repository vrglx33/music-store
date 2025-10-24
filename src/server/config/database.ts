/**
 * Database Configuration
 * Prisma client setup with singleton pattern and connection management
 */

import { PrismaClient } from '@prisma/client';

// Global instance to prevent multiple Prisma Client instances in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prisma client logging configuration
const logConfig =
  process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'];

// Create Prisma Client instance with logging
const prisma =
  global.prisma ||
  new PrismaClient({
    log: logConfig as any,
    errorFormat: 'pretty',
  });

// Store instance in global for development hot reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Connect to database
 * Establishes connection with error handling
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection error:', error);
    throw error;
  }
}

/**
 * Disconnect from database
 * Gracefully closes database connection
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✓ Database disconnected successfully');
  } catch (error) {
    console.error('✗ Database disconnection error:', error);
    throw error;
  }
}

/**
 * Health check for database connection
 * Returns true if database is accessible
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Export Prisma client instance
export default prisma;
