# Task Breakdown: Album Service Unit Tests

## Overview
Total Tasks: 20
Estimated Total Time: 3-4 hours
Target Code Coverage: 80%+

## Task List

### Test Infrastructure Setup

#### Task Group 1: Test File Structure and Mock Configuration
**Dependencies:** None
**Assigned Role:** Test Engineer
**Estimated Time:** 45 minutes
**Complexity:** Medium

- [x] 1.0 Set up test infrastructure
  - [x] 1.1 Create test file at correct location
    - Create `src/server/services/__tests__/albumService.test.ts`
    - Follow existing test file naming convention (`.test.ts` extension)
    - Place in `__tests__` subdirectory as per Jest configuration
  - [x] 1.2 Configure Prisma client mocking
    - Add `jest.mock('../config/database')` before imports
    - Create typed mock Prisma instance with album.findUnique method
    - Follow pattern from existing mocking strategy in codebase
    - Ensure mock is properly typed for TypeScript
  - [x] 1.3 Import required dependencies
    - Import `albumService` from `../albumService`
    - Import type definitions: `AlbumDetail`, `AlbumArtistInfo`, `AlbumTrack`
    - Import Jest utilities (describe, it, expect, beforeEach, afterEach)
    - Access mocked Prisma client: `require('../config/database').default`
  - [x] 1.4 Set up test lifecycle hooks
    - Add `afterEach(() => jest.clearAllMocks())` to reset mock state
    - Ensure clean state between tests for isolation

**Acceptance Criteria:**
- Test file created at `src/server/services/__tests__/albumService.test.ts`
- Prisma client successfully mocked without errors
- All necessary imports present and functional
- Test file compiles without TypeScript errors
- Mock cleanup runs after each test

---

### Mock Data Factories

#### Task Group 2: Reusable Test Data Generation
**Dependencies:** Task Group 1
**Assigned Role:** Test Engineer
**Estimated Time:** 1 hour
**Complexity:** Medium

- [x] 2.0 Create mock data factory functions
  - [x] 2.1 Implement `createMockPrismaDecimal()` factory
    - Return object with `toString()` method returning decimal string
    - Example: `{ toString: () => '19.99' }`
    - Used for mocking Prisma Decimal type for price field
  - [x] 2.2 Implement `createMockArtist()` factory
    - Accept optional overrides parameter
    - Default fields: id, name
    - Return properly typed artist object
    - Example defaults: `{ id: 'artist-1', name: 'Test Artist' }`
  - [x] 2.3 Implement `createMockAlbumArtist()` factory
    - Accept optional overrides parameter
    - Default fields: role, artist (nested object)
    - Support role values: 'primary', 'featured', 'collaborator'
    - Return structure matching Prisma include for albumArtists
  - [x] 2.4 Implement `createMockSong()` factory
    - Accept optional overrides parameter
    - Default fields: id, trackNumber, title, durationSeconds, audioFileUrl
    - Return structure matching Prisma song model
    - Example: `{ id: 'song-1', trackNumber: 1, title: 'Test Track', durationSeconds: 180, audioFileUrl: '/audio/test.mp3' }`
  - [x] 2.5 Implement `createMockAlbum()` factory
    - Accept optional overrides parameter
    - Default fields: id, title, artworkUrl, releaseDate, genre, description, price, albumArtists, songs
    - Use Date object for releaseDate field
    - Use createMockPrismaDecimal() for price
    - Include empty arrays for albumArtists and songs by default
    - Return complete album structure matching Prisma include syntax
  - [x] 2.6 Document factory usage
    - Add JSDoc comments explaining each factory's purpose
    - Document override patterns for common scenarios
    - Include usage examples in comments

**Acceptance Criteria:**
- All 5 factory functions created and properly typed
- Factories accept optional override parameters
- Mock data matches Prisma schema structure
- Factories generate realistic, valid test data
- JSDoc comments explain usage patterns
- Factories are reusable across multiple test cases

---

### Core Functionality Tests

#### Task Group 3: Successful Retrieval and Happy Path Tests
**Dependencies:** Task Groups 1-2
**Assigned Role:** Test Engineer
**Estimated Time:** 1 hour
**Complexity:** Medium

- [x] 3.0 Test successful album retrieval with complete data
  - [x] 3.1 Write test: "should return properly formatted album with all fields"
    - Create mock album with complete data (2 artists, 3 tracks)
    - Mock `prisma.album.findUnique` to return mock album
    - Call `albumService.getAlbumById('album-123')`
    - Verify result is defined and not null
    - Assert all AlbumDetail fields are present: id, title, artworkUrl, releaseDate, genre, description, price, totalDuration, artists, tracks
    - Verify field types match interface definitions
  - [x] 3.2 Write test: "should return null when album does not exist"
    - Mock `prisma.album.findUnique` to return null
    - Call `albumService.getAlbumById('nonexistent-id')`
    - Expect result to be null
    - Verify no errors thrown
  - [x] 3.3 Write test: "should convert Prisma Decimal price to number"
    - Create mock album with Decimal price (using createMockPrismaDecimal)
    - Mock Decimal value of '19.99'
    - Verify returned price is number type: `typeof result.price === 'number'`
    - Verify exact value: `expect(result.price).toBe(19.99)`
  - [x] 3.4 Write test: "should format releaseDate as YYYY-MM-DD ISO string"
    - Create mock album with Date object: `new Date('2024-03-15T12:00:00Z')`
    - Verify returned releaseDate is string type
    - Verify format: `expect(result.releaseDate).toBe('2024-03-15')`
    - Verify no time component included (only date portion)
  - [x] 3.5 Run tests to verify happy path functionality
    - Execute: `npm test -- albumService.test.ts`
    - Verify all 4 tests pass
    - Confirm execution time under 1 second

**Acceptance Criteria:**
- 4 tests written covering core success scenarios
- All tests pass successfully
- Proper assertions for all AlbumDetail fields
- Data type conversions verified (Decimal to number, Date to string)
- Tests execute quickly (< 1 second total)

---

### Artist and Track Formatting Tests

#### Task Group 4: Data Transformation and Ordering Logic
**Dependencies:** Task Groups 1-3
**Assigned Role:** Test Engineer
**Estimated Time:** 1 hour
**Complexity:** Medium

- [x] 4.0 Test artist formatting and ordering
  - [x] 4.1 Write test: "should correctly map artists with roles"
    - Create mock album with single artist (primary role)
    - Verify artists array contains correct fields: id, name, role
    - Verify artist.id matches source data
    - Verify artist.name matches source data
    - Verify artist.role is preserved
  - [x] 4.2 Write test: "should order artists by role (primary, featured, collaborator)"
    - Create mock album with 3 artists: one collaborator, one primary, one featured
    - Mock artists in non-sorted order in source data
    - Verify result.artists[0].role === 'primary'
    - Verify result.artists[1].role === 'featured'
    - Verify result.artists[2].role === 'collaborator'
    - Note: Relies on Prisma orderBy in query, verified through mock data
  - [x] 4.3 Write test: "should handle multiple artists with same role"
    - Create mock album with 2 primary artists
    - Verify both artists included in result
    - Verify both have 'primary' role
    - Verify artists array length is 2
  - [x] 4.4 Write test: "should properly structure track data with all fields"
    - Create mock album with 2 tracks
    - Verify each track has required fields: id, trackNumber, title, duration, audioUrl
    - Verify trackNumber mapped correctly from source
    - Verify title mapped correctly from source
    - Verify duration mapped from durationSeconds field
    - Verify audioUrl mapped from audioFileUrl field
  - [x] 4.5 Write test: "should order tracks by trackNumber ascending"
    - Create mock album with tracks: trackNumber 3, trackNumber 1, trackNumber 2
    - Mock tracks in non-sorted order
    - Verify result.tracks[0].trackNumber === 1
    - Verify result.tracks[1].trackNumber === 2
    - Verify result.tracks[2].trackNumber === 3
    - Note: Relies on Prisma orderBy in query, verified through mock data
  - [x] 4.6 Run tests to verify formatting logic
    - Execute: `npm test -- albumService.test.ts`
    - Verify all 5 new tests pass (9 total)
    - Check for any type errors or assertion failures

**Acceptance Criteria:**
- 5 tests written covering artist and track formatting
- Artist role ordering verified
- Track field mapping verified (durationSeconds to duration, audioFileUrl to audioUrl)
- Track ordering by trackNumber verified
- All tests pass successfully

---

### Duration Calculation Tests

#### Task Group 5: Aggregation Logic Verification
**Dependencies:** Task Groups 1-4
**Assigned Role:** Test Engineer
**Estimated Time:** 30 minutes
**Complexity:** Low

- [x] 5.0 Test duration calculation accuracy
  - [x] 5.1 Write test: "should calculate totalDuration as sum of all track durations"
    - Create mock album with 3 tracks: durations 180, 240, 195
    - Verify totalDuration === 615 (180 + 240 + 195)
    - Use precise equality assertion
  - [x] 5.2 Write test: "should return totalDuration of 0 for album with no tracks"
    - Create mock album with empty songs array
    - Verify totalDuration === 0
    - Ensure no errors thrown
  - [x] 5.3 Write test: "should handle album with single track"
    - Create mock album with 1 track: duration 210
    - Verify totalDuration === 210
    - Verify calculation works for edge case
  - [x] 5.4 Write test: "should handle large duration values"
    - Create mock album with tracks: durations 3600, 4200, 5000
    - Verify totalDuration === 12800
    - Ensure no overflow or precision issues
  - [x] 5.5 Run tests to verify calculation logic
    - Execute: `npm test -- albumService.test.ts`
    - Verify all 4 new tests pass (13 total)
    - Confirm accurate arithmetic across all scenarios

**Acceptance Criteria:**
- 4 tests written covering duration calculation scenarios
- Sum calculation verified for multiple tracks
- Edge cases tested: 0 tracks, 1 track, large values
- All tests pass with correct arithmetic
- No precision or overflow issues

---

### Edge Cases and Error Handling Tests

#### Task Group 6: Null Values, Empty Data, and Boundary Conditions
**Dependencies:** Task Groups 1-5
**Assigned Role:** Test Engineer
**Estimated Time:** 45 minutes
**Complexity:** Medium

- [x] 6.0 Test edge cases and boundary conditions
  - [x] 6.1 Write test: "should handle album with no artists"
    - Create mock album with empty albumArtists array
    - Verify result.artists is an empty array (not null or undefined)
    - Verify result.artists.length === 0
    - Verify no errors thrown
  - [x] 6.2 Write test: "should preserve null values for optional fields"
    - Create mock album with null artworkUrl and null description
    - Verify result.artworkUrl === null (not converted to empty string)
    - Verify result.description === null
    - Verify required fields still present and valid
  - [x] 6.3 Write test: "should handle tracks with null trackNumber"
    - Create mock album with track where trackNumber is null
    - Verify result.tracks[0].trackNumber === null
    - Verify null value preserved in output
    - Verify no errors during transformation
  - [x] 6.4 Write test: "should handle album with both empty artists and tracks"
    - Create mock album with empty albumArtists and empty songs arrays
    - Verify result.artists is empty array
    - Verify result.tracks is empty array
    - Verify totalDuration === 0
    - Verify other fields still valid
  - [x] 6.5 Write test: "should handle tracks with special characters in title"
    - Create mock track with title containing quotes, ampersands, unicode
    - Example: `"Song \"Name\" & More ♪♫"`
    - Verify title preserved exactly as input
    - Verify no encoding or escaping issues
  - [x] 6.6 Run edge case tests
    - Execute: `npm test -- albumService.test.ts`
    - Verify all 5 new tests pass (18 total)
    - Confirm robust handling of edge cases

**Acceptance Criteria:**
- 5 tests written covering edge cases
- Null value handling verified for optional fields
- Empty array handling verified for artists and tracks
- Special character handling verified
- All edge case tests pass without errors

---

### Final Verification and Coverage

#### Task Group 7: Test Suite Validation and Coverage Analysis
**Dependencies:** Task Groups 1-6
**Assigned Role:** Test Engineer
**Estimated Time:** 30 minutes
**Complexity:** Low

- [x] 7.0 Validate complete test suite
  - [x] 7.1 Run full test suite
    - Execute: `npm test -- albumService.test.ts`
    - Verify all 18 tests pass
    - Confirm total execution time under 1 second
    - Check for any console warnings or errors
  - [x] 7.2 Generate and analyze code coverage report
    - Execute: `npm test -- --coverage albumService.test.ts`
    - Verify albumService.ts coverage >= 80%
    - Check line coverage, branch coverage, function coverage
    - Identify any untested code paths (if coverage < 80%)
  - [x] 7.3 Review test organization and naming
    - Verify all tests use clear, descriptive names with "should" statements
    - Verify logical grouping with describe blocks
    - Ensure consistent formatting and style
    - Check that test names accurately describe what they verify
  - [x] 7.4 Verify mock isolation
    - Confirm all tests use mocked Prisma client
    - Verify no actual database connections attempted
    - Check that mocks are properly reset between tests
    - Ensure tests can run in any order without dependencies
  - [x] 7.5 Document test suite
    - Add file-level JSDoc comment explaining test scope
    - Document any setup requirements or assumptions
    - Note any limitations or future test expansion areas
    - Add comments for complex test scenarios

**Acceptance Criteria:**
- All 18 tests pass successfully
- Test suite executes in under 1 second
- Code coverage for albumService.ts >= 80%
- Tests properly isolated with no database dependencies
- Clear, descriptive test names following "should" convention
- Test file properly documented

---

## Execution Order

Recommended implementation sequence:
1. **Test Infrastructure Setup** (Task Group 1) - 45 minutes
2. **Mock Data Factories** (Task Group 2) - 1 hour
3. **Core Functionality Tests** (Task Group 3) - 1 hour
4. **Artist and Track Formatting Tests** (Task Group 4) - 1 hour
5. **Duration Calculation Tests** (Task Group 5) - 30 minutes
6. **Edge Cases and Error Handling Tests** (Task Group 6) - 45 minutes
7. **Final Verification and Coverage** (Task Group 7) - 30 minutes

**Total Estimated Time:** 3-4 hours

---

## Test Coverage Targets

### Methods Under Test
- **Public Methods:**
  - `getAlbumById(id: string): Promise<AlbumDetail | null>`

- **Private Methods (tested through public methods):**
  - `formatAlbumDetail(album: any): AlbumDetail`

### Coverage Goals
- **Line Coverage:** >= 80%
- **Branch Coverage:** >= 80%
- **Function Coverage:** 100% (both methods)
- **Statement Coverage:** >= 80%

### Test Distribution
- Successful retrieval: 4 tests
- Artist formatting: 3 tests
- Track formatting: 2 tests
- Duration calculation: 4 tests
- Edge cases: 5 tests
- **Total: 18 focused tests**

---

## Important Constraints

- **No Database Dependencies:** All tests must use mocked Prisma client
- **Fast Execution:** Total test suite must run in under 1 second
- **Type Safety:** All mock data must be properly typed for TypeScript
- **Test Isolation:** Each test must be independent and not affect others
- **Clear Naming:** Test names must clearly describe what they verify
- **Reusable Mocks:** Factory functions should be DRY and reusable
- **Follow Existing Patterns:** Align with test structure in `src/server/utils/__tests__/formatters.test.ts`

---

## Success Metrics

- [x] Test file created at `src/server/services/__tests__/albumService.test.ts`
- [x] 18 focused tests written covering all requirements
- [x] All tests pass when run with `npm test`
- [x] Test suite executes in under 1 second
- [x] Code coverage for albumService.ts >= 80%
- [x] No actual database connections required
- [x] All tests have clear, descriptive names
- [x] Mock data factories are reusable and well-typed
- [x] Tests follow existing codebase patterns and conventions
- [x] TypeScript compiles without errors
- [x] All edge cases handled gracefully

---

## Notes

- **Mocking Strategy:** Use `jest.mock('../config/database')` to mock Prisma client module before importing the service
- **Test Data Pattern:** Create factory functions for reusable mock data generation
- **Assertion Style:** Use Jest's `expect` API with clear, specific assertions
- **Test Structure:** Follow existing pattern from `formatters.test.ts` with describe blocks and "should" statements
- **TypeScript:** Ensure all mocks and test data are properly typed to catch type errors early
- **Coverage Focus:** Prioritize testing business logic (formatting, calculations, transformations) over simple getters/setters
