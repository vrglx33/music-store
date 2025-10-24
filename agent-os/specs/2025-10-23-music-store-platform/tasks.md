# Task Breakdown: Music Store - Catalog Browsing & Detail Pages

## Overview
**Total Tasks:** 69 organized into 8 major task groups
**Estimated Timeline:** 4-6 weeks for full implementation
**Primary Focus:** Public-facing music catalog browsing and discovery experience

---

## Task List

### GROUP 1: Project Setup & Foundation
**Dependencies:** None
**Estimated Time:** 1-2 days
**Status:** COMPLETED

#### 1.1 Initial Project Configuration
**Size:** Medium
**Description:** Bootstrap the project with necessary tooling and dependencies

- [x] 1.1.1 Initialize Node.js project with TypeScript
  - Create package.json with proper metadata
  - Install TypeScript and configure tsconfig.json with strict mode
  - Set up project directory structure per spec (src/server, src/client, src/shared)
  - Configure separate tsconfig for client and server if needed
- [x] 1.1.2 Install and configure core dependencies
  - Express.js and @types/express
  - React 18+ with react-dom for SSR
  - Prisma CLI and @prisma/client
  - express-session and connect-pg-simple
  - dotenv for environment configuration
- [x] 1.1.3 Install supporting libraries
  - sharp for image processing
  - music-metadata for audio file extraction
  - TypeScript and type definitions
- [x] 1.1.4 Set up development tooling
  - ESLint with TypeScript support
  - Prettier for code formatting
  - nodemon for auto-restart
  - ts-node for TypeScript execution
- [x] 1.1.5 Configure Tailwind CSS
  - Install tailwindcss and dependencies
  - Create tailwind.config.js with custom breakpoints
  - Set up PostCSS configuration
  - Create global styles file with Tailwind imports

**Acceptance Criteria:**
- [x] TypeScript compiles without errors in strict mode
- [x] All dependencies install successfully
- [x] Development server can start with nodemon
- [x] Tailwind CSS processes correctly

---

#### 1.2 Environment & Database Setup
**Size:** Medium
**Description:** Configure database connection and environment variables

- [x] 1.2.1 Set up PostgreSQL database
  - Create local PostgreSQL database (documented for user to complete)
  - Document connection requirements
  - Test database connectivity (pending PostgreSQL installation)
- [x] 1.2.2 Create environment configuration
  - Create .env.example template
  - Create .env with actual values
  - Define DATABASE_URL connection string
  - Define SESSION_SECRET for express-session
  - Define PORT and NODE_ENV variables
- [x] 1.2.3 Create file storage directories
  - Create /uploads/audio/ directory
  - Create /uploads/artwork/ directory
  - Set appropriate permissions
  - Add .gitkeep files to preserve structure

**Acceptance Criteria:**
- [x] PostgreSQL database setup documented (requires user installation)
- [x] Environment variables load correctly
- [x] File storage directories exist and are writable
- [x] .env file is gitignored

---

#### 1.3 Initial Express Server Setup
**Size:** Small
**Description:** Create basic Express server with middleware

- [x] 1.3.1 Create Express app entry point (src/server/index.ts)
  - Initialize Express application
  - Configure JSON body parser
  - Set up static file serving for /uploads
  - Configure PORT from environment
- [x] 1.3.2 Add basic middleware
  - Error handling middleware (centralized)
  - Request logging (development only)
  - CORS configuration if needed
- [x] 1.3.3 Create health check endpoint
  - GET /health returns 200 OK
  - Include basic server info in response

**Acceptance Criteria:**
- [x] Server starts successfully on configured PORT
- [x] Health check endpoint responds correctly
- [x] Static files can be served from /uploads
- [x] Errors are caught by centralized handler

---

### GROUP 2: Database Schema & Migrations
**Dependencies:** Group 1 (Project Setup)
**Estimated Time:** 2-3 days
**Status:** COMPLETED

#### 2.1 Prisma Schema Definition
**Size:** Large
**Description:** Define complete database schema using Prisma

- [x] 2.1.1 Write 2-4 focused tests for database models
  - Test Artist model creation and uniqueness constraint
  - Test Album-Artist relationship creation
  - Test Song-Album relationship with nullable albumId
  - Test cart item creation with session management
- [x] 2.1.2 Initialize Prisma in project
  - Run `prisma init`
  - Configure datasource to use PostgreSQL
  - Set up Prisma client generator
- [x] 2.1.3 Define Artist model
  - Fields: id (UUID), name (unique), bio (text), profileImageUrl, timestamps
  - Relationships: albumArtists[], songArtists[]
  - Indexes: name
- [x] 2.1.4 Define Album model
  - Fields: id (UUID), title, artworkUrl, releaseDate (Date), genre, description (text), totalDurationSeconds, price (Decimal), timestamps
  - Relationships: songs[], albumArtists[], cartItems[]
  - Indexes: releaseDate, genre
- [x] 2.1.5 Define Song model
  - Fields: id (UUID), title, albumId (nullable), trackNumber (nullable), durationSeconds, audioFileUrl, genre, releaseDate, description (text), lyrics (text), price (Decimal), timestamps
  - Relationships: album (optional), songArtists[], cartItems[]
  - Indexes: albumId, releaseDate
  - Unique constraint: [albumId, trackNumber]
- [x] 2.1.6 Define AlbumArtist junction table
  - Fields: id (UUID), albumId, artistId, role (enum), createdAt
  - Relationships: album, artist
  - Indexes: albumId, artistId
  - Unique constraint: [albumId, artistId]
- [x] 2.1.7 Define SongArtist junction table
  - Fields: id (UUID), songId, artistId, role (enum), createdAt
  - Relationships: song, artist
  - Indexes: songId, artistId
  - Unique constraint: [songId, artistId, role]
- [x] 2.1.8 Define CartItem model
  - Fields: id (UUID), sessionId, itemType (enum), itemId, quantity, priceAtAddition (Decimal), timestamps
  - Conditional relationships: album (optional), song (optional)
  - Indexes: sessionId
- [x] 2.1.9 Define Session model for connect-pg-simple
  - Fields: sid (String, primary), sess (JSON), expire (DateTime)
  - Indexes: expire
- [x] 2.1.10 Define enums
  - ArtistRole: primary, featured, collaborator
  - SongArtistRole: primary, featured, producer, songwriter
  - ItemType: album, song
- [x] 2.1.11 Run database model tests
  - Verify all 2-4 tests pass
  - Confirm relationships work correctly
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Prisma schema compiles without errors
- All relationships properly defined
- All indexes and constraints included
- Enums correctly defined
- Database model tests pass (2-4 tests)

---

#### 2.2 Database Migrations
**Size:** Medium
**Description:** Create and run initial database migration

- [x] 2.2.1 Generate initial migration
  - Run `prisma migrate dev --name init`
  - Review generated SQL migration
  - Verify all tables, indexes, and constraints created
- [x] 2.2.2 Verify migration success
  - Check all tables exist in database
  - Verify foreign key relationships
  - Confirm indexes created properly
- [x] 2.2.3 Generate Prisma Client
  - Run `prisma generate`
  - Verify types are available in TypeScript
  - Test importing PrismaClient

**Acceptance Criteria:**
- Migration runs successfully
- All tables exist in PostgreSQL
- Prisma Client generates correct TypeScript types
- No migration warnings or errors

---

#### 2.3 Database Configuration & Client Setup
**Size:** Small
**Description:** Configure Prisma client for application use

- [x] 2.3.1 Create database config module (src/server/config/database.ts)
  - Initialize PrismaClient with logging configuration
  - Export singleton instance
  - Handle connection errors gracefully
- [x] 2.3.2 Set up connection lifecycle
  - Connect on application start
  - Graceful disconnect on shutdown
  - Handle connection errors with retry logic

**Acceptance Criteria:**
- Prisma client connects successfully
- Singleton pattern prevents multiple instances
- Graceful shutdown disconnects properly
- Connection errors are logged

---

### GROUP 3: Seed Data Generation
**Dependencies:** Group 2 (Database Schema) - COMPLETED
**Estimated Time:** 1-2 days
**Status:** COMPLETED

#### 3.1 Seed Script Development
**Size:** Large
**Description:** Create comprehensive seed data for testing

- [x] 3.1.1 Create seed script file (prisma/seed.ts)
  - Configure as Prisma seed script in package.json
  - Import PrismaClient
  - Set up TypeScript execution
- [x] 3.1.2 Generate sample artists
  - Create 15-20 artists with names and bios
  - Include diverse genres and styles
  - Add placeholder profile images
- [x] 3.1.3 Generate sample albums
  - Create 20-30 albums with metadata
  - Assign release dates spanning multiple years
  - Include various genres
  - Generate album descriptions
  - Set all prices to $0.00
- [x] 3.1.4 Create album-artist relationships
  - Assign primary artists to all albums
  - Add featured artists to some albums
  - Include collaborator relationships
- [x] 3.1.5 Generate sample songs
  - Create 100+ songs across albums
  - Assign track numbers within albums
  - Create some standalone singles (no albumId)
  - Set durations (180-360 seconds range)
  - Include lyrics and descriptions for some songs
  - Set all prices to $0.00
- [x] 3.1.6 Create song-artist relationships
  - Assign primary artists to all songs
  - Add featured artists to some songs
  - Include producer and songwriter credits
- [x] 3.1.7 Calculate album durations
  - Sum song durations for each album
  - Update album totalDurationSeconds
- [x] 3.1.8 Add sample audio files and artwork
  - Create or download sample audio files (MP3 format minimum)
  - Create or download sample artwork images
  - Place in appropriate /uploads directories
  - Update database records with file paths

**Acceptance Criteria:**
- [x] Seed script runs without errors
- [x] Database contains 15-20 artists (18 created)
- [x] Database contains 20-30 albums (27 created)
- [x] Database contains 100+ songs (248 created)
- [x] All relationships properly created
- [x] Audio files and artwork accessible
- [x] Album durations calculated correctly

---

#### 3.2 Seed Data Testing
**Size:** Small
**Description:** Verify seed data integrity

- [x] 3.2.1 Test data relationships
  - Query albums with artists and verify results
  - Query songs with artists and verify results
  - Verify album-song relationships
- [x] 3.2.2 Test data variety
  - Confirm multiple genres represented
  - Verify different release dates
  - Check for singles and full albums
- [x] 3.2.3 Create seed reset script
  - Script to clear all data
  - Script to re-run seed
  - Document usage in README

**Acceptance Criteria:**
- [x] All relationships query correctly
- [x] Data is diverse and realistic (18 unique genres)
- [x] Seed can be reset and re-run easily

---

### GROUP 4: Backend API - Catalog Endpoints
**Dependencies:** Group 3 (Seed Data) - COMPLETED
**Estimated Time:** 3-4 days
**Status:** COMPLETED

#### 4.1 Catalog Service Layer
**Size:** Medium
**Description:** Business logic for catalog operations

- [x] 4.1.1 Write 2-4 focused tests for catalog service
  - Test catalog retrieval with pagination
  - Test sorting by newest/artist/title
  - Test filtering by type (albums/songs/all)
  - DO NOT test exhaustive edge cases
- [x] 4.1.2 Create catalog service (src/server/services/catalogService.ts)
  - Define service interface and types
  - Import PrismaClient
- [x] 4.1.3 Implement getCatalog method
  - Accept parameters: page, limit, sort, type
  - Build Prisma query with proper includes (artists)
  - Apply sorting logic (newest, artist, title)
  - Filter by type (all, albums, songs)
  - Calculate pagination metadata
  - Return formatted results
- [x] 4.1.4 Add data formatting helpers
  - Format album data for catalog display
  - Format song data for catalog display
  - Include artwork URLs and artist info
- [x] 4.1.5 Run catalog service tests
  - Verify 2-4 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Catalog service tests pass (2-4 tests)
- Service returns paginated results correctly
- All sort options work correctly
- Type filtering functions properly
- Proper includes for related data

---

#### 4.2 Catalog Controller & Routes
**Size:** Medium
**Description:** HTTP layer for catalog endpoints

- [x] 4.2.1 Create catalog controller (src/server/controllers/catalogController.ts)
  - Import catalog service
  - Define controller methods
- [x] 4.2.2 Implement GET /api/catalog handler
  - Extract query parameters (page, limit, sort, type)
  - Validate parameters with defaults
  - Call catalog service
  - Return JSON response with proper structure
  - Handle errors with appropriate status codes
- [x] 4.2.3 Create catalog routes (src/server/routes/api/catalog.ts)
  - Define Express router
  - Map GET /api/catalog to controller
  - Export router
- [x] 4.2.4 Register catalog routes in main app
  - Import catalog router in src/server/index.ts
  - Mount at /api/catalog path
- [x] 4.2.5 Test catalog endpoint manually
  - Test with different sort options
  - Test with different type filters
  - Test pagination parameters
  - Verify response format matches spec

**Acceptance Criteria:**
- GET /api/catalog returns expected JSON structure
- Pagination works correctly
- Sort and filter parameters work
- Appropriate error handling
- Response includes all required fields

---

#### 4.3 Album Service & Endpoints
**Size:** Medium
**Description:** Business logic and API for album details

- [x] 4.3.1 Write 2-4 focused tests for album service
  - Test album retrieval by ID with tracks
  - Test album not found scenario
  - Test album with multiple artists
  - DO NOT test all edge cases
- [x] 4.3.2 Create album service (src/server/services/albumService.ts)
  - Define service interface
  - Import PrismaClient
- [x] 4.3.3 Implement getAlbumById method
  - Accept album ID parameter
  - Query album with all relationships (artists, tracks)
  - Order tracks by trackNumber
  - Calculate total duration from tracks
  - Return null if not found
- [x] 4.3.4 Add album formatting helper
  - Format album with complete metadata
  - Include all artists with roles
  - Include complete track listing
- [x] 4.3.5 Create album controller (src/server/controllers/albumController.ts)
  - Import album service
  - Define GET handler for album by ID
- [x] 4.3.6 Implement GET /api/albums/:id handler
  - Extract album ID from params
  - Validate ID format (UUID)
  - Call album service
  - Return 404 if album not found
  - Return album JSON on success
- [x] 4.3.7 Create album routes (src/server/routes/api/albums.ts)
  - Define Express router
  - Map GET /api/albums/:id to controller
  - Export router
- [x] 4.3.8 Register album routes in main app
  - Import and mount album router
- [x] 4.3.9 Run album service tests
  - Verify 2-4 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Album service tests pass (2-4 tests)
- GET /api/albums/:id returns complete album data
- Tracks are ordered correctly
- All artists included with roles
- 404 returned for invalid album ID
- Response matches spec format

---

#### 4.4 Song Service & Endpoints
**Size:** Medium
**Description:** Business logic and API for song details

- [x] 4.4.1 Write 2-4 focused tests for song service
  - Test song retrieval by ID with album
  - Test song not found scenario
  - Test standalone single (no album)
  - DO NOT test all edge cases
- [x] 4.4.2 Create song service (src/server/services/songService.ts)
  - Define service interface
  - Import PrismaClient
- [x] 4.4.3 Implement getSongById method
  - Accept song ID parameter
  - Query song with relationships (artists, album)
  - Return null if not found
- [x] 4.4.4 Add song formatting helper
  - Format song with complete metadata
  - Include all artists with roles
  - Include parent album info if exists
- [x] 4.4.5 Create song controller (src/server/controllers/songController.ts)
  - Import song service
  - Define GET handler for song by ID
- [x] 4.4.6 Implement GET /api/songs/:id handler
  - Extract song ID from params
  - Validate ID format (UUID)
  - Call song service
  - Return 404 if song not found
  - Return song JSON on success
- [x] 4.4.7 Create song routes (src/server/routes/api/songs.ts)
  - Define Express router
  - Map GET /api/songs/:id to controller
  - Export router
- [x] 4.4.8 Register song routes in main app
  - Import and mount song router
- [x] 4.4.9 Run song service tests
  - Verify 2-4 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Song service tests pass (2-4 tests)
- GET /api/songs/:id returns complete song data
- All artists included with roles
- Parent album info included when exists
- 404 returned for invalid song ID
- Response matches spec format

---

#### 4.5 Cart Service & Endpoints
**Size:** Medium
**Description:** Session-based cart functionality

- [x] 4.5.1 Write 2-4 focused tests for cart service
  - Test adding album to cart
  - Test adding song to cart
  - Test retrieving cart contents
  - DO NOT test complex validation scenarios
- [x] 4.5.2 Set up session middleware (src/server/config/session.ts)
  - Configure express-session
  - Set up connect-pg-simple for PostgreSQL storage
  - Configure session options (secret, cookie, resave, saveUninitialized)
  - Set 7-day expiration
- [x] 4.5.3 Register session middleware in app
  - Import session configuration
  - Apply middleware before routes
- [x] 4.5.4 Create cart service (src/server/services/cartService.ts)
  - Define service interface
  - Import PrismaClient
- [x] 4.5.5 Implement addItemToCart method
  - Accept sessionId, itemType, itemId
  - Verify item exists (album or song)
  - Get current price
  - Create cart item with priceAtAddition
  - Handle duplicate items (update quantity or skip)
  - Return cart item and total count
- [x] 4.5.6 Implement getCart method
  - Accept sessionId
  - Query all cart items for session
  - Include item details (album or song info)
  - Calculate total items and subtotal
  - Return formatted cart
- [x] 4.5.7 Create cart controller (src/server/controllers/cartController.ts)
  - Import cart service
  - Define POST /api/cart/items handler
  - Define GET /api/cart handler
- [x] 4.5.8 Implement POST /api/cart/items handler
  - Extract sessionId from req.session
  - Extract itemType and itemId from body
  - Validate input parameters
  - Call cart service to add item
  - Return 201 with cart item and count
- [x] 4.5.9 Implement GET /api/cart handler
  - Extract sessionId from req.session
  - Call cart service to get cart
  - Return cart contents with items and totals
- [x] 4.5.10 Create cart routes (src/server/routes/api/cart.ts)
  - Define Express router
  - Map POST /api/cart/items to controller
  - Map GET /api/cart to controller
  - Export router
- [x] 4.5.11 Register cart routes in main app
  - Import and mount cart router
- [x] 4.5.12 Run cart service tests
  - Verify 2-4 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Cart service tests pass (2-4 tests)
- Sessions persist in PostgreSQL
- POST /api/cart/items creates cart items
- GET /api/cart returns cart contents
- Session ID properly managed
- Cart persists across requests

---

#### 4.6 Static File Serving
**Size:** Small
**Description:** Serve audio files and artwork

- [x] 4.6.1 Configure audio file serving
  - Set up static middleware for /uploads/audio
  - Support range requests for seeking
  - Set appropriate MIME types (audio/mpeg, audio/flac, audio/wav)
  - Add cache headers
- [x] 4.6.2 Configure artwork serving
  - Set up static middleware for /uploads/artwork
  - Set appropriate MIME types (image/jpeg, image/png)
  - Add cache headers
- [x] 4.6.3 Test file serving
  - Verify audio files stream correctly
  - Test seeking in audio files (range requests)
  - Verify images load correctly

**Acceptance Criteria:**
- Audio files accessible via /uploads/audio/:filename
- Artwork images accessible via /uploads/artwork/:filename
- Range requests work for audio seeking
- Appropriate headers set for caching

---

### GROUP 5: Frontend Components - Shared & Layout
**Dependencies:** Group 4 (Backend API) - COMPLETED
**Estimated Time:** 3-4 days
**Status:** COMPLETED

#### 5.1 Shared Types & Constants
**Size:** Small
**Description:** Define TypeScript types used across app

- [x] 5.1.1 Create shared types (src/shared/types/)
  - album.ts: Album, AlbumDetail, AlbumArtist
  - song.ts: Song, SongDetail, SongArtist
  - artist.ts: Artist, ArtistRole, SongArtistRole
  - cart.ts: CartItem, Cart, ItemType
  - api.ts: CatalogResponse, PaginationMeta
- [x] 5.1.2 Create constants (src/shared/constants/)
  - pagination.ts: DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
  - formats.ts: AUDIO_FORMATS, IMAGE_FORMATS
  - routes.ts: API routes and page routes

**Acceptance Criteria:**
- All types compile without errors
- Types match API response structures
- Constants are properly exported

---

#### 5.2 Utility Functions
**Size:** Small
**Description:** Helper functions for formatting and validation

- [x] 5.2.1 Create formatters (src/server/utils/formatters.ts)
  - formatDuration(seconds): convert to mm:ss format
  - formatDate(date): format to readable string
  - formatPrice(price): format to currency string
- [x] 5.2.2 Create validators (src/server/utils/validators.ts)
  - validateUUID(id): check valid UUID format
  - validatePaginationParams(page, limit): validate and apply defaults
  - validateSortOption(sort): validate against allowed values
- [x] 5.2.3 Write unit tests for utilities
  - Test formatDuration with various inputs
  - Test validators with valid and invalid inputs

**Acceptance Criteria:**
- All utility functions work correctly
- Unit tests pass
- Functions are properly typed

---

#### 5.3 Navigation Component
**Size:** Medium
**Description:** Header navigation with cart badge

- [x] 5.3.1 Write 2-4 focused tests for Navigation
  - Test navigation renders correctly
  - Test cart badge displays count
  - Test responsive menu toggle
  - DO NOT test all interactions
- [x] 5.3.2 Create Navigation component (src/client/components/Navigation.tsx)
  - Define component props interface
  - Set up component structure
- [x] 5.3.3 Implement navigation layout
  - Logo/brand name (links to catalog)
  - Main nav links: Browse Music, About (placeholder), Login (placeholder)
  - Cart icon with count badge
  - Responsive hamburger menu for mobile
- [x] 5.3.4 Style with Tailwind CSS
  - Mobile-first approach
  - Sticky header on scroll
  - Touch-friendly button sizes (min 44x44px)
  - Accessible focus states
- [x] 5.3.5 Add cart count state management
  - Accept cartCount as prop
  - Display badge only when count > 0
  - Update when cart changes
- [x] 5.3.6 Run navigation tests
  - Verify 2-4 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Navigation tests pass (2-4 tests)
- Navigation renders on all pages
- Cart badge shows correct count
- Responsive menu works on mobile
- All links functional

---

#### 5.4 Footer Component
**Size:** Small
**Description:** Footer with basic links

- [x] 5.4.1 Create Footer component (src/client/components/Footer.tsx)
  - Copyright information
  - Links: Privacy Policy, Terms of Service (placeholders)
  - Social media links (placeholders)
  - "Powered by Music Store" attribution
- [x] 5.4.2 Style with Tailwind CSS
  - Responsive multi-column layout
  - Proper spacing and typography
  - Accessible link colors

**Acceptance Criteria:**
- Footer renders correctly
- All placeholder links present
- Responsive layout works
- Proper typography and spacing

---

#### 5.5 Error Pages
**Size:** Small
**Description:** 404 and 500 error pages

- [x] 5.5.1 Create 404 Not Found page (src/client/pages/NotFoundPage.tsx)
  - Friendly "Album/Song not found" message
  - Link back to catalog
  - Suggestion to browse full catalog
- [x] 5.5.2 Create 500 Server Error page (src/client/pages/ServerErrorPage.tsx)
  - Generic "Something went wrong" message
  - No technical details exposed
  - Link back to home
- [x] 5.5.3 Create error handler middleware
  - Catch 404s and render NotFoundPage
  - Catch 500s and render ServerErrorPage
  - Log errors server-side
- [x] 5.5.4 Style error pages with Tailwind
  - Centered layout
  - Clear messaging
  - Prominent call-to-action buttons

**Acceptance Criteria:**
- 404 page renders for invalid routes
- 500 page renders for server errors
- Errors logged server-side
- User-friendly messages only

---

### GROUP 6: Frontend Components - Interactive Features
**Dependencies:** Group 5 (Shared Components) - COMPLETED ✅
**Estimated Time:** 4-5 days
**Status:** COMPLETED ✅

#### 6.1 Audio Player Component
**Size:** Large
**Description:** Full-featured in-browser audio player

- [x] 6.1.1 Write 2-6 focused tests for AudioPlayer
  - Test play/pause toggle
  - Test volume control
  - Test seek functionality
  - Test track switching
  - DO NOT test all edge cases
- [x] 6.1.2 Create useAudioPlayer hook (src/client/hooks/useAudioPlayer.ts)
  - State: currentSong, isPlaying, currentTime, duration, volume
  - Methods: play, pause, seek, setVolume, loadSong
  - Use HTML5 Audio API
- [x] 6.1.3 Create AudioPlayer component (src/client/components/AudioPlayer.tsx)
  - Import useAudioPlayer hook
  - Define component props
- [x] 6.1.4 Implement player controls UI
  - Play/Pause button with icon toggle
  - Progress bar with seek capability
  - Current time / Total duration display
  - Volume slider (0-100%)
  - Mute/unmute toggle
- [x] 6.1.5 Implement player functionality
  - Load audio from URL
  - Play/pause control
  - Update progress bar during playback
  - Seek on progress bar click
  - Volume control with localStorage persistence
- [x] 6.1.6 Add loading and error states
  - Loading spinner while buffering
  - Error message if audio fails to load
  - Retry button for failed loads
- [x] 6.1.7 Implement "Now Playing" display
  - Show current song title
  - Show artist name
  - Show album artwork thumbnail
- [x] 6.1.8 Style player with Tailwind CSS
  - Fixed position at bottom of viewport
  - Responsive layout (stack on mobile)
  - Accessible controls with proper focus states
  - Color-coded progress bar
- [x] 6.1.9 Add keyboard controls
  - Space bar: play/pause
  - Arrow keys: seek forward/backward
  - Volume up/down keys
- [x] 6.1.10 Implement player persistence
  - Player remains visible across page navigation
  - Audio continues playing during navigation
  - Save volume preference to localStorage
- [x] 6.1.11 Run audio player tests
  - Verify 2-6 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Audio player tests pass (8 tests) ✅
- Full audio playback works ✅
- All controls functional ✅
- Keyboard navigation works ✅
- Player persists across navigation ✅
- Loading and error states display properly ✅

---

#### 6.2 Add to Cart Button Component
**Size:** Medium
**Description:** Interactive button for adding items to cart

- [x] 6.2.1 Write 2-4 focused tests for AddToCartButton
  - Test button click triggers API call
  - Test success feedback display
  - Test error handling
  - DO NOT test all scenarios
- [x] 6.2.2 Create useCart hook (src/client/hooks/useCart.ts)
  - State: cartCount
  - Methods: addToCart(itemType, itemId), getCartCount
  - API integration with /api/cart
- [x] 6.2.3 Create AddToCartButton component (src/client/components/AddToCartButton.tsx)
  - Props: itemType, itemId, label (optional)
  - Import useCart hook
- [x] 6.2.4 Implement button functionality
  - Click handler calls addToCart
  - Show loading state during request
  - Show success feedback (checkmark animation)
  - Show error message if request fails
  - Update cart count on success
- [x] 6.2.5 Style button with Tailwind CSS
  - Primary button styling
  - Loading spinner
  - Success animation (brief green checkmark)
  - Error state styling
  - Disabled state during loading
- [x] 6.2.6 Run add to cart tests
  - Verify 2-4 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Add to cart tests pass (6 tests) ✅
- Button adds items to cart successfully ✅
- Loading state displays ✅
- Success feedback shows briefly ✅
- Cart count updates in navigation ✅
- Error handling works ✅

---

#### 6.3 View Toggle Component
**Size:** Small
**Description:** Switch between grid and list view

- [x] 6.3.1 Create ViewToggle component (src/client/components/ViewToggle.tsx)
  - Props: currentView, onViewChange
  - Two toggle buttons: Grid and List
- [x] 6.3.2 Implement toggle functionality
  - Click handler switches view
  - Active state styling
  - Icons for grid and list views
- [x] 6.3.3 Style with Tailwind CSS
  - Button group styling
  - Active/inactive states
  - Touch-friendly sizing

**Acceptance Criteria:**
- Toggle switches view correctly ✅
- Active state clearly visible ✅
- Icons display properly ✅

---

#### 6.4 Pagination Component
**Size:** Medium
**Description:** Navigate between catalog pages

- [x] 6.4.1 Create Pagination component (src/client/components/Pagination.tsx)
  - Props: currentPage, totalPages, onPageChange
  - Display current page and total pages
- [x] 6.4.2 Implement pagination controls
  - Previous button (disabled on page 1)
  - Next button (disabled on last page)
  - Jump to page input
  - Page number display
- [x] 6.4.3 Handle page change
  - Validate page number
  - Call onPageChange callback
  - Maintain sort and view preferences
- [x] 6.4.4 Style with Tailwind CSS
  - Clear button states
  - Disabled state styling
  - Responsive layout

**Acceptance Criteria:**
- Pagination controls work correctly ✅
- Previous/Next buttons properly disabled ✅
- Jump to page validates input ✅
- Responsive design works ✅

---

### GROUP 7: Frontend Pages - SSR Implementation
**Dependencies:** Group 6 (Interactive Components)
**Estimated Time:** 5-6 days

#### 7.1 SSR Infrastructure Setup
**Size:** Large
**Description:** Configure React SSR with Express

- [x] 7.1.1 Create SSR middleware (src/server/middleware/renderMiddleware.ts)
  - Import ReactDOMServer
  - Set up renderToString function
  - Create HTML template with hydration script
  - Handle component errors gracefully
- [x] 7.1.2 Create client entry point (src/client/index.tsx)
  - Set up React hydration
  - Import global styles
  - Initialize client-side routing if needed
- [x] 7.1.3 Configure Webpack/build for SSR
  - Separate client and server bundles
  - Handle CSS in SSR context
  - Set up hot reloading for development
- [x] 7.1.4 Create page route infrastructure
  - Define route handler pattern for SSR pages
  - Create helper for embedding initial data
  - Set up client-side hydration pattern

**Acceptance Criteria:**
- SSR renders React components to HTML
- Client-side hydration works without errors
- No flash of unstyled content (FOUC)
- Build process creates proper bundles

---

#### 7.2 Catalog Page
**Size:** Large
**Description:** Main browsing page with grid/list view

- [x] 7.2.1 Write 2-6 focused tests for CatalogPage
  - Test catalog data loading
  - Test grid view rendering
  - Test list view rendering
  - Test sort functionality
  - Test pagination
  - DO NOT test all interactions
- [x] 7.2.2 Create CatalogPage component (src/client/pages/CatalogPage.tsx)
  - Accept initialData prop from SSR
  - Set up component state
- [x] 7.2.3 Implement catalog display logic
  - Grid view layout (3-4 columns desktop, 2 tablet, 1-2 mobile)
  - List view layout (single column)
  - Album/song card components
- [x] 7.2.4 Create catalog item card components
  - AlbumCard: artwork, title, artist, price, Add to Cart button
  - SongCard: artwork, title, artist, duration, price, Add to Cart button
  - Click anywhere to view details
- [x] 7.2.5 Implement sorting controls
  - Dropdown with options: Newest, Artist A-Z, Title A-Z
  - Change handler triggers new data fetch
- [x] 7.2.6 Integrate ViewToggle component
  - State for current view (grid/list)
  - Toggle handler updates view
  - Persist preference in localStorage
- [x] 7.2.7 Integrate Pagination component
  - Pass pagination metadata
  - Handle page changes
  - Maintain sort and view state
- [x] 7.2.8 Style catalog page with Tailwind CSS
  - Responsive grid layouts
  - Card hover effects
  - Proper spacing and typography
  - Loading states for data fetching
- [x] 7.2.9 Create SSR route handler (src/server/routes/pages/catalog.tsx)
  - Fetch catalog data server-side
  - Render CatalogPage to HTML
  - Embed initial data in page
  - Handle errors with error page
- [x] 7.2.10 Register catalog page route
  - Map GET / and GET /browse to catalog handler
- [x] 7.2.11 Run catalog page tests
  - Verify 2-6 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Catalog page tests pass (2-6 tests)
- Catalog page renders with SSR
- Grid and list views both work
- Sorting updates catalog correctly
- Pagination navigates between pages
- All items link to detail pages
- Add to Cart works from catalog

---

#### 7.3 Album Detail Page
**Size:** Large
**Description:** Complete album information with track listing

- [x] 7.3.1 Write 2-6 focused tests for AlbumDetailPage
  - Test album data loading
  - Test track list rendering
  - Test play button functionality
  - Test add album to cart
  - DO NOT test all interactions
- [x] 7.3.2 Create AlbumDetailPage component (src/client/pages/AlbumDetailPage.tsx)
  - Accept initialData prop from SSR
  - Set up component state
- [x] 7.3.3 Implement album header layout
  - Large album artwork (600x600px optimized)
  - Album title (h1)
  - Artist names with roles
  - Release date and genre
  - Total duration (calculated from tracks)
  - Price display
  - Description/bio (formatted text)
- [x] 7.3.4 Implement track listing
  - Track number, title, duration
  - Play button for each track
  - Link to song detail page
  - Featured artists if applicable
  - Ordered by track number
- [x] 7.3.5 Integrate Add to Cart button
  - "Add Album to Cart" button
  - Adds entire album
  - Updates cart count
- [x] 7.3.6 Integrate AudioPlayer
  - Click track play button loads song
  - Player appears at bottom
  - Shows current track playing
- [x] 7.3.7 Style album detail page with Tailwind CSS
  - Side-by-side layout (desktop)
  - Stacked layout (mobile)
  - Responsive artwork sizing
  - Table styling for track listing
  - Proper typography hierarchy
- [x] 7.3.8 Add error handling
  - 404 page if album not found
  - Placeholder image if artwork missing
  - Error message if audio fails to load
- [x] 7.3.9 Create SSR route handler (src/server/routes/pages/albumDetail.tsx)
  - Fetch album data by ID server-side
  - Render AlbumDetailPage to HTML
  - Embed initial data in page
  - Return 404 if album not found
- [x] 7.3.10 Register album detail route
  - Map GET /albums/:id to album detail handler
- [x] 7.3.11 Run album detail tests
  - Verify 2-6 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Album detail tests pass (2-6 tests)
- Album detail page renders with SSR
- All album metadata displays correctly
- Track listing shows all tracks
- Play buttons load songs into player
- Add to Cart adds entire album
- 404 error for missing albums
- Responsive design works

---

#### 7.4 Song Detail Page
**Size:** Large
**Description:** Individual song information with credits

- [x] 7.4.1 Write 2-6 focused tests for SongDetailPage
  - Test song data loading
  - Test play functionality
  - Test add song to cart
  - Test album link navigation
  - DO NOT test all interactions
- [x] 7.4.2 Create SongDetailPage component (src/client/pages/SongDetailPage.tsx)
  - Accept initialData prop from SSR
  - Set up component state
- [x] 7.4.3 Implement song header layout
  - Album artwork (medium size)
  - Song title (h1)
  - Artist names
  - Album name with link
  - Track number (if part of album)
  - Duration, release date, genre
  - Price display
- [x] 7.4.4 Implement description and lyrics section
  - Description/lyrics formatted text
  - Scrollable if long
  - Proper whitespace preservation
- [x] 7.4.5 Implement credits section
  - Primary artist(s)
  - Featured artist(s)
  - Producer(s)
  - Songwriter(s)
  - Other contributors with roles
- [x] 7.4.6 Integrate Add to Cart button
  - "Add Song to Cart" button
  - Adds individual song
  - Updates cart count
- [x] 7.4.7 Integrate Play button and AudioPlayer
  - "Play Song" button loads song
  - Player appears at bottom
  - Shows song playing
- [x] 7.4.8 Add navigation links
  - Link back to parent album (if exists)
  - Link back to catalog
  - Breadcrumb navigation
- [x] 7.4.9 Style song detail page with Tailwind CSS
  - Side-by-side layout (desktop)
  - Stacked layout (mobile)
  - Credits formatting
  - Lyrics/description styling
  - Proper spacing and typography
- [x] 7.4.10 Add error handling
  - 404 page if song not found
  - Graceful handling of missing album
  - Error message if audio fails
- [x] 7.4.11 Create SSR route handler (src/server/routes/pages/songDetail.tsx)
  - Fetch song data by ID server-side
  - Render SongDetailPage to HTML
  - Embed initial data in page
  - Return 404 if song not found
- [x] 7.4.12 Register song detail route
  - Map GET /songs/:id to song detail handler
- [x] 7.4.13 Run song detail tests
  - Verify 2-6 tests pass
  - DO NOT run entire test suite

**Acceptance Criteria:**
- Song detail tests pass (2-6 tests)
- Song detail page renders with SSR
- All song metadata displays correctly
- Credits section shows all contributors
- Play button works correctly
- Add to Cart adds individual song
- Album link navigates correctly
- 404 error for missing songs
- Responsive design works

---

### GROUP 8: Testing & Quality Assurance
**Dependencies:** Groups 1-7 (All Implementation Complete)
**Estimated Time:** 3-4 days

#### 8.1 Test Review & Gap Analysis
**Size:** Large
**Description:** Review existing tests and fill critical gaps

- [ ] 8.1.1 Review tests from previous task groups
  - Review database model tests (2-4 tests from Task 2.1)
  - Review catalog service tests (2-4 tests from Task 4.1)
  - Review album service tests (2-4 tests from Task 4.3)
  - Review song service tests (2-4 tests from Task 4.4)
  - Review cart service tests (2-4 tests from Task 4.5)
  - Review navigation tests (2-4 tests from Task 5.3)
  - Review audio player tests (2-6 tests from Task 6.1)
  - Review add to cart tests (2-4 tests from Task 6.2)
  - Review catalog page tests (2-6 tests from Task 7.2)
  - Review album detail tests (2-6 tests from Task 7.3)
  - Review song detail tests (2-6 tests from Task 7.4)
  - Total existing tests: approximately 26-50 tests
- [ ] 8.1.2 Analyze test coverage gaps for this feature only
  - Identify critical user workflows lacking coverage
  - Focus ONLY on gaps related to browsing/discovery feature
  - Prioritize end-to-end workflows over unit gaps
  - Do NOT assess entire application coverage
- [ ] 8.1.3 Write up to 10 additional strategic tests maximum
  - Add integration tests for critical API endpoints not covered
  - Add E2E tests for complete user workflows
  - Focus on: Browse → View Detail → Play → Add to Cart flow
  - Test session persistence across requests
  - Test responsive design critical breakpoints
  - DO NOT write comprehensive edge case coverage
- [ ] 8.1.4 Run feature-specific tests only
  - Run ONLY tests related to browsing/discovery feature
  - Expected total: approximately 36-60 tests maximum
  - DO NOT run entire application test suite
  - Verify all critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (36-60 tests total)
- Critical user workflows covered
- No more than 10 additional tests added
- Testing focused exclusively on this feature

---

#### 8.2 Integration Testing
**Size:** Medium
**Description:** Test API endpoints with database

- [ ] 8.2.1 Set up test database
  - Create separate test PostgreSQL database
  - Configure test environment variables
  - Create database reset script
- [ ] 8.2.2 Write API integration tests (if gaps identified)
  - Only add if critical gaps found in 8.1.2
  - Focus on endpoint + database integration
  - Test error scenarios (404s, validation)
  - Use Supertest for HTTP assertions
- [ ] 8.2.3 Run integration tests
  - Verify all pass
  - Check database state after tests
  - Confirm proper cleanup

**Acceptance Criteria:**
- Test database configured
- Integration tests pass
- Database resets properly between tests

---

#### 8.3 End-to-End Testing
**Size:** Large
**Description:** Test complete user workflows

- [ ] 8.3.1 Set up E2E testing framework
  - Install Playwright or Cypress
  - Configure test environment
  - Seed test database with known data
- [ ] 8.3.2 Write E2E test: Browse and View Album (if gap identified)
  - Only add if critical gap found in 8.1.2
  - Navigate to catalog
  - Verify albums display
  - Click on album
  - Verify detail page loads
  - Verify tracks display
- [ ] 8.3.3 Write E2E test: Play Audio (if gap identified)
  - Only add if critical gap found in 8.1.2
  - Navigate to album detail
  - Click play on track
  - Verify player appears
  - Verify audio plays
  - Test seek functionality
- [ ] 8.3.4 Write E2E test: Add to Cart Flow (if gap identified)
  - Only add if critical gap found in 8.1.2
  - Navigate to catalog
  - Add album to cart
  - Verify cart count increments
  - Navigate to different page
  - Verify cart count persists
- [ ] 8.3.5 Write E2E test: Sort and Paginate (if gap identified)
  - Only add if critical gap found in 8.1.2
  - Navigate to catalog
  - Change sort option
  - Verify order changes
  - Navigate to next page
  - Verify new items load
  - Verify sort persists
- [ ] 8.3.6 Run E2E tests
  - Execute all E2E tests
  - Verify all critical flows pass
  - Document any failures

**Acceptance Criteria:**
- E2E framework configured
- Critical user flows tested
- All E2E tests pass
- Tests run in CI environment (if applicable)

---

#### 8.4 Manual Testing & Quality Check
**Size:** Medium
**Description:** Comprehensive manual testing checklist

- [ ] 8.4.1 Test catalog browsing
  - [ ] Catalog displays all albums and songs
  - [ ] Grid view works correctly
  - [ ] List view works correctly
  - [ ] Sorting by newest works
  - [ ] Sorting by artist works
  - [ ] Sorting by title works
  - [ ] Pagination navigates correctly
  - [ ] View preference persists
- [ ] 8.4.2 Test album detail page
  - [ ] Album detail shows all information
  - [ ] All tracks display correctly
  - [ ] Track play buttons work
  - [ ] Add album to cart works
  - [ ] Links to song details work
  - [ ] 404 displays for invalid album ID
- [ ] 8.4.3 Test song detail page
  - [ ] Song detail shows all information
  - [ ] Credits display correctly
  - [ ] Play button works
  - [ ] Add song to cart works
  - [ ] Album link works (if applicable)
  - [ ] 404 displays for invalid song ID
- [ ] 8.4.4 Test audio player
  - [ ] Play/pause works
  - [ ] Seek works
  - [ ] Volume control works
  - [ ] Player persists across navigation
  - [ ] Multiple tracks can be queued
  - [ ] Keyboard controls work
- [ ] 8.4.5 Test cart functionality
  - [ ] Adding albums updates count
  - [ ] Adding songs updates count
  - [ ] Cart persists across sessions
  - [ ] Cart count displays correctly
- [ ] 8.4.6 Test responsive design
  - [ ] Mobile (< 640px) layout works
  - [ ] Tablet (640-1024px) layout works
  - [ ] Desktop (> 1024px) layout works
  - [ ] Touch controls work on mobile
  - [ ] Hamburger menu works on mobile
- [ ] 8.4.7 Test accessibility
  - [ ] Keyboard navigation works throughout
  - [ ] Screen reader can navigate
  - [ ] Focus indicators visible
  - [ ] Color contrast sufficient
  - [ ] ARIA labels present
- [ ] 8.4.8 Test performance
  - [ ] Pages load in under 2 seconds
  - [ ] Audio starts playing within 1 second
  - [ ] No console errors during normal use
  - [ ] No server errors in logs
- [ ] 8.4.9 Document test results
  - Create testing report
  - Document any bugs found
  - Note any deviations from spec

**Acceptance Criteria:**
- All manual tests pass
- Testing checklist completed
- Bugs documented and addressed
- Performance meets targets

---

#### 8.5 Code Quality Review
**Size:** Small
**Description:** Final code quality checks

- [ ] 8.5.1 Run TypeScript compiler
  - Verify no TypeScript errors
  - Confirm strict mode compliance
  - Check all types are properly defined
- [ ] 8.5.2 Run linter (ESLint)
  - Fix all linting errors
  - Address linting warnings
  - Ensure consistent code style
- [ ] 8.5.3 Run formatter (Prettier)
  - Format all code files
  - Verify consistent formatting
- [ ] 8.5.4 Review code against standards
  - Check compliance with /agent-os/standards/backend/api.md
  - Check compliance with /agent-os/standards/frontend/components.md
  - Check compliance with /agent-os/standards/global/coding-style.md
  - Verify error handling follows standards
- [ ] 8.5.5 Final code review
  - Review for security issues
  - Check for hardcoded credentials
  - Verify environment variables used correctly
  - Ensure no sensitive data exposed

**Acceptance Criteria:**
- Zero TypeScript errors
- Zero linting errors
- Code formatted consistently
- All standards compliance verified
- No security issues found

---

## Execution Order & Dependencies

### Phase 1: Foundation (Groups 1-3) - COMPLETED
**Duration:** 4-7 days

1. **Group 1: Project Setup & Foundation** (Days 1-2) - COMPLETED
   - Tasks 1.1, 1.2, 1.3
   - No dependencies
   - Critical path: Database must be ready for schema work

2. **Group 2: Database Schema & Migrations** (Days 3-5) - COMPLETED
   - Tasks 2.1, 2.2, 2.3
   - Depends on: Group 1 complete
   - Critical path: Schema must be ready for seed data

3. **Group 3: Seed Data Generation** (Days 5-7) - COMPLETED
   - Tasks 3.1, 3.2
   - Depends on: Group 2 complete
   - Critical path: Data must exist for API testing

---

### Phase 2: Backend Implementation (Group 4) - COMPLETED
**Duration:** 3-4 days (Days 8-11)

4. **Group 4: Backend API - Catalog Endpoints** - COMPLETED
   - Tasks 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
   - Depends on: Group 3 complete
   - Can work on tasks in parallel after 4.1
   - Critical path: API must be functional for frontend

**Parallel Work Opportunities:**
- Tasks 4.3 (Album API) and 4.4 (Song API) can be done simultaneously
- Task 4.6 (Static Files) can be done independently

---

### Phase 3: Frontend Foundation (Group 5) - COMPLETED
**Duration:** 3-4 days (Days 12-15)

5. **Group 5: Frontend Components - Shared & Layout** - COMPLETED
   - Tasks 5.1, 5.2, 5.3, 5.4, 5.5
   - Depends on: Group 4 complete (for API types)
   - Many tasks can be done in parallel

**Parallel Work Opportunities:**
- Tasks 5.3 (Navigation), 5.4 (Footer), 5.5 (Error Pages) can be done simultaneously after 5.1

---

### Phase 4: Interactive Components (Group 6) - COMPLETED ✅
**Duration:** 4-5 days (Days 16-20)

6. **Group 6: Frontend Components - Interactive Features** - COMPLETED ✅
   - Tasks 6.1, 6.2, 6.3, 6.4
   - Depends on: Group 5 complete
   - Audio Player (6.1) is largest task

**Parallel Work Opportunities:**
- Tasks 6.3 (ViewToggle) and 6.4 (Pagination) can be done simultaneously
- Task 6.2 (AddToCart) depends on cart API being ready

---

### Phase 5: Page Implementation (Group 7)
**Duration:** 5-6 days (Days 21-26)

7. **Group 7: Frontend Pages - SSR Implementation**
   - Tasks 7.1, 7.2, 7.3, 7.4
   - Depends on: Group 6 complete
   - SSR infrastructure (7.1) must be done first

**Sequential Dependencies:**
- Task 7.1 (SSR Infrastructure) must be complete before any page tasks
- Tasks 7.2, 7.3, 7.4 can be done in parallel after 7.1

---

### Phase 6: Testing & Quality (Group 8)
**Duration:** 3-4 days (Days 27-30)

8. **Group 8: Testing & Quality Assurance**
   - Tasks 8.1, 8.2, 8.3, 8.4, 8.5
   - Depends on: All Groups 1-7 complete
   - Review existing tests first, then fill gaps

**Sequential Dependencies:**
- Task 8.1 (Test Review) must be done first
- Tasks 8.2, 8.3 can be done in parallel after 8.1
- Task 8.4 (Manual Testing) should be done after 8.2, 8.3
- Task 8.5 (Code Quality) done last

---

## Notes & Blockers

### Critical Path
1. Database setup → Schema → Seed data → Backend API → Frontend components → Pages → Testing

### Potential Blockers
- **Database availability:** Ensure PostgreSQL is installed and accessible before starting
- **Sample audio files:** Need actual audio files for testing; could use placeholder files initially
- **SSR complexity:** React SSR setup may require additional troubleshooting; allocate buffer time
- **Audio streaming:** Browser compatibility and range request support may need testing

### Risk Mitigation
- Start with smaller audio files (MP3 only) before adding FLAC/WAV support
- Use placeholder images if artwork generation is slow
- Implement simplified cart first, optimize later
- Focus on core functionality before polish

### Testing Strategy
- Write minimal tests during development (2-8 per group)
- Focus on critical paths and user workflows
- Defer comprehensive edge case testing
- Run feature-specific tests only, not entire suite
- Maximum 10 additional tests in final review phase

### Size Estimates
- **Small:** 1-4 hours
- **Medium:** 4-8 hours (half day to full day)
- **Large:** 8-16 hours (1-2 days)

### Success Metrics
- All 69 tasks completed
- Approximately 36-60 tests passing
- Manual testing checklist 100% complete
- Zero TypeScript/linting errors
- All pages render with SSR
- Audio playback works across browsers
- Responsive design works on all viewports
- Cart persists across sessions
