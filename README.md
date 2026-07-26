# VideoHub Downloader 🎬

A modern, production-ready video downloader web application for downloading videos from TikTok, Facebook, and YouTube without watermarks in high quality.

## Features ✨

- ✅ **Multi-Platform Support**: TikTok, Facebook, YouTube
- ✅ **No Watermark**: Download videos without watermarks
- ✅ **High Quality**: Support for multiple quality options
- ✅ **Fast & Secure**: Instant processing with no data collection
- ✅ **Modern UI**: Glassmorphism design with dark mode
- ✅ **Responsive**: Works perfectly on desktop, tablet, and mobile
- ✅ **Production Ready**: Clean architecture, TypeScript, ESLint configured
- ✅ **Performance**: SSR, lazy loading, image optimization
- ✅ **Security**: Rate limiting, CORS, helmet, input validation

## Tech Stack 🛠️

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: In-memory (production: MongoDB/PostgreSQL)
- **Cache**: In-memory (production: Redis)
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Project Structure 📁

```
videohub-frontend/           # Next.js frontend application
├── app/                     # App router pages
├── components/              # React components
├── services/                # API services
├── hooks/                   # Custom hooks
├── utils/                   # Utility functions
├── lib/                     # Libraries (store, etc.)
├── styles/                  # Global styles
├── types/                   # TypeScript types
├── config/                  # Configuration files
└── public/                  # Static assets

videohub-backend/            # Express.js backend API
├── src/
│   ├── controllers/         # Route controllers
│   ├── services/            # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── database/            # Database layer
│   ├── config/              # Configuration
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── dist/                    # Compiled JavaScript
└── package.json
```

## Installation 🚀

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Frontend Setup

```bash
cd videohub-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your API URL
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd videohub-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# PORT=3001
# CORS_ORIGIN=http://localhost:3000
# NODE_ENV=development

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Backend API will be available at `http://localhost:3001/api`

## API Documentation 📚

### Download Video

**Endpoint**: `POST /api/download`

**Request Body**:
```json
{
  "url": "https://www.tiktok.com/video/123456789"
}
```

**Response**:
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
        "url": "https://example.com/video.mp4"
      },
      {
        "name": "Audio Only",
        "url": "https://example.com/audio.mp3"
      }
    ]
  },
  "cached": false
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Invalid URL format"
}
```

### Get Statistics

**Endpoint**: `GET /api/stats`

**Response**:
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

### Health Check

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Environment Variables 🔐

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GA_ID=             # Google Analytics ID (optional)
```

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Redis (optional, for production)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Rate Limiting
RATE_LIMIT_WINDOW=3600000      # 1 hour in milliseconds
RATE_LIMIT_MAX_REQUESTS=100    # requests per window

# External APIs
YOUTUBE_API_KEY=               # If using official YouTube API
FACEBOOK_API_KEY=              # If using Facebook Graph API
```

## Deployment 🚀

### Docker Deployment

#### Frontend (Dockerfile)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Backend (Dockerfile)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./videohub-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api
    depends_on:
      - backend

  backend:
    build: ./videohub-backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      CORS_ORIGIN: http://frontend:3000
      PORT: 3001
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
```

### VPS Deployment (Backend)

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Clone repository
git clone <your-repo-url>
cd videohub-backend

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Build
npm run build

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start dist/index.js --name videohub-api

# Save PM2 configuration
pm2 save

# Make PM2 run on startup
pm2 startup
```

## Development 💻

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking (TypeScript)
npm run type-check
```

### Running Tests

```bash
# Backend
cd videohub-backend
npm test

# Frontend
cd videohub-frontend
npm test
```

## Performance Optimization ⚡

- **Server-Side Rendering (SSR)**: Faster initial page load
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Automatic chunk splitting by Next.js
- **Compression**: Gzip compression enabled
- **Caching**: Redis caching (production)
- **Rate Limiting**: Prevent abuse and ensure stability

## Security Features 🔒

- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers configured
- **Rate Limiting**: 100 requests per hour per IP
- **Input Validation**: URL and parameter validation
- **XSS Protection**: Sanitized inputs and outputs
- **CSRF Protection**: Enabled by default
- **No Data Collection**: User data not stored or tracked

## Troubleshooting 🔧

### API Connection Issues

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check CORS configuration
# Ensure CORS_ORIGIN matches your frontend URL
```

### Rate Limit Exceeded

```
Error: Rate limit exceeded. Please try again later.
```

**Solution**: Wait for the rate limit window to reset or increase `RATE_LIMIT_MAX_REQUESTS` in `.env`

### Video Download Fails

1. Verify URL is correct and supported platform
2. Check API logs for detailed error message
3. Ensure internet connection is stable
4. Try with a different video

## Future Enhancements 🎯

- [ ] Add Instagram, Snapchat support
- [ ] Implement advanced analytics dashboard
- [ ] Add user authentication and saved downloads
- [ ] Mobile app (React Native)
- [ ] Batch download functionality
- [ ] Advanced video editing features
- [ ] Subtitle extraction
- [ ] Playlist support

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For support, email support@videohub.com or open an issue on GitHub.

---

**Made with ❤️ by the VideoHub Team**
