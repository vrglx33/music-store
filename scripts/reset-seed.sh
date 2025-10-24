#!/bin/bash

# Reset Seed Script for Music Store Database
# This script clears the database and re-runs the seed script

echo "🔄 Resetting database and re-seeding..."
echo ""

# Run Prisma migrate reset (this will drop the database, recreate it, run migrations, and seed)
npx prisma migrate reset --force

echo ""
echo "✅ Database has been reset and re-seeded!"
echo "🎵 Your music catalog is ready to browse."
