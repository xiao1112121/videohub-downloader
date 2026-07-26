'use client';

import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  message?: string;
}

export const LoadingAnimation = ({ message = 'Analyzing video...' }: LoadingAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-3 border-card border-t-primary rounded-full"
      />

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-white/80 font-medium"
      >
        {message}
      </motion.p>

      {/* Dots animation */}
      <div className="mt-2 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
};
