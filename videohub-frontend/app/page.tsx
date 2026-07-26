'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { URLInput } from '@/components/URLInput';
import { VideoResult } from '@/components/VideoResult';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { Alert } from '@/components/Alert';
import { Features } from '@/components/Features';
import { Statistics } from '@/components/Statistics';
import { useDownload } from '@/hooks/useDownload';

export default function HomePage() {
  const { isLoading, error, data, download, reset } = useDownload();
  const [alertMessage, setAlertMessage] = useState('');

  const handleDownload = async (url: string) => {
    const success = await download(url);
    if (success) {
      setAlertMessage('Video analyzed successfully!');
    }
  };

  const handleReset = () => {
    reset();
    setAlertMessage('');
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Download Videos
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Without Watermark
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white/60 max-w-2xl mx-auto"
              >
                Paste your video URL below and download videos in the best available quality from TikTok,
                Facebook, and YouTube.
              </motion.p>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* Alerts */}
              {error && (
                <Alert
                  type="error"
                  message={error}
                  onClose={() => handleReset()}
                />
              )}

              {alertMessage && (
                <Alert
                  type="success"
                  message={alertMessage}
                  onClose={() => setAlertMessage('')}
                />
              )}

              {/* Loading or Result or Input */}
              {isLoading ? (
                <LoadingAnimation message="Analyzing video..." />
              ) : data ? (
                <div className="space-y-4">
                  <VideoResult data={data} />
                  <button
                    onClick={handleReset}
                    className="w-full px-6 py-3 rounded-xl bg-card hover:bg-card/80 transition-colors text-white font-semibold"
                  >
                    Download Another Video
                  </button>
                </div>
              ) : (
                <URLInput onSubmit={handleDownload} isLoading={isLoading} />
              )}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Statistics Section */}
        <Statistics />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Ready to Download Videos?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 mb-8"
            >
              Start downloading your favorite videos in high quality right now. No sign-up required.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/50 transition-all text-white font-bold"
            >
              Start Now
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}
