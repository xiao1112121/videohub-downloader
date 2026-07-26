import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { DownloadResponse } from '@/types';
import { getPlatformFromUrl } from '@/utils/helpers';
import { tiktokService, facebookService, youtubeService } from '@/services/downloader';
import { cacheService } from '@/services/cache';
import { db } from '@/database/db';
import logger from '@/utils/logger';

// Download video controller
export const downloadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: 'error', errors: errors.array() });
      return;
    }

    const { url } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

    logger.info(`Download request from ${ipAddress}:`, url);

    // Check cache first
    const cached = cacheService.get(url);
    if (cached) {
      logger.info('Returning cached result');
      res.json({
        status: 'success',
        data: cached,
        cached: true,
      });
      return;
    }

    // Detect platform
    const platform = getPlatformFromUrl(url);
    if (!platform) {
      res.status(400).json({
        status: 'error',
        message: 'Unsupported platform. Please use TikTok, Facebook, or YouTube URLs',
      });
      return;
    }

    // Download video
    let videoData: DownloadResponse;

    switch (platform) {
      case 'tiktok':
        videoData = await tiktokService.download(url);
        break;
      case 'facebook':
        videoData = await facebookService.download(url);
        break;
      case 'youtube':
        videoData = await youtubeService.download(url);
        break;
      default:
        res.status(400).json({
          status: 'error',
          message: 'Unsupported platform',
        });
        return;
    }

    // Cache result
    cacheService.set(url, videoData);

    // Log download
    db.logDownload(url, platform, ipAddress);

    res.json({
      status: 'success',
      data: videoData,
      cached: false,
    });
  } catch (error) {
    logger.error('Error in downloadVideo:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to download video',
    });
  }
};

// Get statistics
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = db.getStats();
    res.json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Error in getStats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get statistics',
    });
  }
};

// Health check
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
};
