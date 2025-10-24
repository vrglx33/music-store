# Tech Stack

This document defines the complete technical stack for the Music Store application. All technologies are focused on local development with TypeScript throughout.

## Framework & Runtime

- **Backend Framework:** Express.js
- **Language/Runtime:** Node.js with TypeScript
- **Package Manager:** npm
- **Type System:** TypeScript (strict mode enabled)

## Frontend

- **JavaScript Framework:** React with Server-Side Rendering (SSR)
- **UI Rendering:** React SSR via Express middleware
- **CSS Framework:** TBD (recommend Tailwind CSS or CSS Modules)
- **UI Components:** Custom components built with React and TypeScript
- **Client-Side Hydration:** React hydration for interactive components post-SSR

## Database & Storage

- **Database:** PostgreSQL (local instance for development)
- **ORM/Query Builder:** Prisma (TypeScript-first ORM with excellent type safety)
- **File Storage:** Local filesystem storage for uploaded music files and album artwork
- **Session Storage:** Express session middleware with database-backed sessions (PostgreSQL)
- **Caching:** In-memory caching for development (optional Redis for later optimization)

## Authentication & Security

- **Authentication Strategy:** JWT (JSON Web Tokens) for stateless authentication
- **Password Hashing:** bcrypt for secure password storage
- **Session Management:** express-session with connect-pg-simple for PostgreSQL session store
- **Role-Based Access Control:** Custom middleware for buyer/artist/admin roles
- **CSRF Protection:** csurf middleware for form submissions
- **Input Validation:** express-validator for request validation

## File Handling

- **File Upload:** multer middleware for handling multipart/form-data
- **Audio Format Support:** MP3, FLAC, WAV (validation via file-type package)
- **Image Processing:** sharp for album artwork resizing and optimization
- **Audio Metadata:** music-metadata for extracting ID3 tags and audio information
- **File Storage Structure:** Organized by artist ID and upload date in local directories

## Testing & Quality

- **Test Framework:** Jest for unit and integration testing
- **Test Coverage:** Jest coverage reports
- **API Testing:** Supertest for HTTP endpoint testing
- **Type Checking:** TypeScript compiler (tsc) with strict type checking
- **Linting:** ESLint with TypeScript plugin
- **Formatting:** Prettier for consistent code formatting
- **Pre-commit Hooks:** Husky + lint-staged for automated code quality checks

## Development Tools

- **Development Server:** nodemon for auto-restart on file changes
- **Build Tool:** TypeScript compiler (tsc) with separate configs for client/server
- **Environment Variables:** dotenv for local configuration management
- **Debugging:** Node.js inspector with VS Code debugging support
- **API Documentation:** JSDoc comments with TypeScript type annotations
- **Database Migrations:** Prisma Migrate for schema version control

## Payment Processing

- **Payment Gateway:** Stripe (using test mode API keys for local development)
- **Stripe Integration:** stripe npm package
- **Webhook Handling:** Express endpoint for Stripe webhook events (test mode)

## Email (Optional/Future)

- **Email Service:** nodemailer with local SMTP server (Ethereal for testing)
- **Email Templates:** Handlebars or React-email for template rendering

## Additional Utilities

- **Date/Time Handling:** date-fns for date manipulation and formatting
- **Data Validation:** Zod or Joi for runtime schema validation
- **Logging:** winston or pino for structured logging to console and files
- **Environment Management:** cross-env for cross-platform environment variables

## Project Structure

```
music-store/
├── src/
│   ├── server/              # Backend Express application
│   │   ├── routes/          # API and page routes
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Prisma models and database queries
│   │   ├── middleware/      # Authentication, validation, error handling
│   │   ├── services/        # Business logic (payments, file storage)
│   │   └── utils/           # Helper functions
│   ├── client/              # React frontend components
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page-level components for SSR
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Client-side utilities
│   ├── shared/              # Shared types and utilities
│   │   ├── types/           # TypeScript interfaces and types
│   │   └── constants/       # Shared constants
│   └── uploads/             # Local file storage (gitignored)
├── prisma/
│   ├── schema.prisma        # Prisma database schema
│   └── migrations/          # Database migration history
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── public/                 # Static assets
├── .env                    # Environment variables (gitignored)
├── .env.example           # Example environment configuration
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest testing configuration
├── .eslintrc.js          # ESLint configuration
└── package.json          # Dependencies and scripts
```

## Development Workflow

1. **Local Database:** Run PostgreSQL locally via Docker or native installation
2. **Environment Setup:** Copy `.env.example` to `.env` and configure local settings
3. **Database Migrations:** Run `npx prisma migrate dev` to set up database schema
4. **Development Server:** Run `npm run dev` to start nodemon with TypeScript compilation
5. **Type Checking:** Run `npm run type-check` to verify TypeScript types
6. **Linting:** Run `npm run lint` to check code quality
7. **Testing:** Run `npm test` to execute Jest test suite
8. **Database GUI:** Use Prisma Studio (`npx prisma studio`) for database inspection

## Excluded Technologies

The following are explicitly NOT part of this stack due to local development focus:

- **No Deployment Tools:** No Docker compose, Kubernetes, or cloud deployment configurations
- **No Monitoring:** No APM tools, error tracking services, or production monitoring
- **No CI/CD:** No GitHub Actions, CircleCI, or automated deployment pipelines
- **No Cloud Services:** No AWS S3, CloudFront, or cloud-hosted databases
- **No Production Optimizations:** Focus on development experience over production performance

## Future Considerations

When transitioning from local development to production, consider:

- Docker containerization for consistent deployment environments
- CDN for static asset delivery
- Cloud storage (S3) for music files and artwork
- Redis for session storage and caching
- Application monitoring and error tracking
- Automated backup systems for database and file storage
- Load balancing and horizontal scaling strategies
