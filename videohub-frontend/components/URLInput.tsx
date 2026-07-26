'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { isValidUrl, getPlatformFromUrl } from '@/utils/helpers';

interface URLInputProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const URLInput = ({ onSubmit, isLoading }: URLInputProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const platform = getPlatformFromUrl(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Invalid URL format');
      return;
    }

    if (!platform) {
      setError('Unsupported platform. Please use TikTok, Facebook, or YouTube URLs');
      return;
    }

    await onSubmit(url);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full space-y-4"
    >
      {/* Input Container */}
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          placeholder="Paste TikTok / Facebook / YouTube URL..."
          disabled={isLoading}
          className="w-full px-6 py-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
        />

        {/* Platform Badge */}
        {platform && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-primary/20 border border-primary/30"
          >
            <span className="text-xs font-semibold text-primary capitalize">{platform}</span>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-danger font-medium"
        >
          {error}
        </motion.p>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        disabled={isLoading}
        type="submit"
        className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/50 transition-all text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{isLoading ? 'Processing...' : 'Download'}</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      {/* Info Text */}
      <p className="text-xs text-white/50 text-center">
        🔒 100% safe and secure. No account required.
      </p>
    </motion.form>
  );
};
