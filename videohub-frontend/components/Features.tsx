'use client';

import { motion } from 'framer-motion';
import { Download, Zap, Shield, Smartphone } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Download,
      title: 'Fast Download',
      description: 'Download videos in seconds with our optimized servers',
    },
    {
      icon: Zap,
      title: 'Lightning Speed',
      description: 'Ultra-fast processing and instant results',
    },
    {
      icon: Shield,
      title: '100% Secure',
      description: 'No data collection, completely private and safe',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices and browsers',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
