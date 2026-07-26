# Backend Setup Guide 🔧

This guide will help you set up and run the VideoHub Backend API.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git
- Redis (optional, for production caching)

## Installation Steps

### 1. Navigate to Backend Directory

```bash
cd videohub-backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Environment File

```bash
cp .env.example .env
```

### 4. Configure Environment Variables

Edit `.env` and update the values:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting (1 hour window, 100 requests per IP)
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX_REQUESTS=100

# Redis (Optional, for production)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Logging
LOG_LEVEL=info

# External APIs (Optional)
YOUTUBE_API_KEY=
FACEBOOK_API_KEY=
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The API will be available at `http://localhost:3001/api`

## Available Scripts

```bash
# Start development server with hot reload (ts-node)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server (run after build)
npm start

# Run ESLint for code quality
npm run lint

# Format code with Prettier
npm run format
```

## Project Structure

```
src/
├── controllers/
│   └── downloadController.ts    # Request handlers
├── services/
│   ├── downloader.ts            # Platform-specific logic
│   └── cache.ts                 # Caching service
├── routes/
│   └── api.ts                   # API route definitions
├── middleware/
│   ├── errorHandler.ts          # Error handling
│   ├── rateLimiter.ts           # Rate limiting
│   └── validation.ts            # Input validation
├── database/
│   └── db.ts                    # In-memory database
├── config/
│   ├── env.ts                   # Environment config
│   └── constants.ts             # App constants
├── types/
│   └── index.ts                 # TypeScript types
├── utils/
│   ├── helpers.ts               # Utility functions
│   └── logger.ts                # Logging utility
└── index.ts                     # Application entry point
```

## API Endpoints

### 1. Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Download Video

```
POST /api/download
Content-Type: application/json

{
  "url": "https://www.tiktok.com/video/123456789"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "title": "Video Title",
    "thumbnail": "https://example.com/thumb.jpg",
    "duration": "0:30",
    "platform": "tiktok",
    "quality": [
      {
        "name": "High (No Watermark)",
        "url": "https://cdn.example.com/video.mp4"
      },
      {
        "name": "Audio Only",
        "url": "https://cdn.example.com/audio.mp3"
      }
    ]
  },
  "cached": false
}
```

**Error Response (400/500):**
```json
{
  "status": "error",
  "message": "Invalid URL format"
}
```

### 3. Get Statistics

```
GET /api/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "todayDownloads": 1234,
    "totalDownloads": 156890,
    "tiktokDownloads": 98765,
    "facebookDownloads": 32145,
    "youtubeDownloads": 25980
  }
}
```

## Supported Platforms

### TikTok
- URLs: `tiktok.com/video/`, `vm.tiktok.com`, `vt.tiktok.com`
- Download Options:
  - High quality without watermark
  - Medium quality with watermark
  - Audio only

### Facebook
- URLs: `facebook.com/watch`, `fb.watch`
- Download Options:
  - HD video
  - SD video
  - Audio only

### YouTube
- URLs: `youtube.com/watch`, `youtu.be`
- Download Options:
  - 1080p
  - 720p
  - 480p
  - Audio only

## Security Features

### Rate Limiting

- **Default**: 100 requests per hour per IP
- **Configurable**: Update `RATE_LIMIT_MAX_REQUESTS` in `.env`
- **Response**: 429 Too Many Requests

```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later."
}
```

### CORS Protection

- Only allows requests from configured origin
- Default: `http://localhost:3000`
- Update `CORS_ORIGIN` for different domains

### Input Validation

- URL format validation
- Platform verification
- Sanitized responses

### Helmet Security Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Content-Security-Policy

## Caching Strategy

### In-Memory Cache
- Stores downloaded video metadata
- Expiration: 1 hour
- Improves performance for repeated requests

### Production Cache (Redis)

```javascript
// Configure in services/cache.ts
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
```

## Database Schema

### Statistics (Collected)

```typescript
interface Stats {
  todayDownloads: number;           // Downloads today
  totalDownloads: number;           // Total all-time
  tiktokDownloads: number;          // TikTok total
  facebookDownloads: number;        // Facebook total
  youtubeDownloads: number;         // YouTube total
  lastReset: number;                // Timestamp of last daily reset
}
```

### Download Logs

```typescript
interface DownloadLog {
  id: string;                       // Unique ID
  url: string;                      // Original URL
  platform: string;                 // Platform name
  timestamp: number;                // Unix timestamp
  ipAddress: string;                // Client IP
}
```

## Error Handling

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Invalid URL format | Provide a valid URL |
| 400 | Unsupported platform | Use TikTok, Facebook, or YouTube |
| 429 | Rate limit exceeded | Wait before making new requests |
| 500 | Failed to download video | Check video URL and internet |

### Custom Error Responses

```javascript
// In controllers/downloadController.ts
res.status(statusCode).json({
  status: 'error',
  message: 'Descriptive error message',
  ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
});
```

## Logging

### Log Levels

- **INFO**: General information
- **WARN**: Warning messages
- **ERROR**: Error messages
- **DEBUG**: Debug information (dev only)

### Enable Debug Logging

```bash
# In .env
LOG_LEVEL=debug
NODE_ENV=development
```

### View Logs

```bash
# Console output
npm run dev

# Or with log file (requires additional setup)
npm run dev > logs/app.log 2>&1
```

## Building for Production

### 1. Build the Application

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 2. Test Production Build

```bash
NODE_ENV=production npm start
```

## Deployment Options

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY dist ./dist

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t videohub-backend .
docker run -p 3001:3001 --env-file .env videohub-backend
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      CORS_ORIGIN: http://localhost:3000
      REDIS_HOST: redis
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "videohub-api" -- start

# View logs
pm2 logs videohub-api

# Restart
pm2 restart videohub-api

# Stop
pm2 stop videohub-api

# Save configuration
pm2 save

# Run on system startup
pm2 startup
```

### Systemd Service

```ini
# /etc/systemd/system/videohub-api.service
[Unit]
Description=VideoHub API
After=network.target

[Service]
Type=simple
User=videohub
WorkingDirectory=/home/videohub/videohub-backend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable videohub-api
sudo systemctl start videohub-api
```

## Monitoring & Maintenance

### Health Check Endpoint

```bash
curl http://localhost:3001/api/health
```

### Monitor Statistics

```bash
curl http://localhost:3001/api/stats
```

### Clear Cache

```javascript
// In your monitoring dashboard
POST /api/admin/cache/clear
```

### View Logs

```bash
pm2 logs videohub-api
tail -f logs/app.log
```

## Performance Optimization

1. **Enable Compression**: Configure nginx/apache
2. **Use CDN**: For video serving
3. **Database Indexing**: For faster queries
4. **Connection Pooling**: Use for database
5. **Load Balancing**: Scale horizontally with PM2 Cluster

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### CORS Errors

```
Access to XMLHttpRequest at 'http://localhost:3001/api/download' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Update `CORS_ORIGIN` in `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

### Rate Limit Exceeded

Temporarily increase `RATE_LIMIT_MAX_REQUESTS`:
```env
RATE_LIMIT_MAX_REQUESTS=1000
```

### Redis Connection Errors

Make sure Redis is running:
```bash
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
```

## Testing

```bash
# Install dependencies
npm install --save-dev jest @types/jest ts-jest

# Create test file
echo 'export default {};' > jest.config.js

# Run tests
npm test
```

## Next Steps

1. Implement database persistence (MongoDB/PostgreSQL)
2. Add authentication and user accounts
3. Set up email notifications
4. Implement advanced analytics
5. Add webhook support
6. Create admin dashboard
7. Set up CI/CD pipeline

---

For more information, see the main [README.md](../README.md)
