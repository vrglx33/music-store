# Spec Requirements: Music Store - Catalog Browsing & Detail Pages

## Initial Description

Create a digital marketplace platform that helps independent artists monetize their music and music lovers discover new content by providing a seamless end-to-end platform for uploading, browsing, and purchasing digital music directly from artists.

This first spec focuses specifically on the **Music Catalog Browsing + Album/Song Detail Pages** - the public-facing browsing and discovery experience that allows users to explore the music catalog and view detailed information about albums and songs.

## Requirements Discussion

### Scope Approach Decision

**Question:** Should we tackle this as one large comprehensive spec covering all 16 features, or break it into smaller incremental specs?

**Answer:** Multiple smaller, incremental specs. This first spec focuses on: Music Catalog Browsing + Album/Song Detail Pages (public-facing browsing/discovery experience)

### Technical Architecture Decisions

**Database Relationships:**
**Question:** For many-to-many relationships (like albums with multiple artists), should we create intermediate junction tables or use simpler approaches?

**Answer:** Include intermediate tables for relationships. This provides proper database normalization and flexibility for complex relationships.

**File Storage:**
**Question:** For MVP, should we implement file storage with size limits and cleanup, or accept unlimited storage?

**Answer:** Unlimited storage acceptable for MVP, local filesystem. No need for storage quotas or automated cleanup in this phase.

**Authentication for This Spec:**
**Question:** Since this spec focuses on browsing/discovery, do we need authentication, or should all content be publicly accessible?

**Answer:** Guest checkout is OK. Authentication will be handled in a future spec. This spec focuses on public browsing without requiring user login.

**Payment Integration:**
**Question:** Should payment processing be included in this spec since shopping cart is mentioned?

**Answer:** NO payment integration in MVP - that will be the last feature. Shopping cart will save orders as "Pending Payment" in the database.

**Downloads:**
**Question:** Should we implement the full download authentication system, or simplify for MVP?

**Answer:** Make all content FREE for testing/MVP purposes. No payment required to access or download music files.

**Audio Preview:**
**Question:** Should users be able to preview 30-60 seconds of a song, or play the full song since it's free?

**Answer:** Full song playable (since everything is free in MVP). No need to implement preview-only restrictions.

### Scope Confirmation

**This First Spec Covers:**
- Music Catalog Browsing (list view of albums/songs)
- Album & Song Detail Pages
- Full audio playback (since content is free)
- Basic navigation and discovery

**Explicitly Excluded from This Spec (Future Specs):**
- User Authentication & Authorization
- Artist Profile & Dashboard
- Music Upload System
- Shopping Cart
- Payment Integration
- Digital Download Delivery (paid downloads)
- All Phase 2 and Phase 3 features

### Existing Code to Reference

No similar existing features identified for reference. This is a greenfield project.

### Follow-up Questions

No follow-up questions were required. The scope and technical decisions provided sufficient clarity to proceed.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual design guidance provided. Implementation should follow standard music marketplace conventions and best practices for catalog browsing interfaces.

## Requirements Summary

### Functional Requirements

#### Music Catalog Browsing Page
- Display all available albums and songs in a browsable list/grid view
- Show album artwork thumbnails for visual appeal
- Display key metadata: artist name, album/song title, genre, release date
- Support pagination for large catalogs
- Offer sorting options: by date (newest first), artist name (alphabetical), title (alphabetical)
- Provide both grid view (visual focus) and list view (information dense) options
- All content is publicly accessible without authentication
- Each item links to its respective detail page

#### Album Detail Page
- Display full album information:
  - Album artwork (large, high-quality display)
  - Album title and artist name
  - Release date and genre
  - Album description/bio (if provided)
  - Total duration
- Show complete track listing with:
  - Track number
  - Song title
  - Duration
  - Link to individual song detail page
- Include audio player for playing full songs from the album
- Display pricing information (even though free for MVP)
- Provide "Add to Cart" functionality (saves to database as "Pending Payment")
- Show all metadata fields stored in database

#### Song Detail Page
- Display individual song information:
  - Song title and artist name
  - Album artwork (from parent album)
  - Album name (with link back to album detail)
  - Track number (if part of album)
  - Duration
  - Genre and release date
  - Song description/lyrics (if provided)
- Include audio player for playing the full song
- Display pricing information (free for MVP)
- Provide "Add to Cart" functionality (individual song purchase)
- Show featured artists or collaborators (if applicable)
- Display production credits (producer, songwriter, etc.)

#### Audio Playback
- Full in-browser audio player with standard controls:
  - Play/Pause button
  - Progress bar with seek capability
  - Current time / Total duration display
  - Volume control
- Play full songs (not limited to 30-60 second previews)
- Support common audio formats: MP3, FLAC, WAV
- Streaming playback (no download required to listen)

#### Data Display Requirements
- All pages should render server-side with React SSR
- Responsive design for desktop, tablet, and mobile viewports
- Fast initial page load with SSR content
- Client-side hydration for interactive components (audio player, cart actions)
- Proper error handling for missing albums/songs (404 pages)
- Loading states for audio streaming

### Database Schema for This Feature Set

#### Core Tables

**albums**
- id (UUID, primary key)
- title (string, required)
- artwork_url (string, nullable - path to local file)
- release_date (date, required)
- genre (string, required)
- description (text, nullable)
- total_duration_seconds (integer, calculated)
- price (decimal, default 0.00 for MVP)
- created_at (timestamp)
- updated_at (timestamp)

**songs**
- id (UUID, primary key)
- title (string, required)
- album_id (UUID, foreign key to albums, nullable for singles)
- track_number (integer, nullable)
- duration_seconds (integer, required)
- audio_file_url (string, required - path to local file)
- genre (string, required)
- release_date (date, required)
- description (text, nullable)
- lyrics (text, nullable)
- price (decimal, default 0.00 for MVP)
- created_at (timestamp)
- updated_at (timestamp)

**artists**
- id (UUID, primary key)
- name (string, required, unique)
- bio (text, nullable)
- profile_image_url (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**album_artists** (intermediate table for many-to-many)
- id (UUID, primary key)
- album_id (UUID, foreign key to albums)
- artist_id (UUID, foreign key to artists)
- role (enum: 'primary', 'featured', 'collaborator')
- created_at (timestamp)

**song_artists** (intermediate table for many-to-many)
- id (UUID, primary key)
- song_id (UUID, foreign key to songs)
- artist_id (UUID, foreign key to artists)
- role (enum: 'primary', 'featured', 'producer', 'songwriter')
- created_at (timestamp)

**cart_items** (for "Pending Payment" functionality)
- id (UUID, primary key)
- session_id (string, for guest carts without authentication)
- item_type (enum: 'album', 'song')
- item_id (UUID, references albums.id or songs.id)
- quantity (integer, default 1)
- price_at_addition (decimal, snapshot of price when added)
- created_at (timestamp)
- updated_at (timestamp)

#### Database Indexes
- albums.release_date (for sorting by date)
- albums.genre (for filtering)
- songs.album_id (for album detail page queries)
- songs.release_date (for sorting)
- cart_items.session_id (for cart retrieval)
- album_artists.album_id and album_artists.artist_id (for joins)
- song_artists.song_id and song_artists.artist_id (for joins)

#### Database Constraints
- album_artists.album_id + artist_id unique together (prevent duplicate relationships)
- song_artists.song_id + artist_id + role unique together
- songs.track_number unique per album_id (prevent duplicate track numbers in same album)

### User Flows and Interactions

#### Browse Music Catalog Flow
1. User navigates to catalog page (homepage or /browse)
2. System loads and displays paginated list of albums and songs (SSR)
3. User can:
   - Switch between grid and list view (client-side toggle)
   - Sort by: newest, artist name, or title (triggers new server request)
   - Click on album/song to view details (navigate to detail page)
   - Add album/song to cart directly from catalog (AJAX request)
4. System updates cart count in navigation when items added

#### View Album Detail Flow
1. User clicks album from catalog or navigates to /albums/:id
2. System loads album detail page with SSR:
   - Fetches album data with all related artists
   - Fetches all songs in album with track order
   - Renders complete page server-side
3. User sees complete album information and track listing
4. User can:
   - Play any song from the album (client-side audio player)
   - Click individual songs to view song detail page
   - Add entire album to cart
   - Navigate back to catalog

#### View Song Detail Flow
1. User clicks song from catalog/album page or navigates to /songs/:id
2. System loads song detail page with SSR:
   - Fetches song data with all related artists
   - Fetches parent album data (if exists)
   - Renders complete page server-side
3. User sees complete song information
4. User can:
   - Play the full song (client-side audio player)
   - Add song to cart
   - Navigate to parent album (if part of album)
   - Navigate back to catalog

#### Audio Playback Flow
1. User clicks play button on song (album detail or song detail page)
2. Client-side audio player initializes with audio file URL
3. Browser streams audio file from server filesystem
4. User can:
   - Play/pause playback
   - Seek to different position in song
   - Adjust volume
   - Continue browsing while audio plays (persistent player)

#### Add to Cart Flow (Simplified for No-Auth MVP)
1. User clicks "Add to Cart" on album or song
2. System creates/updates session if needed (express-session)
3. System creates cart_item record with:
   - session_id from user's session
   - item_type ('album' or 'song')
   - item_id (album or song ID)
   - price_at_addition (snapshot of current price, even if $0)
4. System returns updated cart count
5. Client updates cart badge/icon in navigation
6. Cart contents stored in database (not in-memory session)
7. Status remains "Pending Payment" until payment feature added

### Scope Boundaries

#### In Scope for This Spec:
- Music catalog browsing page with sorting and view options
- Album detail pages with complete metadata and track listings
- Song detail pages with complete metadata and credits
- Full audio playback in browser
- Session-based cart functionality (add items, store in database)
- Server-side rendering for all pages
- Responsive design for all viewports
- Database schema for albums, songs, artists, and relationships
- Local filesystem storage for audio files and artwork
- Basic navigation structure

#### Out of Scope (Future Specs):
- User registration, login, and authentication
- Artist dashboard and profile management
- Music upload functionality for artists
- Search and filtering capabilities
- Payment processing and checkout
- Order fulfillment and download delivery (authenticated)
- Purchase history tracking
- Sales analytics for artists
- Genre-based discovery features
- Admin moderation tools
- Email notifications
- User profiles and preferences
- Advanced pricing controls
- Multi-format audio support
- Re-download functionality for purchased content

### Technical Considerations

#### Framework and Architecture
- Express.js backend with TypeScript
- React with Server-Side Rendering for all pages
- Prisma ORM for database interactions with PostgreSQL
- Express session middleware for guest cart sessions
- React component hydration for interactive elements
- Separation of server components (SSR) and client components (interactive)

#### Integration Points
- Local filesystem for audio file storage (organized by artist/album)
- Local filesystem for album artwork images
- PostgreSQL database for all structured data
- Express session store (using connect-pg-simple) for guest sessions

#### Existing System Constraints
- Local development environment only (no production deployment)
- No authentication system in this phase
- No payment processing in this phase
- All content is free and publicly accessible
- Unlimited file storage on local filesystem

#### Technology Preferences
- TypeScript strict mode for type safety
- Prisma for database migrations and queries
- React SSR for SEO and fast initial page loads
- CSS Modules or Tailwind CSS for styling (to be determined)
- multer for file uploads (when upload feature is implemented in future spec)
- sharp for image processing (artwork optimization)
- music-metadata for extracting audio file information

#### Performance Considerations
- Server-side rendering for fast initial page loads
- Pagination for catalog browsing (prevent loading entire catalog)
- Optimized database queries with proper indexes
- Audio streaming (not full file download before playback)
- Image optimization for album artwork (multiple sizes)
- Client-side hydration only for interactive components

#### Data Seeding Requirements
To test catalog browsing and detail pages, we'll need seed data:
- At least 20-30 sample albums with artwork
- 100+ sample songs across multiple genres
- 15-20 sample artists with bios
- Proper relationships between albums, songs, and artists
- Various track counts per album (singles, EPs, full albums)
- Mix of albums with multiple artists/collaborators
- Sample audio files in different formats (MP3, FLAC, WAV)

### Reusability Opportunities

No existing components or patterns to reuse since this is a greenfield project. However, this spec will establish foundational patterns for:
- Server-side rendered React pages
- Database models and relationships with Prisma
- Audio file handling and streaming
- Image serving and optimization
- Session management for guest users
- Component architecture for future features

Future specs should reference and extend these patterns rather than creating new approaches.

## Technical Dependencies

### Required for Implementation
1. PostgreSQL database running locally
2. Node.js and npm installed
3. TypeScript configuration for strict mode
4. Prisma setup with schema and migrations
5. Express server with SSR middleware for React
6. express-session with PostgreSQL session store
7. Local directory structure for file storage:
   - /uploads/audio/ for music files
   - /uploads/artwork/ for album artwork
8. Sample seed data (albums, songs, artists, audio files, images)

### External Libraries
- react and react-dom (SSR support)
- express and express-session
- @prisma/client and prisma (dev dependency)
- typescript and @types/* packages
- multer (for future upload feature, may be used for seeding)
- sharp (image processing)
- music-metadata (audio file info extraction)
- dotenv (environment configuration)

### Development Dependencies
- nodemon (auto-restart on changes)
- ts-node (TypeScript execution)
- eslint and prettier (code quality)
- jest and supertest (testing framework)

## Assumptions and Constraints

### Key Assumptions
1. Users can browse and play music without creating an account
2. All music content is free in MVP (no payment required)
3. Cart functionality exists but items remain "Pending Payment" indefinitely
4. Audio files and artwork already exist in the filesystem (uploaded manually or via seed script)
5. PostgreSQL is running locally on default port
6. Modern browsers with HTML5 audio support
7. No CDN or external file hosting needed
8. No rate limiting or abuse prevention in MVP
9. No audio DRM or protection mechanisms needed
10. Session-based carts are sufficient (no persistent user accounts)

### Technical Constraints
1. Local development only (no deployment infrastructure)
2. No authentication system available in this phase
3. No payment processing capability in this phase
4. Limited to local filesystem storage (no cloud storage)
5. No email capabilities (no welcome emails, receipts, etc.)
6. No background job processing (no async tasks)
7. No caching layer (acceptable performance without it)
8. No search/filtering (manual browsing only)

### Business Constraints
1. All content must be free for MVP testing
2. No revenue generation in this phase
3. No artist onboarding or content submission
4. No content moderation requirements
5. No user support or dispute resolution needed
6. No analytics or tracking requirements

## Next Steps for Spec Writer

The spec writer should create a detailed technical specification that includes:

1. **Complete database schema** with Prisma schema definition
2. **API endpoints** for catalog browsing, detail pages, cart operations
3. **React component hierarchy** for pages and reusable components
4. **Audio player component** specification with controls and streaming
5. **Routing structure** for all pages
6. **Data seeding script** to populate database with test content
7. **File organization structure** for uploads directory
8. **Session configuration** for guest cart functionality
9. **Error handling** for missing albums/songs (404 pages)
10. **Responsive design breakpoints** and mobile considerations
11. **Accessibility requirements** for audio player and navigation
12. **Testing strategy** for critical user flows

The specification should enable developers to implement the complete browsing and discovery experience without needing to make architectural decisions.
