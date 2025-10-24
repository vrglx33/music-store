/**
 * Session Configuration
 * Express session setup with PostgreSQL storage
 */

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';

const PgSession = connectPgSimple(session);

// Create PostgreSQL connection pool for sessions
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Session configuration
export const sessionConfig: session.SessionOptions = {
  store: new PgSession({
    pool,
    tableName: 'sessions',
    createTableIfMissing: false, // We handle schema via Prisma migrations
  }),
  secret:
    process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
  },
  name: 'musicstore.sid',
};

// Export configured session middleware
export const sessionMiddleware = session(sessionConfig);
