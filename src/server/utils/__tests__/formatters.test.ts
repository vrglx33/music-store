/**
 * Tests for formatting utilities
 */

import { formatDuration, formatDate, formatPrice } from '../formatters';

describe('formatDuration', () => {
  it('should format seconds to mm:ss format', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(45)).toBe('0:45');
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(245)).toBe('4:05');
    expect(formatDuration(3661)).toBe('61:01');
  });

  it('should handle edge cases', () => {
    expect(formatDuration(-10)).toBe('0:00');
    expect(formatDuration(Infinity)).toBe('0:00');
    expect(formatDuration(NaN)).toBe('0:00');
  });
});

describe('formatDate', () => {
  it('should format Date objects to readable strings', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const formatted = formatDate(date);
    expect(formatted).toContain('January');
    expect(formatted).toContain('2024');
  });

  it('should format ISO strings to readable strings', () => {
    const formatted = formatDate('2024-01-15T12:00:00Z');
    expect(formatted).toContain('January');
    expect(formatted).toContain('2024');
  });

  it('should handle invalid dates', () => {
    expect(formatDate('invalid')).toBe('');
    expect(formatDate(new Date('invalid'))).toBe('');
  });
});

describe('formatPrice', () => {
  it('should format prices to USD currency', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(9.99)).toBe('$9.99');
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('should handle edge cases', () => {
    expect(formatPrice(-10)).toBe('$0.00');
    expect(formatPrice(Infinity)).toBe('$0.00');
    expect(formatPrice(NaN)).toBe('$0.00');
  });
});
