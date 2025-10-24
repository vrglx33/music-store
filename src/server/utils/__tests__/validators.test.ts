/**
 * Tests for validation utilities
 */

import {
  validateUUID,
  validateSortOption,
  validatePaginationParams,
} from '../validators';

describe('validateUUID', () => {
  it('should validate correct UUIDs', () => {
    expect(validateUUID('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should reject invalid UUIDs', () => {
    expect(validateUUID('invalid')).toBe(false);
    expect(validateUUID('123-456-789')).toBe(false);
    expect(validateUUID('')).toBe(false);
    expect(validateUUID('123e4567-e89b-12d3-a456')).toBe(false);
  });

  it('should handle non-string inputs', () => {
    expect(validateUUID(null as unknown as string)).toBe(false);
    expect(validateUUID(undefined as unknown as string)).toBe(false);
    expect(validateUUID(123 as unknown as string)).toBe(false);
  });
});

describe('validateSortOption', () => {
  it('should validate allowed sort options', () => {
    expect(validateSortOption('newest')).toBe('newest');
    expect(validateSortOption('artist')).toBe('artist');
    expect(validateSortOption('title')).toBe('title');
  });

  it('should return default for invalid options', () => {
    expect(validateSortOption('invalid')).toBe('newest');
    expect(validateSortOption('')).toBe('newest');
    expect(validateSortOption(null)).toBe('newest');
    expect(validateSortOption(undefined)).toBe('newest');
    expect(validateSortOption(123)).toBe('newest');
  });
});

describe('validatePaginationParams', () => {
  it('should validate correct pagination parameters', () => {
    const result = validatePaginationParams(1, 24);
    expect(result).toEqual({ page: 1, limit: 24 });
  });

  it('should parse string inputs', () => {
    const result = validatePaginationParams('2', '50');
    expect(result).toEqual({ page: 2, limit: 50 });
  });

  it('should enforce max limit', () => {
    const result = validatePaginationParams(1, 200);
    expect(result.limit).toBe(100);
  });

  it('should use defaults for invalid inputs', () => {
    const result = validatePaginationParams('invalid', 'invalid');
    expect(result).toEqual({ page: 1, limit: 24 });
  });

  it('should reject negative values', () => {
    const result = validatePaginationParams(-1, -10);
    expect(result).toEqual({ page: 1, limit: 24 });
  });
});
