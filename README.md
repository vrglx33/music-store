# Music Store Platform

A digital marketplace platform for independent artists to sell music and for music lovers to discover new content.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL

Install PostgreSQL if not already installed:

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-14
sudo systemctl start postgresql
```

### 3. Create Database

```bash
createdb music_store
```

Or using psql:
```bash
psql -U postgres
CREATE DATABASE music_store;
\q
```

### 4. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env` if needed:
```
DATABASE_URL="postgresql://username:password@localhost:5432/music_store"
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

### 6. Seed Database (Optional)

```bash
npm run prisma:seed
```

## Development

Start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
music-store/
├── prisma/              # Database schema and migrations
├── src/
│   ├── server/          # Backend Express server
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API and page routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   ├── client/          # Frontend React components
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── styles/      # CSS and styling
│   ├── shared/          # Shared code between client/server
│   │   ├── types/       # TypeScript type definitions
│   │   └── constants/   # Shared constants
│   └── types/           # Type extensions
├── uploads/             # File storage
│   ├── audio/           # Audio files
│   └── artwork/         # Album artwork
└── public/              # Static assets

```

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Frontend**: React 18 with Server-Side Rendering
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5+
- **Styling**: Tailwind CSS
- **Session Store**: connect-pg-simple

## License

MIT
# music-store
