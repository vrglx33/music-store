# Specification: Music Store - Catalog Browsing & Detail Pages

## 1. Overview

### What This Feature Does
This specification defines the public-facing music catalog browsing and discovery experience for the Music Store platform. It enables users to explore available music, view detailed information about albums and songs, listen to full audio tracks, and add items to their cart - all without requiring authentication.

### Why It Matters
This feature serves as the foundation of the Music Store platform and the primary user experience layer. It allows:
- Music lovers to discover and explore new content from independent artists
- Users to preview the full catalog before making purchase decisions
- A seamless browsing experience that works across all devices
- The establishment of core architectural patterns for future features

### Key Characteristics
- Public access with no authentication required
- Server-side rendered pages for fast initial load and SEO
- Full audio playback for all songs (free in MVP)
- Session-based guest cart functionality
- Responsive design across desktop, tablet, and mobile

---

## 2. Scope

### In Scope
- Music catalog browsing page with grid/list view toggle
- Sorting options: newest first, artist name, title
- Pagination for large catalogs
- Album detail pages with complete metadata and track listings
- Song detail pages with complete metadata and credits
- Full in-browser audio player with standard controls
- Add to cart functionality (guest sessions)
- Server-side rendering (SSR) for all pages
- Responsive design for all viewports
- Database schema for albums, songs, artists, and relationships
- Local filesystem storage for audio files and artwork
- Seed data generation for testing

### Explicitly Out of Scope
The following will be addressed in future specifications:
- User authentication and registration
- Artist dashboard and profile management
- Music upload functionality
- Search and filtering capabilities
- Payment processing and checkout
- Order fulfillment and download delivery
- Purchase history tracking
- Sales analytics for artists
- Genre-based discovery features
- Admin moderation tools
- Email notifications
- User profiles and preferences
- Advanced pricing controls
- Re-download functionality

---

## 3. User Stories

### Browse Music Catalog
**As a music lover**, I want to browse all available albums and songs in an organized catalog view, so that I can discover new music from independent artists.

**As a mobile user**, I want the catalog to display properly on my phone with touch-friendly controls, so that I can browse music on the go.

**As a visual browser**, I want to toggle between grid and list views, so that I can choose between seeing album artwork prominently or seeing more detailed information at once.

### Sort and Navigate
**As a user seeking new releases**, I want to sort the catalog by newest first, so that I can quickly find the latest music.

**As a user with a favorite artist**, I want to sort alphabetically by artist name, so that I can easily locate their work.

### View Album Details
**As a potential buyer**, I want to see complete album information including all tracks, total duration, and artist details, so that I can make informed purchase decisions.

**As a listener**, I want to play any song from the album directly on the detail page, so that I can preview the music before adding it to my cart.

### View Song Details
**As a user interested in a specific song**, I want to see detailed information including lyrics, production credits, and featured artists, so that I can learn more about the song's creation.

**As a listener**, I want to navigate from a song back to its parent album, so that I can explore more music from the same album.

### Listen to Music
**As a free user**, I want to play full songs in my browser without downloading them, so that I can enjoy the music immediately.

**As a listener**, I want standard audio controls (play/pause, seek, volume), so that I can control playback easily.

### Add to Cart
**As a guest user**, I want to add albums or songs to my cart without creating an account, so that I can shop without friction.

**As a shopper**, I want to see visual feedback when items are added to my cart, so that I know my action was successful.

---

## 4. Technical Architecture

### Backend Structure
```
Express.js + TypeScript
├── Routes (API + SSR)
├── Controllers (request handling)
├── Services (business logic)
├── Prisma ORM (database access)
├── Session Management (express-session + connect-pg-simple)
└── File Serving (static middleware for audio/images)
```

### Frontend Components
```
React with SSR
├── Server Components (SSR pages)
├── Client Components (interactive elements)
├── Shared Components (used by both)
└── Hydration Layer (client-side interactivity)
```

### Data Flow
1. User requests page → Express route handler
2. Controller fetches data via Prisma
3. React server renders complete HTML
4. HTML sent to browser with initial state
5. Client-side React hydrates interactive components
6. Interactive actions (play audio, add to cart) use client-side API calls

### Technology Stack
- **Backend**: Express.js with TypeScript (strict mode)
- **Frontend**: React 18+ with SSR support
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5+
- **Session Store**: connect-pg-simple (PostgreSQL-backed sessions)
- **File Processing**: sharp (images), music-metadata (audio info)
- **Styling**: Tailwind CSS (mobile-first utility framework)
- **Testing**: Jest + React Testing Library + Supertest

---

## 5. Component Specifications

### 5.1 Music Catalog Page (`/` or `/browse`)

#### Purpose
Display all available albums and songs in a browsable, sortable, paginated view.

#### Visual Layout
- Header with navigation and cart icon (shows item count)
- View toggle buttons (grid/list)
- Sort dropdown (newest, artist name, title)
- Content area displaying albums and songs
- Pagination controls at bottom
- Footer with basic links

#### Grid View
- 3-4 columns on desktop
- 2 columns on tablet
- 1-2 columns on mobile
- Each item shows:
  - Album artwork (square thumbnail)
  - Album/song title (truncated if needed)
  - Artist name(s)
  - Price (displays $0.00 for MVP)
  - "Add to Cart" button
  - Click anywhere to view details

#### List View
- Single column layout
- Each row shows:
  - Small album artwork thumbnail (left)
  - Title and artist (center-left)
  - Genre and release date (center)
  - Duration (center-right)
  - Price (right)
  - "Add to Cart" button (right)
  - "View Details" link

#### Sorting Options
- **Newest First**: ORDER BY release_date DESC
- **Artist A-Z**: ORDER BY artist_name ASC, title ASC
- **Title A-Z**: ORDER BY title ASC

#### Pagination
- 24 items per page
- Show current page and total pages
- Previous/Next buttons
- Jump to page input (for large catalogs)
- Maintain sort and view preferences across pages

#### Data Requirements
- Fetch albums and songs with primary artist relationship
- Calculate total items for pagination
- Include artwork URLs
- Include pricing information

#### Responsive Breakpoints
- Mobile: < 640px (1-2 columns, simplified controls)
- Tablet: 640px - 1024px (2-3 columns)
- Desktop: > 1024px (3-4 columns, full controls)

---

### 5.2 Album Detail Page (`/albums/:id`)

#### Purpose
Display comprehensive information about a specific album and its tracks.

#### Visual Layout
```
┌─────────────────────────────────────┐
│ Navigation Bar                      │
├──────────────┬──────────────────────┤
│              │ Album Title          │
│   Album      │ Artist Name(s)       │
│   Artwork    │ Release Date • Genre │
│   (Large)    │ Total Duration       │
│              │ Price: $0.00         │
│              │ [Add Album to Cart]  │
│              │                      │
│              │ Description/Bio      │
├──────────────┴──────────────────────┤
│ Track Listing                       │
│ 1. Song Title         [▶]  3:45     │
│ 2. Song Title         [▶]  4:12     │
│ 3. Song Title         [▶]  3:28     │
│ ...                                 │
├─────────────────────────────────────┤
│ Audio Player (if song playing)      │
│ [▶/⏸] ─────●─────  2:15 / 3:45  🔊  │
└─────────────────────────────────────┘
```

#### Data Display
**Album Information:**
- Album artwork (large, high quality - 600x600px optimized)
- Album title (h1)
- All artists (with role indicators if multiple)
- Release date (formatted: "January 15, 2024")
- Genre (pill/badge styling)
- Total album duration (calculated from tracks)
- Price (displays "$0.00" for MVP)
- Description/bio (if provided, formatted text)

**Track Listing:**
- Track number
- Song title (links to song detail page)
- Play button (loads into audio player)
- Duration (mm:ss format)
- Featured artists (if different from album artist)
- Sortable by track number (default)

**Actions:**
- Add entire album to cart (single button)
- Play individual tracks
- Navigate to individual song detail pages

#### State Management
- Track currently playing song
- Audio player state (playing/paused/loading)
- Cart count update on add

#### Error Handling
- 404 page if album ID not found
- Graceful fallback if artwork missing (placeholder image)
- Error message if audio fails to load

---

### 5.3 Song Detail Page (`/songs/:id`)

#### Purpose
Display comprehensive information about an individual song.

#### Visual Layout
```
┌─────────────────────────────────────┐
│ Navigation Bar                      │
├──────────────┬──────────────────────┤
│              │ Song Title           │
│   Album      │ Artist Name(s)       │
│   Artwork    │ From: [Album Title]→ │
│   (Medium)   │ Track #3 • 3:45      │
│              │ Release Date • Genre │
│              │ Price: $0.00         │
│              │ [Add Song to Cart]   │
│              │ [▶ Play Song]        │
├──────────────┴──────────────────────┤
│ Description / Lyrics                │
│ (formatted text, scrollable)        │
├─────────────────────────────────────┤
│ Credits                             │
│ Primary Artist: Artist Name         │
│ Featured: Artist Name               │
│ Producer: Producer Name             │
│ Songwriter: Songwriter Name         │
├─────────────────────────────────────┤
│ Audio Player (when playing)         │
│ [▶/⏸] ─────●─────  2:15 / 3:45  🔊  │
└─────────────────────────────────────┘
```

#### Data Display
**Song Information:**
- Song title (h1)
- All associated artists with roles
- Parent album info with link (if part of album)
- Track number (if part of album)
- Duration (mm:ss format)
- Release date
- Genre
- Price (displays "$0.00" for MVP)
- Description/lyrics (if provided)

**Credits Section:**
- Primary artist(s)
- Featured artist(s)
- Producer(s)
- Songwriter(s)
- Other contributors (flexible roles)

**Actions:**
- Add song to cart
- Play full song
- Navigate to parent album
- Navigate back to catalog

#### Responsive Behavior
- Mobile: Stacked layout, artwork smaller
- Tablet/Desktop: Side-by-side artwork and info

---

### 5.4 Audio Player Component

#### Purpose
Provide consistent, full-featured audio playback across all pages.

#### Component Type
Client-side component (requires browser APIs).

#### Features
- Play/Pause toggle button
- Progress bar with click-to-seek
- Current time display (mm:ss)
- Total duration display (mm:ss)
- Volume slider (0-100%)
- Mute/unmute toggle
- Loading state indicator
- Error state handling

#### Visual Design
```
┌────────────────────────────────────────────────┐
│ Now Playing: Song Title - Artist Name         │
│ [⏸] ●────────────────── 2:15 / 3:45  🔊 ▓▓▓▓░ │
└────────────────────────────────────────────────┘
```

#### Behavior
- Persists across page navigation (does NOT stop on navigation)
- Only one song plays at a time (starting new song stops current)
- Remembers volume preference (localStorage)
- Auto-advances to next track in album (optional enhancement)
- Streams audio file (doesn't download entire file first)

#### Technical Implementation
- HTML5 `<audio>` element
- React state for playback controls
- Audio URL served from `/uploads/audio/:filename`
- Supported formats: MP3, FLAC, WAV (browser-dependent)

#### Accessibility
- Keyboard controls (space for play/pause, arrows for seek)
- ARIA labels for screen readers
- Focus indicators on interactive elements
- Sufficient color contrast for controls

---

### 5.5 Cart Components

#### Cart Icon (Header)
- Shopping cart icon with badge showing item count
- Visible on all pages
- Updates immediately when items added
- Click to view cart (future feature - just shows count for now)

#### Add to Cart Button
- Appears on catalog items, album detail, song detail
- Clear label: "Add to Cart" or "Add Album to Cart"
- Loading state while request processes
- Success feedback (checkmark animation, toast notification)
- Error feedback if request fails

#### Cart Session Management
- Generate session ID on first cart action (express-session)
- Store session in PostgreSQL (connect-pg-simple)
- Session expires after 7 days of inactivity
- Cart items tied to session_id in database

---

### 5.6 Navigation Component

#### Header Navigation
- Logo/brand name (links to home/catalog)
- Main navigation links:
  - Browse Music (/)
  - About (placeholder for future)
  - Login (placeholder for future spec)
- Cart icon with count badge
- Responsive hamburger menu on mobile

#### Footer
- Copyright information
- Links: Privacy Policy, Terms of Service (placeholders)
- Social media links (placeholders)
- "Powered by Music Store" attribution

---

### 5.7 Error Pages

#### 404 - Not Found
- Friendly message: "Album/Song not found"
- Link back to catalog
- Suggestion: "Browse our full catalog instead"

#### 500 - Server Error
- Generic friendly message: "Something went wrong"
- No technical details exposed
- Link back to home
- Log full error server-side for debugging

---

## 6. API Endpoints

All endpoints follow RESTful conventions with plural nouns and appropriate HTTP methods.

### 6.1 Music Catalog

#### GET `/api/catalog`
Retrieve paginated list of albums and songs.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 24, max: 100)
- `sort` (string: 'newest' | 'artist' | 'title', default: 'newest')
- `type` (string: 'all' | 'albums' | 'songs', default: 'all')

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "album",
      "title": "Album Title",
      "artworkUrl": "/uploads/artwork/album-id.jpg",
      "artist": {
        "id": "uuid",
        "name": "Artist Name"
      },
      "releaseDate": "2024-01-15",
      "genre": "Indie Rock",
      "price": 0.00,
      "duration": 2340
    },
    {
      "id": "uuid",
      "type": "song",
      "title": "Song Title",
      "artworkUrl": "/uploads/artwork/album-id.jpg",
      "artist": {
        "id": "uuid",
        "name": "Artist Name"
      },
      "releaseDate": "2024-01-15",
      "genre": "Indie Rock",
      "price": 0.00,
      "duration": 245
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 240,
    "itemsPerPage": 24
  }
}
```

---

### 6.2 Album Endpoints

#### GET `/api/albums/:id`
Retrieve complete album information with tracks.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Album Title",
  "artworkUrl": "/uploads/artwork/album-id.jpg",
  "releaseDate": "2024-01-15",
  "genre": "Indie Rock",
  "description": "Album description or bio text...",
  "price": 0.00,
  "totalDuration": 2340,
  "artists": [
    {
      "id": "uuid",
      "name": "Primary Artist",
      "role": "primary"
    },
    {
      "id": "uuid",
      "name": "Featured Artist",
      "role": "featured"
    }
  ],
  "tracks": [
    {
      "id": "uuid",
      "trackNumber": 1,
      "title": "Song Title",
      "duration": 245,
      "audioUrl": "/uploads/audio/song-id.mp3"
    }
  ]
}
```

**Response (404 Not Found):**
```json
{
  "error": "Album not found",
  "code": "ALBUM_NOT_FOUND"
}
```

---

### 6.3 Song Endpoints

#### GET `/api/songs/:id`
Retrieve complete song information.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Song Title",
  "trackNumber": 3,
  "duration": 245,
  "audioUrl": "/uploads/audio/song-id.mp3",
  "releaseDate": "2024-01-15",
  "genre": "Indie Rock",
  "description": "Song description...",
  "lyrics": "Full lyrics text...",
  "price": 0.00,
  "album": {
    "id": "uuid",
    "title": "Album Title",
    "artworkUrl": "/uploads/artwork/album-id.jpg"
  },
  "artists": [
    {
      "id": "uuid",
      "name": "Artist Name",
      "role": "primary"
    },
    {
      "id": "uuid",
      "name": "Producer Name",
      "role": "producer"
    }
  ]
}
```

**Response (404 Not Found):**
```json
{
  "error": "Song not found",
  "code": "SONG_NOT_FOUND"
}
```

---

### 6.4 Cart Endpoints

#### POST `/api/cart/items`
Add item to cart.

**Request Body:**
```json
{
  "itemType": "album",
  "itemId": "uuid"
}
```

**Response (201 Created):**
```json
{
  "cartItem": {
    "id": "uuid",
    "itemType": "album",
    "itemId": "uuid",
    "quantity": 1,
    "priceAtAddition": 0.00
  },
  "cartCount": 3
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid item type or ID",
  "code": "INVALID_CART_ITEM"
}
```

#### GET `/api/cart`
Retrieve current cart contents.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "itemType": "album",
      "itemId": "uuid",
      "quantity": 1,
      "priceAtAddition": 0.00,
      "item": {
        "title": "Album Title",
        "artist": "Artist Name",
        "artworkUrl": "/uploads/artwork/album-id.jpg"
      }
    }
  ],
  "totalItems": 3,
  "subtotal": 0.00
}
```

---

### 6.5 Static File Serving

#### GET `/uploads/audio/:filename`
Stream audio file.

**Response:**
- Content-Type: audio/mpeg, audio/flac, audio/wav
- Supports range requests for seeking
- No authentication required (all free in MVP)

#### GET `/uploads/artwork/:filename`
Serve album artwork image.

**Response:**
- Content-Type: image/jpeg, image/png
- Optimized sizes served based on query param `?size=thumb|medium|large`
- Cached with appropriate headers

---

## 7. Database Schema

### Prisma Schema Definition

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Artists
model Artist {
  id              String         @id @default(uuid())
  name            String         @unique
  bio             String?        @db.Text
  profileImageUrl String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relationships
  albumArtists    AlbumArtist[]
  songArtists     SongArtist[]

  @@index([name])
  @@map("artists")
}

// Albums
model Album {
  id                 String        @id @default(uuid())
  title              String
  artworkUrl         String?
  releaseDate        DateTime      @db.Date
  genre              String
  description        String?       @db.Text
  totalDurationSeconds Int         @default(0)
  price              Decimal       @default(0.00) @db.Decimal(10, 2)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  // Relationships
  songs              Song[]
  albumArtists       AlbumArtist[]
  cartItems          CartItem[]

  @@index([releaseDate])
  @@index([genre])
  @@map("albums")
}

// Songs
model Song {
  id              String       @id @default(uuid())
  title           String
  albumId         String?
  trackNumber     Int?
  durationSeconds Int
  audioFileUrl    String
  genre           String
  releaseDate     DateTime     @db.Date
  description     String?      @db.Text
  lyrics          String?      @db.Text
  price           Decimal      @default(0.00) @db.Decimal(10, 2)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relationships
  album           Album?       @relation(fields: [albumId], references: [id], onDelete: SetNull)
  songArtists     SongArtist[]
  cartItems       CartItem[]

  @@unique([albumId, trackNumber])
  @@index([albumId])
  @@index([releaseDate])
  @@map("songs")
}

// Album-Artist relationship (many-to-many with role)
model AlbumArtist {
  id        String   @id @default(uuid())
  albumId   String
  artistId  String
  role      ArtistRole
  createdAt DateTime @default(now())

  // Relationships
  album     Album    @relation(fields: [albumId], references: [id], onDelete: Cascade)
  artist    Artist   @relation(fields: [artistId], references: [id], onDelete: Cascade)

  @@unique([albumId, artistId])
  @@index([albumId])
  @@index([artistId])
  @@map("album_artists")
}

// Song-Artist relationship (many-to-many with role)
model SongArtist {
  id        String        @id @default(uuid())
  songId    String
  artistId  String
  role      SongArtistRole
  createdAt DateTime      @default(now())

  // Relationships
  song      Song          @relation(fields: [songId], references: [id], onDelete: Cascade)
  artist    Artist        @relation(fields: [artistId], references: [id], onDelete: Cascade)

  @@unique([songId, artistId, role])
  @@index([songId])
  @@index([artistId])
  @@map("song_artists")
}

// Cart Items (guest session support)
model CartItem {
  id              String    @id @default(uuid())
  sessionId       String
  itemType        ItemType
  itemId          String
  quantity        Int       @default(1)
  priceAtAddition Decimal   @db.Decimal(10, 2)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relationships (conditional based on itemType)
  album           Album?    @relation(fields: [albumId], references: [id], onDelete: Cascade)
  albumId         String?
  song            Song?     @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId          String?

  @@index([sessionId])
  @@map("cart_items")
}

// Session storage for connect-pg-simple
model Session {
  sid    String   @id
  sess   Json
  expire DateTime

  @@index([expire])
  @@map("sessions")
}

// Enums
enum ArtistRole {
  primary
  featured
  collaborator
}

enum SongArtistRole {
  primary
  featured
  producer
  songwriter
}

enum ItemType {
  album
  song
}
```

### Database Migrations Strategy

1. **Initial Migration**: Creates all tables, relationships, constraints, and indexes
2. **Seed Migration**: Populates database with sample data for testing
3. **Future Migrations**: Additive changes only (no breaking changes in MVP)

### Data Integrity Rules

1. **Referential Integrity**:
   - `Song.albumId` → `Album.id` (SET NULL on delete, allows orphaned singles)
   - `AlbumArtist.albumId` → `Album.id` (CASCADE on delete)
   - `SongArtist.songId` → `Song.id` (CASCADE on delete)
   - `CartItem.albumId/songId` → `Album/Song.id` (CASCADE on delete)

2. **Uniqueness Constraints**:
   - Artist names must be unique
   - Track numbers must be unique within an album
   - Album-Artist relationships cannot be duplicated
   - Song-Artist-Role combinations must be unique

3. **Required Fields**:
   - All titles, release dates, genres are required
   - Audio file URLs are required for songs
   - Artist names are required
   - Session IDs required for cart items

---

## 8. File Structure

```
music-store/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── server/
│   │   ├── index.ts                 # Express app entry point
│   │   ├── config/
│   │   │   ├── database.ts          # Prisma client setup
│   │   │   └── session.ts           # Session configuration
│   │   ├── routes/
│   │   │   ├── api/
│   │   │   │   ├── catalog.ts       # GET /api/catalog
│   │   │   │   ├── albums.ts        # GET /api/albums/:id
│   │   │   │   ├── songs.ts         # GET /api/songs/:id
│   │   │   │   └── cart.ts          # GET /api/cart, POST /api/cart/items
│   │   │   └── pages/
│   │   │       ├── catalog.tsx      # SSR for /
│   │   │       ├── albumDetail.tsx  # SSR for /albums/:id
│   │   │       └── songDetail.tsx   # SSR for /songs/:id
│   │   ├── controllers/
│   │   │   ├── catalogController.ts
│   │   │   ├── albumController.ts
│   │   │   ├── songController.ts
│   │   │   └── cartController.ts
│   │   ├── services/
│   │   │   ├── catalogService.ts    # Business logic for catalog
│   │   │   ├── albumService.ts      # Business logic for albums
│   │   │   ├── songService.ts       # Business logic for songs
│   │   │   └── cartService.ts       # Business logic for cart
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts      # Centralized error handling
│   │   │   ├── sessionMiddleware.ts # Session setup
│   │   │   └── renderMiddleware.ts  # React SSR setup
│   │   └── utils/
│   │       ├── formatters.ts        # Date, duration formatting
│   │       └── validators.ts        # Input validation
│   ├── client/
│   │   ├── components/
│   │   │   ├── AudioPlayer.tsx      # Client-side audio player
│   │   │   ├── AddToCartButton.tsx  # Client-side cart action
│   │   │   ├── Navigation.tsx       # Header navigation
│   │   │   ├── Footer.tsx           # Footer component
│   │   │   ├── ViewToggle.tsx       # Grid/List toggle
│   │   │   └── Pagination.tsx       # Pagination controls
│   │   ├── pages/
│   │   │   ├── CatalogPage.tsx      # Catalog page container
│   │   │   ├── AlbumDetailPage.tsx  # Album detail container
│   │   │   └── SongDetailPage.tsx   # Song detail container
│   │   ├── hooks/
│   │   │   ├── useAudioPlayer.ts    # Audio player state
│   │   │   └── useCart.ts           # Cart state management
│   │   └── styles/
│   │       └── globals.css          # Tailwind imports
│   ├── shared/
│   │   ├── types/
│   │   │   ├── album.ts             # Album type definitions
│   │   │   ├── song.ts              # Song type definitions
│   │   │   ├── artist.ts            # Artist type definitions
│   │   │   └── cart.ts              # Cart type definitions
│   │   └── constants/
│   │       ├── pagination.ts        # Pagination defaults
│   │       └── formats.ts           # Audio/image format constants
│   └── types/
│       └── express.d.ts             # Extended Express types
├── uploads/
│   ├── audio/                       # Audio files storage
│   └── artwork/                     # Album artwork storage
├── public/
│   └── placeholder.jpg              # Default album artwork
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       └── user-flows/
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 9. Implementation Notes

### 9.1 Server-Side Rendering Setup

React SSR will be implemented using Express with React rendering:

```typescript
// Conceptual approach - NOT actual implementation code
// Server renders React components to HTML string
// Includes initial data as JSON in script tag
// Client hydrates with same data to avoid mismatches
```

**Key Points**:
- All pages render complete HTML on server
- Initial data embedded in page for hydration
- Client-side React takes over for interactivity
- No flash of unstyled content (FOUC)

### 9.2 Session Management

Using `express-session` with PostgreSQL storage:

```typescript
// Conceptual configuration - NOT actual implementation
// Session ID stored in cookie
// Session data stored in PostgreSQL sessions table
// Cart items reference session ID
// 7-day expiration with rolling updates
```

**Key Points**:
- Secure session cookies (httpOnly, secure in production)
- PostgreSQL persistence (survives server restarts)
- Automatic cleanup of expired sessions
- No authentication required for guest sessions

### 9.3 Audio Streaming

Audio files served with range request support:

**Key Points**:
- Express static middleware for `/uploads/audio`
- Range header support for seeking
- No authentication checks (all free in MVP)
- MIME type detection based on file extension
- Streaming response (doesn't load entire file)

### 9.4 Image Optimization

Album artwork served in multiple sizes:

**Key Points**:
- Original images stored in `/uploads/artwork/`
- On-demand resizing using sharp library
- Three sizes: thumb (150x150), medium (300x300), large (600x600)
- Cached on filesystem after first generation
- Served with appropriate cache headers

### 9.5 Error Handling Strategy

Centralized error handling middleware:

**Key Points**:
- All route errors caught by error middleware
- Client-friendly messages (no stack traces)
- Server-side logging of full error details
- Appropriate HTTP status codes
- Consistent JSON error format for API
- Rendered error pages for SSR routes

### 9.6 TypeScript Configuration

Strict mode enabled for type safety:

**Key Points**:
- `strict: true` in tsconfig.json
- Separate configs for client/server if needed
- Shared types in `/src/shared/types/`
- Prisma generates types automatically
- No `any` types allowed (use `unknown` if needed)

### 9.7 Responsive Design Approach

Mobile-first Tailwind CSS:

**Breakpoints**:
- Default styles: Mobile (< 640px)
- `sm:` tablet (>= 640px)
- `md:` small desktop (>= 768px)
- `lg:` large desktop (>= 1024px)

**Key Patterns**:
- Stack layouts on mobile, side-by-side on desktop
- Touch-friendly button sizes (min 44x44px)
- Simplified navigation on mobile (hamburger menu)
- Larger text on mobile for readability
- Hide secondary information on small screens

### 9.8 Performance Considerations

**Database Query Optimization**:
- Use indexes on foreign keys and sort fields
- Eager load relationships with Prisma `include`
- Limit query results with pagination
- Select only needed fields with Prisma `select`

**Asset Optimization**:
- Serve optimized image sizes based on viewport
- Use appropriate cache headers for static assets
- Lazy load images below the fold
- Compress audio files appropriately

**SSR Performance**:
- Cache rendered pages (optional, not in MVP)
- Minimize data fetching on server
- Stream HTML responses when possible

### 9.9 Accessibility Requirements

**Semantic HTML**:
- Proper heading hierarchy (h1, h2, h3)
- Semantic elements (nav, main, footer, article)
- Form labels associated with inputs

**Keyboard Navigation**:
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Skip to content link

**Screen Reader Support**:
- ARIA labels on icon buttons
- ARIA live regions for dynamic updates (cart count)
- Alt text for all images
- Audio player controls labeled

**Color Contrast**:
- WCAG AA minimum (4.5:1 for text)
- Don't rely solely on color for information

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Coverage Areas**:
- Service layer business logic
- Utility functions (formatters, validators)
- Helper functions

**Example Test Cases**:
- `formatDuration()` correctly formats seconds to mm:ss
- `catalogService.getSortedCatalog()` applies correct ORDER BY
- `validateCartItem()` rejects invalid item types

**Tools**: Jest, ts-jest

---

### 10.2 Integration Tests

**Coverage Areas**:
- API endpoints with database
- Controller + Service integration
- Database queries and relationships

**Example Test Cases**:
- GET `/api/catalog?sort=newest` returns albums in descending release date order
- GET `/api/albums/:id` includes all tracks and artists
- POST `/api/cart/items` creates cart item in database
- GET `/api/songs/:id` returns 404 for non-existent song

**Tools**: Jest, Supertest, test database

**Setup Requirements**:
- Separate test database
- Reset database between tests
- Seed minimal test data

---

### 10.3 E2E Tests

**Coverage Areas**:
- Critical user flows
- Multi-page interactions
- Client-side + server-side integration

**Example Test Cases**:
1. **Browse and View Album**:
   - Navigate to catalog page
   - Verify albums displayed
   - Click on album
   - Verify album detail page loads
   - Verify tracks displayed

2. **Play Audio**:
   - Navigate to album detail
   - Click play on a track
   - Verify audio player appears
   - Verify audio plays
   - Verify seek works

3. **Add to Cart**:
   - Navigate to catalog
   - Click "Add to Cart" on album
   - Verify cart count increments
   - Navigate to different page
   - Verify cart count persists

4. **Sort and Paginate**:
   - Navigate to catalog
   - Change sort to "Artist A-Z"
   - Verify order changes
   - Click next page
   - Verify new items load
   - Verify sort persists

**Tools**: Playwright or Cypress

**Setup Requirements**:
- Seeded test database with known data
- Headless browser testing
- Visual regression testing (optional)

---

### 10.4 Manual Testing Checklist

Before considering feature complete, manually verify:

- [ ] Catalog displays all albums and songs
- [ ] Grid and list views both work
- [ ] Sorting by newest, artist, and title works
- [ ] Pagination works correctly
- [ ] Album detail page shows all information
- [ ] Song detail page shows all information
- [ ] Audio player plays songs completely
- [ ] Audio player controls (play/pause, seek, volume) work
- [ ] Add to cart updates count immediately
- [ ] Cart persists across page navigation
- [ ] 404 pages display for missing albums/songs
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Keyboard navigation works throughout
- [ ] Screen reader can navigate and understand content
- [ ] No console errors in browser
- [ ] No server errors in logs during normal operation

---

## Success Criteria

This specification will be considered successfully implemented when:

1. **Functional Completeness**:
   - Users can browse all music in the catalog
   - Users can view complete album and song details
   - Users can play full songs in their browser
   - Users can add albums and songs to their cart
   - All features work without authentication

2. **Technical Quality**:
   - All pages render with SSR
   - All API endpoints return correct data
   - Database relationships work correctly
   - No errors in console or server logs during normal operation
   - TypeScript compiles with no errors

3. **User Experience**:
   - Pages load in under 2 seconds on local development
   - Audio begins playing within 1 second of clicking play
   - Responsive design works smoothly on all viewport sizes
   - Navigation is intuitive and consistent

4. **Test Coverage**:
   - Unit tests pass for all utilities and services
   - Integration tests pass for all API endpoints
   - E2E tests pass for all critical user flows
   - Manual testing checklist completed

5. **Code Quality**:
   - Code follows standards defined in `/agent-os/standards/`
   - TypeScript strict mode enabled with no violations
   - ESLint and Prettier rules followed
   - Clear, meaningful naming conventions used

---

## Appendix: Standards Compliance

This specification adheres to the following user-defined standards:

### Tech Stack Alignment
- **Backend**: Express.js + TypeScript + Prisma + PostgreSQL
- **Frontend**: React (SSR) + Tailwind CSS
- **Testing**: Jest + Supertest + Playwright

### API Conventions
- RESTful design with resource-based URLs
- Plural nouns for endpoints (`/albums`, `/songs`)
- Query parameters for filtering, sorting, pagination
- Appropriate HTTP status codes (200, 201, 400, 404, 500)

### Database Models
- Timestamps on all tables (`createdAt`, `updatedAt`)
- Foreign key constraints for referential integrity
- Indexes on foreign keys and frequently queried fields
- Proper cascade behaviors defined

### Component Architecture
- Single responsibility components
- Clear prop interfaces
- Reusable, composable design
- Minimal prop counts

### Responsive Design
- Mobile-first approach with Tailwind
- Standard breakpoints (640px, 768px, 1024px)
- Touch-friendly targets (min 44x44px)
- Readable typography across viewports

### Error Handling
- User-friendly messages (no technical details)
- Centralized error handling middleware
- Graceful degradation where possible
- Proper resource cleanup

---

## File Locations Reference

**Specification Document**: `/Users/pedroalejandroavila/Documents/lidr/Claude code/music store/agent-os/specs/2025-10-23-music-store-platform/spec.md`

**Requirements Document**: `/Users/pedroalejandroavila/Documents/lidr/Claude code/music store/agent-os/specs/2025-10-23-music-store-platform/planning/requirements.md`

**Standards Directory**: `/Users/pedroalejandroavila/Documents/lidr/Claude code/music store/agent-os/standards/`
