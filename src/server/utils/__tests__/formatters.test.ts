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

  it('should correctly round prices without double-rounding', () => {
    // Test cases that would fail with double-rounding bug
    // 9.995 should round to $10.00 (not $9.99 from double rounding)
    expect(formatPrice(9.995)).toBe('$10.00');
    
    // 9.996 should round to $10.00
    expect(formatPrice(9.996)).toBe('$10.00');
    
    // 9.994 should round to $9.99
    expect(formatPrice(9.994)).toBe('$9.99');
    
    // 9.991 should round to $9.99
    expect(formatPrice(9.991)).toBe('$9.99');
    
    // 1.005 should round to $1.01 (not $1.00 from double rounding)
    expect(formatPrice(1.005)).toBe('$1.01');
    
    // 1.004 should round to $1.00
    expect(formatPrice(1.004)).toBe('$1.00');
    
    // 99.995 should round to $100.00
    expect(formatPrice(99.995)).toBe('$100.00');
    
    // Verify standard rounding still works
    expect(formatPrice(19.999)).toBe('$20.00');
    expect(formatPrice(19.99)).toBe('$19.99');
    expect(formatPrice(19.9)).toBe('$19.90');
  });
});
