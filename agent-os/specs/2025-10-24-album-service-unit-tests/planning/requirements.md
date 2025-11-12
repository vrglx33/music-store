# Requirements: Album Service Unit Tests

## Problem Statement
The album service at `src/server/services/albumService.ts` has no unit tests, leaving critical business logic untested and vulnerable to regressions.

## Goals
Create comprehensive unit tests for the album service that:
- Verify correct data retrieval and formatting
- Handle edge cases and error scenarios
- Provide confidence in refactoring and future changes
- Serve as documentation for expected behavior

## Current Implementation

### AlbumService Methods
**Public Methods:**
- `getAlbumById(id: string): Promise<AlbumDetail | null>` - Retrieves album with full details including artists and tracks

**Private Methods:**
- `formatAlbumDetail(album: any): AlbumDetail` - Transforms raw Prisma data to clean response format

### Key Behaviors
- Fetches album with nested relations (albumArtists, songs)
- Orders artists by role (primary → featured → collaborator)
- Orders songs by track number
- Calculates total duration from all tracks
- Converts Prisma Decimal price to number
- Formats release date as ISO date string (YYYY-MM-DD)
- Returns null for non-existent albums

## Test Requirements

### Core Test Cases
1. **Successful retrieval** - Returns properly formatted album with all fields
2. **Not found** - Returns null when album doesn't exist
3. **Artists formatting** - Correctly maps artists with roles
4. **Tracks formatting** - Properly structures track data with all fields
5. **Duration calculation** - Sums track durations accurately
6. **Data type conversions** - Handles Decimal to number, Date to string

### Edge Cases
- Album with zero tracks
- Album with no artists
- Album with null optional fields (artworkUrl, description)
- Multiple artists with same role
- Tracks without track numbers (null handling)

## Technical Requirements

### Testing Stack
- Jest framework (already configured)
- Mock Prisma client using `jest.mock()`
- TypeScript for type safety
- Follow existing test patterns in codebase

### Test Structure
- Location: `src/server/services/__tests__/albumService.test.ts`
- Use `describe` blocks for logical grouping
- Clear test names describing expected behavior
- Setup/teardown with beforeEach/afterEach
- Mock data factories for reusable test fixtures

### Quality Standards
- Code coverage ≥ 80%
- All tests pass independently
- Fast execution (< 1 second)
- No database dependencies
- Clear assertion messages

## Success Criteria
✅ Test file created at correct location
✅ All public methods have test coverage
✅ Edge cases are tested
✅ Tests pass with `npm test`
✅ Mocking strategy works correctly
✅ Code coverage meets threshold
