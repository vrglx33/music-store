# Music Store Platform - Deployment Guide

This guide covers multiple deployment options for the Music Store Platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Docker Deployment](#docker-deployment)
3. [Platform-Specific Deployments](#platform-specific-deployments)
4. [Production Checklist](#production-checklist)
5. [Database Migrations](#database-migrations)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

- Docker & Docker Compose (for containerized deployment)
- PostgreSQL 14+ (for non-containerized deployment)
- Node.js 18+ (for non-containerized deployment)
- Domain name (for production)
- SSL certificate (recommended for production)

## Docker Deployment

### Option 1: Using Docker Compose (Recommended)

1. **Clone and prepare the repository:**
   ```bash
   git clone <your-repo-url>
   cd music-store
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   nano .env
   ```

3. **Set strong passwords and secrets:**
   ```bash
   # Generate a strong session secret
   export SESSION_SECRET=$(openssl rand -base64 32)
   export DB_PASSWORD=$(openssl rand -base64 24)
   
   # Add to .env or use docker-compose environment
   echo "SESSION_SECRET=${SESSION_SECRET}" >> .env
   echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
   ```

4. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations:**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

6. **Optional: Seed database with sample data:**
   ```bash
   docker-compose exec app npm run prisma:seed
   ```

7. **Verify deployment:**
   ```bash
   curl http://localhost:3000/health
   ```

### Option 2: Docker Build Only

1. **Build the image:**
   ```bash
   docker build -t music-store:latest .
   ```

2. **Run with external PostgreSQL:**
   ```bash
   docker run -d \
     --name music-store-app \
     -p 3000:3000 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/music_store" \
     -e SESSION_SECRET="your-secret-key" \
     -e NODE_ENV="production" \
     -v $(pwd)/uploads:/app/uploads \
     music-store:latest
   ```

## Platform-Specific Deployments

### Deploy to Railway

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize project:**
   ```bash
   railway init
   ```

3. **Add PostgreSQL:**
   ```bash
   railway add --plugin postgresql
   ```

4. **Set environment variables:**
   ```bash
   railway variables set SESSION_SECRET=$(openssl rand -base64 32)
   railway variables set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Run migrations:**
   ```bash
   railway run npm run prisma:migrate deploy
   ```

### Deploy to Render

1. **Create a new Web Service** on [Render](https://render.com)

2. **Configure the service:**
   - Build Command: `npm install && npm run build && npx prisma generate`
   - Start Command: `npx prisma migrate deploy && npm start`
   - Environment: `Node`

3. **Add PostgreSQL database:**
   - Create a new PostgreSQL database in Render
   - Copy the Internal Database URL

4. **Set environment variables:**
   ```
   DATABASE_URL=<your-postgres-url>
   SESSION_SECRET=<generate-random-secret>
   NODE_ENV=production
   PORT=3000
   ```

5. **Add disk for uploads:**
   - Add a disk mount at `/app/uploads`

### Deploy to Heroku

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create app and add PostgreSQL:**
   ```bash
   heroku create music-store-platform
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **Run migrations:**
   ```bash
   heroku run npm run prisma:migrate deploy
   ```

### Deploy to DigitalOcean App Platform

1. **Create a new app** in DigitalOcean App Platform

2. **Connect your repository**

3. **Add components:**
   - Web Service (your app)
   - Database (PostgreSQL)

4. **Configure build settings:**
   - Build Command: `npm install && npm run build && npx prisma generate`
   - Run Command: `npx prisma migrate deploy && npm start`

5. **Set environment variables:**
   ```
   DATABASE_URL=${db.DATABASE_URL}
   SESSION_SECRET=<generate-random-secret>
   NODE_ENV=production
   ```

### Deploy to AWS (EC2 with Docker)

1. **Launch EC2 instance** (Ubuntu 22.04 LTS recommended)

2. **Install Docker and Docker Compose:**
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker ubuntu
   ```

3. **Clone repository:**
   ```bash
   git clone <your-repo-url>
   cd music-store
   ```

4. **Configure environment and deploy:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   docker-compose up -d
   ```

5. **Set up Nginx reverse proxy** (recommended):
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

   Create `/etc/nginx/sites-available/music-store`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable site and get SSL:
   ```bash
   sudo ln -s /etc/nginx/sites-available/music-store /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Deploy to Google Cloud Run

1. **Install gcloud CLI and authenticate**

2. **Build and push to Container Registry:**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/music-store
   ```

3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy music-store \
     --image gcr.io/PROJECT_ID/music-store \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,SESSION_SECRET=your-secret \
     --set-cloudsql-instances PROJECT_ID:REGION:INSTANCE_NAME
   ```

## Production Checklist

### Security
- [ ] Use strong, randomly generated SESSION_SECRET
- [ ] Use strong database password
- [ ] Enable SSL/TLS (HTTPS)
- [ ] Set up firewall rules
- [ ] Configure CORS appropriately
- [ ] Keep dependencies updated
- [ ] Use environment variables for all secrets
- [ ] Enable database encryption at rest

### Performance
- [ ] Enable database connection pooling
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images and audio files
- [ ] Set up database indexes (already in schema)
- [ ] Monitor memory and CPU usage

### Reliability
- [ ] Set up automated backups
- [ ] Configure health checks
- [ ] Set up monitoring and alerts
- [ ] Implement logging (structured logs)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure auto-restart on failure
- [ ] Test disaster recovery

### Storage
- [ ] Configure persistent volume for uploads
- [ ] Set up backup strategy for uploaded files
- [ ] Consider object storage (S3, GCS) for uploads
- [ ] Set file size limits

## Database Migrations

### Running Migrations in Production

**Important:** Always backup your database before running migrations!

1. **Backup database:**
   ```bash
   # Docker
   docker-compose exec postgres pg_dump -U musicstore music_store > backup.sql
   
   # Standalone
   pg_dump -U username music_store > backup.sql
   ```

2. **Run migrations:**
   ```bash
   # Docker
   docker-compose exec app npx prisma migrate deploy
   
   # Standalone
   npm run prisma:migrate deploy
   ```

3. **Verify migration:**
   ```bash
   docker-compose exec app npx prisma migrate status
   ```

### Rollback Strategy

If a migration fails:

1. Restore from backup:
   ```bash
   psql -U username music_store < backup.sql
   ```

2. Check migration status:
   ```bash
   npx prisma migrate status
   ```

3. Fix migration issue and redeploy

## Monitoring & Maintenance

### Health Checks

Monitor the `/health` endpoint:
```bash
curl https://yourdomain.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

### Logging

View application logs:
```bash
# Docker
docker-compose logs -f app

# Check specific number of lines
docker-compose logs --tail=100 app
```

### Database Backups

Set up automated backups (example cron job):
```bash
# Add to crontab (crontab -e)
0 2 * * * docker-compose exec -T postgres pg_dump -U musicstore music_store | gzip > /backups/music_store_$(date +\%Y\%m\%d).sql.gz
```

### Updates and Maintenance

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart:**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. **Run any new migrations:**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

### Scaling Considerations

For high traffic:

1. **Horizontal scaling:**
   - Use load balancer (nginx, HAProxy, or cloud load balancer)
   - Run multiple app containers
   - Use shared session store (Redis)

2. **Database optimization:**
   - Set up read replicas
   - Optimize queries
   - Implement caching layer

3. **File storage:**
   - Move uploads to object storage (S3, GCS, etc.)
   - Use CDN for media files

## Troubleshooting

### Common Issues

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check database is running: `docker-compose ps`
- Check network connectivity

**Port already in use:**
- Change PORT in .env or docker-compose.yml
- Or stop conflicting service

**Upload failures:**
- Check uploads directory permissions
- Verify volume mount in docker-compose.yml
- Check disk space

**Build failures:**
- Clear Docker cache: `docker-compose build --no-cache`
- Verify all dependencies are in package.json

## Support

For issues or questions:
- Check application logs
- Review health check endpoint
- Verify environment variables
- Check database connectivity

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| SESSION_SECRET | Yes | - | Secret for session encryption |
| NODE_ENV | No | development | Environment (production/development) |
| PORT | No | 3000 | Application port |
| DB_PASSWORD | No | changeme123 | Database password (Docker Compose) |
