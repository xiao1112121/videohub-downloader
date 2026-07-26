'use client';

import { motion } from 'framer-motion';
import { Download, Copy } from 'lucide-react';
import Image from 'next/image';
import { DownloadResponse } from '@/types';
import { downloadFile, copyToClipboard } from '@/utils/helpers';
import { useState } from 'react';

interface VideoResultProps {
  data: DownloadResponse;
}

export const VideoResult = ({ data }: VideoResultProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (url: string, quality: string) => {
    downloadFile(url, `video-${quality}-${Date.now()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Video Container */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Thumbnail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:col-span-1"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={data.thumbnail}
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          {/* Title */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h2 className="text-2xl font-bold text-white line-clamp-2">{data.title}</h2>
            <p className="text-sm text-white/60 mt-2">
              Platform:{' '}
              <span className="capitalize font-semibold text-primary">{data.platform}</span>
            </p>
          </motion.div>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 py-4 border-y border-card"
          >
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wide">Duration</p>
              <p className="text-lg font-semibold text-white">{data.duration}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wide">Quality</p>
              <p className="text-lg font-semibold text-primary">{data.quality.length} options</p>
            </div>
          </motion.div>

          {/* Copy URL Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCopy(data.quality[0]?.url || '')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-card/80 transition-colors text-white/80 hover:text-white"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy URL'}
          </motion.button>
        </div>
      </div>

      {/* Download Options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-white">Download Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.quality.map((quality, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload(quality.url, quality.name)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 transition-all text-white font-semibold group"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{quality.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
