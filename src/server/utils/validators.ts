/**
 * Validation utility functions
 */

import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_PAGE,
} from '../../shared/constants/pagination';

/**
 * UUID v4 regex pattern
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validate UUID format
 * @param id - String to validate as UUID
 * @returns True if valid UUID, false otherwise
 */
export function validateUUID(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  return UUID_REGEX.test(id);
}

/**
 * Allowed sort options for catalog
 */
const ALLOWED_SORT_OPTIONS = ['newest', 'artist', 'title'] as const;
export type SortOption = (typeof ALLOWED_SORT_OPTIONS)[number];

/**
 * Validate sort option
 * @param sort - Sort option string
 * @returns Valid sort option or default
 */
export function validateSortOption(sort: unknown): SortOption {
  if (
    typeof sort === 'string' &&
    ALLOWED_SORT_OPTIONS.includes(sort as SortOption)
  ) {
    return sort as SortOption;
  }

  return 'newest';
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Validate and normalize pagination parameters
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @returns Validated pagination parameters
 */
export function validatePaginationParams(
  page: unknown,
  limit: unknown
): PaginationParams {
  let validatedPage = DEFAULT_PAGE;
  let validatedLimit = DEFAULT_PAGE_SIZE;

  // Validate page
  if (typeof page === 'number' && Number.isInteger(page) && page > 0) {
    validatedPage = page;
  } else if (typeof page === 'string') {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed) && parsed > 0) {
      validatedPage = parsed;
    }
  }

  // Validate limit
  if (typeof limit === 'number' && Number.isInteger(limit) && limit > 0) {
    validatedLimit = Math.min(limit, MAX_PAGE_SIZE);
  } else if (typeof limit === 'string') {
    const parsed = parseInt(limit, 10);
    if (!isNaN(parsed) && parsed > 0) {
      validatedLimit = Math.min(parsed, MAX_PAGE_SIZE);
    }
  }

  return {
    page: validatedPage,
    limit: validatedLimit,
  };
}
