'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, BookOpen, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo/Title */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-4">
              Phonics AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Master Reading Through Adventure
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { icon: BookOpen, text: 'Learn Phonics' },
              { icon: Play, text: 'Play Games' },
              { icon: Trophy, text: 'Earn Rewards' },
              { icon: Sparkles, text: 'Level Up' },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
              >
                <feature.icon className="w-5 h-5 text-game-primary" />
                <span className="text-gray-700 font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <Button variant="primary" size="lg">
                Start Learning Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                I Have an Account
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Characters/Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 grid grid-cols-5 gap-4"
        >
          {['A', 'E', 'I', 'O', 'U'].map((letter, index) => (
            <motion.div
              key={letter}
              initial={{ y: 20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                delay: 1.2 + index * 0.1,
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-phoneme-short-vowel to-phoneme-long-vowel flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg"
            >
              {letter}
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>Learn phonics the fun way - for ages 9-15</p>
      </footer>
    </div>
  );
}
