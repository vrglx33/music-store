# Specification: Album Service Unit Tests

## Goal
Create comprehensive unit tests for the album service to verify data retrieval, formatting, and error handling without database dependencies.

## User Stories
- As a developer, I want to run fast unit tests for the album service so that I can verify business logic without a database connection
- As a team member, I want clear test documentation so that I understand the expected behavior of the album service
- As a developer, I want to catch regressions early so that refactoring is safe and confident

## Core Requirements
- Test all public methods in AlbumService class
- Test private formatting method behavior through public method calls
- Mock Prisma client to eliminate database dependencies
- Verify correct data transformations and calculations
- Handle edge cases for null values, empty arrays, and missing data
- Achieve minimum 80% code coverage
- All tests execute in under 1 second total

## Reusable Components

### Existing Code to Leverage
- **Testing patterns**: Follow structure from `src/server/utils/__tests__/formatters.test.ts` and `src/server/utils/__tests__/validators.test.ts`
  - Use `describe` blocks for logical grouping
  - Clear, descriptive test names with "should" statements
  - Edge case testing in separate test blocks
- **Jest configuration**: Use existing `jest.config.js` server project configuration
  - ts-jest preset already configured
  - Node test environment for server-side tests
  - Test files in `__tests__` directories with `.test.ts` extension
- **Prisma mocking pattern**: Mock the database module using `jest.mock()`
  - Mock `src/server/config/database` module
  - Mock Prisma client methods (findUnique, findMany, etc.)

### New Components Required
- **Mock data factories**: Reusable functions to generate realistic test data
  - Album mock data with nested relations
  - Artist mock data
  - Song/track mock data
  - Prisma Decimal mock values
- **Prisma client type mocks**: Properly typed mock implementations for TypeScript

## Test Scenarios

### 1. getAlbumById - Successful Retrieval
**Test**: Returns properly formatted album with all fields
- Mock Prisma to return complete album data with artists and tracks
- Verify all AlbumDetail fields are present and correctly typed
- Confirm artists array contains correct role mappings
- Confirm tracks array contains all track fields
- Verify totalDuration is sum of all track durations
- Verify price conversion from Decimal to number
- Verify releaseDate formatted as YYYY-MM-DD ISO string

### 2. getAlbumById - Not Found
**Test**: Returns null when album doesn't exist
- Mock Prisma findUnique to return null
- Verify service returns null without throwing error

### 3. Artists Formatting
**Test**: Correctly maps and orders artists with roles
- Mock album with multiple artists (primary, featured, collaborator)
- Verify artists ordered by role: primary first, featured second, collaborator last
- Verify artist data includes id, name, and role fields
- Test with single artist
- Test with multiple artists of same role

### 4. Tracks Formatting
**Test**: Properly structures track data
- Mock album with multiple tracks
- Verify tracks include id, trackNumber, title, duration, audioUrl
- Verify tracks ordered by trackNumber ascending
- Verify duration mapped from durationSeconds field
- Verify audioUrl mapped from audioFileUrl field

### 5. Duration Calculation
**Test**: Accurately sums track durations
- Mock album with tracks having various durations
- Verify totalDuration equals sum of all track.duration values
- Test with single track
- Test with zero tracks (should return 0)
- Test with large duration values

### 6. Data Type Conversions
**Test**: Handles Prisma type conversions correctly
- Mock Prisma Decimal for price field
- Verify Decimal converted to number using parseFloat
- Mock Date object for releaseDate
- Verify Date converted to ISO string and truncated to YYYY-MM-DD format

### 7. Edge Cases
**Test**: Album with zero tracks
- Mock album with empty songs array
- Verify totalDuration is 0
- Verify tracks array is empty but present

**Test**: Album with no artists
- Mock album with empty albumArtists array
- Verify artists array is empty but present
- Verify no errors thrown

**Test**: Album with null optional fields
- Mock album with null artworkUrl and description
- Verify null values preserved in response
- Verify required fields still present

**Test**: Tracks with null trackNumber
- Mock tracks where trackNumber is null
- Verify null trackNumber preserved in response
- Verify sorting still works

## Test File Structure

**Location**: `src/server/services/__tests__/albumService.test.ts`

**Structure**:
```
1. Imports
   - Service and types from albumService
   - Jest utilities

2. Mock setup
   - Mock Prisma client module before imports
   - Create typed mock Prisma instance

3. Test data factories
   - createMockArtist()
   - createMockAlbum()
   - createMockTrack()
   - createMockPrismaDecimal()

4. Test suites
   describe('AlbumService')
     describe('getAlbumById')
       - Successful retrieval tests
       - Not found test
       - Artists formatting tests
       - Tracks formatting tests
       - Duration calculation tests
       - Data conversion tests
       - Edge case tests

5. Cleanup
   - afterEach: Clear all mocks
```

## Mocking Strategy

### Prisma Client Mock
- Use `jest.mock()` to mock `../config/database` module
- Create mock implementation of Prisma client with album.findUnique method
- Return properly typed mock data matching Prisma schema structure

### Mock Data Requirements
- Include all Prisma relation fields (albumArtists, songs)
- Use nested structure matching Prisma include syntax
- Mock Decimal type as object with toString() method
- Mock Date objects for releaseDate field
- Ensure mock data represents realistic database responses

### Type Safety
- Import and use actual AlbumService types for assertions
- Type mock Prisma client methods correctly
- Use TypeScript's type inference for test data

## Technical Approach

### Test Setup Pattern
```typescript
// Mock Prisma before service import
jest.mock('../config/database')

// Import service after mock is established
import { albumService } from '../albumService'

// Access mocked Prisma client
const mockPrisma = require('../config/database').default
```

### Mock Data Factory Pattern
```typescript
// Reusable factory functions for test data
function createMockAlbum(overrides = {}) {
  return {
    id: 'album-123',
    title: 'Test Album',
    // ... other fields with sensible defaults
    ...overrides
  }
}
```

### Assertion Pattern
```typescript
// Verify structure and values
expect(result).toBeDefined()
expect(result).toHaveProperty('id', expectedId)
expect(result.artists).toHaveLength(expectedCount)
expect(result.totalDuration).toBe(expectedSum)
```

### Mock Reset Pattern
```typescript
afterEach(() => {
  jest.clearAllMocks()
})
```

## Success Criteria
- Test file created at `src/server/services/__tests__/albumService.test.ts`
- All public methods (getAlbumById) have test coverage
- All private methods tested through public method calls
- Edge cases tested: zero tracks, no artists, null fields, null trackNumbers
- Mocking strategy successfully isolates service from database
- Tests pass when run with `npm test`
- Tests execute in under 1 second
- Code coverage for albumService.ts meets or exceeds 80%
- No actual database connection or data required to run tests
- All tests have clear, descriptive names explaining what they verify

## Out of Scope
- Integration tests with real database (future enhancement)
- Performance testing with large datasets
- Testing other service methods not yet implemented
- End-to-end testing through API endpoints
- Testing Prisma query generation or optimization
- Mutation methods (create, update, delete) not in current service
