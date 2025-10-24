/**
 * Test Setup
 * Global configuration for Jest tests
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';

// Mock uuid module to avoid ESM issues in Jest
jest.mock('uuid', () => ({
  validate: (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));
