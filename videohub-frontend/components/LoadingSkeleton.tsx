'use client';

import { motion } from 'framer-motion';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-12 bg-card rounded-lg"
        />
      ))}
    </div>
  );
};
