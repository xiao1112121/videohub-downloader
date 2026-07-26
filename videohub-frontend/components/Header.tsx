'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Header = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-card"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-bold text-white">VH</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VideoHub
            </span>
          </motion.div>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'TikTok', 'Facebook', 'YouTube', 'API', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                whileHover={{ y: -2 }}
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-card hover:bg-card/80 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-400" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
