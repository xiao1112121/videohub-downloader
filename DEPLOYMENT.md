# Deployment Guide 🚀

Complete guide for deploying VideoHub Downloader to production.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
3. [VPS Deployment](#vps-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Monitoring](#monitoring)

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose (optional)

### Frontend Dockerfile

Create `videohub-frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["npm", "start"]
```

### Backend Dockerfile

Create `videohub-backend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  frontend:
    build: ./videohub-frontend
    container_name: videohub-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api
    depends_on:
      - backend
    networks:
      - videohub-network
    restart: unless-stopped

  backend:
    build: ./videohub-backend
    container_name: videohub-backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      CORS_ORIGIN: http://frontend:3000
      RATE_LIMIT_WINDOW: 3600000
      RATE_LIMIT_MAX_REQUESTS: 100
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - redis
    networks:
      - videohub-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: videohub-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - videohub-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: videohub-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - videohub-network
    restart: unless-stopped

volumes:
  redis-data:

networks:
  videohub-network:
    driver: bridge
```

### Start Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Vercel Deployment (Frontend)

### Prerequisites

- Vercel account (free)
- Git repository

### Deployment Steps

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Select your Git repository

2. **Configure Project**
   - Framework: Next.js
   - Root Directory: `videohub-frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables**
   - Add `NEXT_PUBLIC_API_URL`: Your backend URL
   - Example: `https://api.yourdomain.com/api`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain

### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set production alias
vercel alias set videohub-frontend.vercel.app videohub.yourdomain.com
```

## VPS Deployment

### Prerequisites

- Ubuntu 20.04+ server
- SSH access
- Domain name (optional)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install npm
sudo npm install -g npm@latest

# Install Git
sudo apt install -y git

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Clone Repository

```bash
cd /var/www
sudo git clone <your-repo-url> videohub
sudo chown -R $USER:$USER videohub
cd videohub
```

### 3. Install Dependencies

```bash
# Backend
cd videohub-backend
npm install
npm run build

# Frontend
cd ../videohub-frontend
npm install
npm run build
```

### 4. Configure Environment Variables

```bash
# Backend
cd videohub-backend
cp .env.example .env
# Edit .env with production values
sudo nano .env

# Frontend
cd ../videohub-frontend
cp .env.example .env.local
# Edit .env.local with production API URL
sudo nano .env.local
```

### 5. Start Applications with PM2

```bash
# Backend
cd /var/www/videohub/videohub-backend
pm2 start npm --name "videohub-api" -- start

# Frontend
cd /var/www/videohub/videohub-frontend
pm2 start npm --name "videohub-web" -- start

# Save PM2 configuration
pm2 save

# Auto-start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
```

### 6. Configure Nginx

Create `/etc/nginx/sites-available/videohub`:

```nginx
upstream frontend {
    server 127.0.0.1:3000;
}

upstream backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    client_max_body_size 10M;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/videohub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Enable HTTPS (SSL)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## AWS Deployment

### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p "Node.js 18 running on 64bit Amazon Linux 2"

# Create environment
eb create videohub-env

# Deploy
eb deploy

# View logs
eb logs

# Open in browser
eb open
```

### Using EC2 + RDS

1. Launch EC2 instance (Ubuntu 20.04)
2. Follow VPS deployment steps above
3. Create RDS instance for database
4. Configure security groups for communication

## Monitoring

### Health Checks

```bash
# Frontend
curl https://yourdomain.com

# Backend API
curl https://yourdomain.com/api/health
```

### PM2 Monitoring

```bash
# View all processes
pm2 list

# Real-time monitoring
pm2 monit

# View logs
pm2 logs videohub-api
pm2 logs videohub-web

# Restart
pm2 restart videohub-api
pm2 restart videohub-web
```

### Nginx Monitoring

```bash
# Check syntax
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Reload configuration
sudo nginx -s reload
```

### Create Monitoring Script

Create `monitor.sh`:

```bash
#!/bin/bash

# Check frontend
if ! curl -f http://localhost:3000 > /dev/null; then
    echo "Frontend is down!"
    pm2 restart videohub-web
fi

# Check backend
if ! curl -f http://localhost:3001/api/health > /dev/null; then
    echo "Backend is down!"
    pm2 restart videohub-api
fi

# Check Redis
if ! redis-cli ping > /dev/null; then
    echo "Redis is down!"
    systemctl restart redis-server
fi
```

Schedule with cron:

```bash
# Run every 5 minutes
*/5 * * * * /var/www/videohub/monitor.sh >> /var/log/videohub-monitor.log 2>&1
```

## Performance Tuning

### Nginx Optimization

```nginx
# In /etc/nginx/nginx.conf

http {
    # Connection settings
    keepalive_timeout 65;
    client_max_body_size 20M;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/json application/javascript;
    
    # Caching
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;
}
```

### Node.js Optimization

```bash
# Increase file descriptors
sudo nano /etc/security/limits.conf
# Add:
videohub soft nofile 65536
videohub hard nofile 65536

# Restart services
pm2 restart all
```

### Database Optimization

For production, upgrade to:
- PostgreSQL (instead of in-memory)
- Redis for caching
- MongoDB for logs

## Backup & Recovery

### Backup Script

```bash
#!/bin/bash

BACKUP_DIR="/backups/videohub"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump videohub_db > $BACKUP_DIR/db-$(date +%Y%m%d).sql

# Backup application
tar -czf $BACKUP_DIR/app-$(date +%Y%m%d).tar.gz /var/www/videohub

# Keep last 30 days only
find $BACKUP_DIR -type f -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/ s3://videohub-backups/ --recursive
```

Schedule daily:

```bash
0 2 * * * /var/www/videohub/backup.sh
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs videohub-api
pm2 logs videohub-web

# Check system resources
free -h
df -h

# Restart services
pm2 restart all
```

### High Memory Usage

```bash
# Check processes
ps aux | grep node

# Increase Node.js memory
pm2 start npm --name "videohub-api" --node-args="--max-old-space-size=2048" -- start
```

### Database Connection Issues

```bash
# Test connection
psql -U videohub -h localhost -d videohub_db

# Check Redis
redis-cli ping

# Restart services
systemctl restart redis-server
```

---

For more information, see [README.md](./README.md)
