import rateLimit from 'express-rate-limit';
import { config } from '@/config/env';

// Rate limiter middleware
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Rate limit exceeded. Please try again later.',
    });
  },
});

// Stricter limiter for download endpoint
export const downloadLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  skipSuccessfulRequests: false,
  message: 'Too many download requests, please try again later.',
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Rate limit exceeded. Please try again later.',
    });
  },
});
