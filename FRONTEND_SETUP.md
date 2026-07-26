# Frontend Setup Guide 🎨

This guide will help you set up and run the VideoHub Frontend application.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

## Installation Steps

### 1. Navigate to Frontend Directory

```bash
cd videohub-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

### 4. Configure Environment Variables

Edit `.env.local` and update the values:

```env
# API endpoint for backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Type check with TypeScript
npm run type-check
```

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
└── globals.css         # Global styles

components/
├── Header.tsx          # Navigation header
├── Footer.tsx          # Footer section
├── URLInput.tsx        # Video URL input form
├── VideoResult.tsx     # Video result display
├── LoadingAnimation.tsx# Loading indicator
├── LoadingSkeleton.tsx # Skeleton loader
├── Alert.tsx           # Alert component
├── Features.tsx        # Features section
└── Statistics.tsx      # Stats section

hooks/
├── useTheme.ts        # Theme toggle hook
└── useDownload.ts     # Download logic hook

services/
└── api.ts             # API communication

lib/
└── store.ts           # Zustand store

types/
└── index.ts           # TypeScript type definitions

utils/
└── helpers.ts         # Utility functions

config/
└── index.ts           # Configuration constants
```

## Component Breakdown

### Header
- Logo and branding
- Navigation menu
- Dark/Light theme toggle

### URLInput
- Video URL input field
- Platform detection
- Form validation
- Submit button

### VideoResult
- Video thumbnail
- Metadata display (title, duration, platform)
- Download quality options
- Copy URL functionality

### Statistics
- Download statistics by platform
- Real-time metrics
- Visual charts (TikTok, Facebook, YouTube)

### Features
- Fast download capability
- Security assurance
- Mobile responsiveness
- Easy-to-use interface

## Styling

The project uses:

- **TailwindCSS**: Utility-first CSS framework
- **Dark Mode**: Pre-configured dark theme
- **Custom Colors**:
  - Primary: #3B82F6 (Blue)
  - Secondary: #6366F1 (Indigo)
  - Background: #0F172A (Dark Blue)
  - Card: #1E293B (Slate)
  - Success: #22C55E (Green)
  - Danger: #EF4444 (Red)

- **Font**: Poppins (imported from Google Fonts)

## Animations

Using Framer Motion for smooth animations:

- Fade-in animations on component mount
- Hover effects on interactive elements
- Loading spinner animation
- Slide-up transitions
- Scale transformations

## Performance Optimization

1. **Image Optimization**: Automatic WebP conversion
2. **Code Splitting**: Automatic by Next.js
3. **Lazy Loading**: Components load on demand
4. **SSR**: Server-side rendering for fast initial load
5. **Compression**: Gzip enabled by default

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

The build output will be in the `.next` directory.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

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

### Manual VPS Deployment

```bash
# SSH to your server
ssh user@your-server.com

# Clone repository
git clone <your-repo-url>
cd videohub-frontend

# Install dependencies
npm install

# Build
npm run build

# Use PM2 or systemd to run the app
npm install -g pm2
pm2 start npm --name "videohub-frontend" -- start
```

## Troubleshooting

### Port Already in Use

```bash
# On Linux/Mac
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API Connection Errors

1. Ensure backend is running on `http://localhost:3001`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify CORS is configured on backend

### Build Errors

```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:3001/api` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | `UA-XXXXXXXXX-X` |

## Debugging

### Enable Debug Mode

```javascript
// In components/services/api.ts
const api = axios.create({
  // ... config
});

// Add request interceptor
api.interceptors.request.use(config => {
  console.log('API Request:', config);
  return config;
});

// Add response interceptor
api.interceptors.response.use(response => {
  console.log('API Response:', response);
  return response;
});
```

## Performance Tips

1. **Reduce Bundle Size**
   - Use dynamic imports for heavy components
   - Remove unused dependencies

2. **Optimize Images**
   - Use Next.js Image component
   - Convert to WebP format

3. **Cache Strategy**
   - Implement service workers
   - Cache API responses

4. **Monitor Performance**
   - Use Lighthouse
   - Use Web Vitals

## Next Steps

1. Customize branding and colors
2. Add additional pages (About, Contact, Terms)
3. Implement analytics
4. Set up CI/CD pipeline
5. Configure custom domain

---

For more information, see the main [README.md](../README.md)
