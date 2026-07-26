import { Router } from 'express';
import { downloadVideo, getStats, healthCheck } from '@/controllers/downloadController';
import { validateDownloadRequest } from '@/middleware/validation';
import { downloadLimiter } from '@/middleware/rateLimiter';

const router = Router();

// Health check
router.get('/health', healthCheck);

// Download video
router.post('/download', downloadLimiter, validateDownloadRequest, downloadVideo);

// Get statistics
router.get('/stats', getStats);

export default router;
