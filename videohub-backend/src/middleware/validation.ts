import { body, validationResult } from 'express-validator';

// Validate download request
export const validateDownloadRequest = [
  body('url')
    .isURL({ require_protocol: true })
    .trim()
    .withMessage('Invalid URL format'),
];
