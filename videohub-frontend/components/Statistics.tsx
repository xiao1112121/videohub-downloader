'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Play, MessageCircle, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import { downloadVideoService } from '@/services/api';
import { Stats } from '@/types';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export const Statistics = () => {
  const [stats, setStats] = useState<Stats>({
    todayDownloads: 0,
    totalDownloads: 0,
    tiktokDownloads: 0,
    facebookDownloads: 0,
    youtubeDownloads: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await downloadVideoService.getStats();
        setStats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load statistics';
        setError(message);
        // Use mock data as fallback
        setStats({
          todayDownloads: 1234,
          totalDownloads: 156890,
          tiktokDownloads: 98765,
          facebookDownloads: 32145,
          youtubeDownloads: 25980,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      label: 'Today Downloads',
      value: stats.todayDownloads.toLocaleString(),
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Downloads',
      value: stats.totalDownloads.toLocaleString(),
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'TikTok Videos',
      value: stats.tiktokDownloads.toLocaleString(),
      icon: Music,
      color: 'from-pink-500 to-pink-600',
    },
    {
      label: 'Facebook Videos',
      value: stats.facebookDownloads.toLocaleString(),
      icon: MessageCircle,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'YouTube Videos',
      value: stats.youtubeDownloads.toLocaleString(),
      icon: Play,
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Platform Statistics</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Real-time statistics of video downloads across all supported platforms
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-yellow-400 mb-4"
          >
            {error} (showing sample data)
          </motion.p>
        )}

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-white/10">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} bg-opacity-10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                    <p className="text-sm text-white/60">{card.label}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};
