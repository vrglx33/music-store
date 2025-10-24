# Setup Instructions for Music Store Platform

This document provides detailed setup instructions for the Music Store platform.

## Step 1: Install PostgreSQL

### macOS

Using Homebrew:
```bash
brew install postgresql@14
brew services start postgresql@14
```

Using Postgres.app:
1. Download from https://postgresapp.com/
2. Move to Applications folder
3. Open Postgres.app
4. Click "Initialize" to create a new server

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install postgresql-14 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows

1. Download installer from https://www.postgresql.org/download/windows/
2. Run the installer
3. Follow the setup wizard
4. Remember the password you set for the postgres user

## Step 2: Create the Database

### Option A: Using createdb (macOS/Linux)

```bash
# If PostgreSQL is running under your user account
createdb music_store

# If you need to specify a user
createdb -U postgres music_store
```

### Option B: Using psql

```bash
# Connect to PostgreSQL
psql -U postgres

# Or on macOS with Postgres.app
psql

# Create the database
CREATE DATABASE music_store;

# Verify it was created
\l

# Exit psql
\q
```

### Option C: Using Prisma (if database exists)

If you have connection issues, Prisma can help diagnose:

```bash
npx prisma db push
```

## Step 3: Verify Database Connection

Test your database connection:

```bash
# Try connecting to the database
psql -U postgres -d music_store

# Or with your username
psql -d music_store
```

If successful, you should see:
```
psql (14.x)
Type "help" for help.

music_store=#
```

## Step 4: Configure Environment Variables

The `.env` file has already been created. Update it if your database connection differs:

```bash
# Default configuration (works for local development)
DATABASE_URL="postgresql://localhost:5432/music_store"

# If you need username/password
DATABASE_URL="postgresql://username:password@localhost:5432/music_store"

# For Postgres.app on macOS
DATABASE_URL="postgresql://localhost:5432/music_store"
```

## Step 5: Initialize Prisma

Once the database is created and connection is verified:

```bash
# Initialize Prisma schema
npx prisma init

# This will be done in the next task group
```

## Troubleshooting

### "FATAL: database does not exist"

Create the database first:
```bash
createdb music_store
```

### "FATAL: role does not exist"

On macOS, create a postgres user:
```bash
createuser -s postgres
```

### "connection refused"

PostgreSQL is not running. Start it:
```bash
# macOS with Homebrew
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Permission Denied

Grant yourself superuser privileges:
```bash
psql -U postgres
ALTER USER your_username WITH SUPERUSER;
```

## Next Steps

After database setup is complete, proceed to:
1. Run migrations (GROUP 2)
2. Seed the database (GROUP 3)
3. Start the development server

## Verification Checklist

- [ ] PostgreSQL is installed
- [ ] PostgreSQL service is running
- [ ] Database `music_store` exists
- [ ] Can connect to database via psql
- [ ] `.env` file contains correct DATABASE_URL
- [ ] All npm dependencies installed
