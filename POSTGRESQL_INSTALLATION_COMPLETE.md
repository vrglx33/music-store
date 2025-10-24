# PostgreSQL Installation Complete ✅

## Installation Summary

PostgreSQL 14.19 has been successfully installed and configured for the Music Store project.

## What Was Installed

- **PostgreSQL Version**: 14.19 (Homebrew)
- **Database Name**: `music_store`
- **Service Status**: Running (starts automatically on login)
- **Connection String**: `postgresql://pedroalejandroavila@localhost:5432/music_store`

## Verification

✅ PostgreSQL service started successfully
✅ Database `music_store` created
✅ Connection tested and working
✅ .env file updated with correct connection string

## PostgreSQL Service Management

### Start PostgreSQL
```bash
brew services start postgresql@14
```

### Stop PostgreSQL
```bash
brew services stop postgresql@14
```

### Restart PostgreSQL
```bash
brew services restart postgresql@14
```

### Check Status
```bash
brew services list | grep postgresql
```

## Database Access

### Connect to database via command line
```bash
/opt/homebrew/opt/postgresql@14/bin/psql -d music_store
```

### Or use the full connection string
```bash
/opt/homebrew/opt/postgresql@14/bin/psql "postgresql://pedroalejandroavila@localhost:5432/music_store"
```

## Add PostgreSQL to PATH (Optional)

To use `psql` and other PostgreSQL commands without the full path, add this to your `~/.zshrc` or `~/.bashrc`:

```bash
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

## Environment Configuration

Your `.env` file has been updated with the correct database connection:

```
DATABASE_URL="postgresql://pedroalejandroavila@localhost:5432/music_store"
```

## Next Steps

You're now ready to proceed with **GROUP 2: Database Schema & Migrations**

This will include:
- Creating Prisma schema
- Running database migrations
- Setting up database models

## Useful Commands

### View all databases
```bash
/opt/homebrew/opt/postgresql@14/bin/psql -l
```

### Drop database (if needed to start fresh)
```bash
/opt/homebrew/opt/postgresql@14/bin/dropdb music_store
/opt/homebrew/opt/postgresql@14/bin/createdb music_store
```

### Backup database
```bash
/opt/homebrew/opt/postgresql@14/bin/pg_dump music_store > backup.sql
```

### Restore database
```bash
/opt/homebrew/opt/postgresql@14/bin/psql music_store < backup.sql
```

## Troubleshooting

### If PostgreSQL won't start
```bash
brew services restart postgresql@14
```

### If connection fails
1. Check PostgreSQL is running: `brew services list`
2. Verify database exists: `/opt/homebrew/opt/postgresql@14/bin/psql -l`
3. Check connection string in `.env` file

### View PostgreSQL logs
```bash
tail -f /opt/homebrew/var/log/postgresql@14.log
```

---

**Installation completed**: 2025-10-24
**Project**: Music Store Platform
**Environment**: Development (macOS)
