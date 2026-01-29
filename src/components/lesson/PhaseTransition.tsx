'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LessonPhase } from '@/types/lesson';
import { cn } from '@/lib/utils/cn';

interface PhaseTransitionProps {
  phase: LessonPhase;
  isVisible: boolean;
}

const phaseConfig: Record<
  LessonPhase,
  {
    title: string;
    subtitle: string;
    emoji: string;
    bgGradient: string;
  }
> = {
  listen: {
    title: 'Listen',
    subtitle: 'Hear the sounds carefully',
    emoji: '👂',
    bgGradient: 'from-blue-500 via-cyan-500 to-teal-500',
  },
  practice: {
    title: 'Practice',
    subtitle: 'Try it yourself',
    emoji: '✏️',
    bgGradient: 'from-purple-500 via-pink-500 to-rose-500',
  },
  play: {
    title: 'Play',
    subtitle: 'Have fun with games',
    emoji: '🎮',
    bgGradient: 'from-green-500 via-emerald-500 to-teal-500',
  },
  assess: {
    title: 'Show What You Know',
    subtitle: 'Time to shine!',
    emoji: '⭐',
    bgGradient: 'from-yellow-500 via-orange-500 to-red-500',
  },
};

export function PhaseTransition({ phase, isVisible }: PhaseTransitionProps) {
  const config = phaseConfig[phase];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Background */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={cn(
              'absolute inset-0 bg-gradient-to-br',
              config.bgGradient
            )}
          />

          {/* Content */}
          <div className="relative z-10 text-center text-white px-8">
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                delay: 0.2,
                stiffness: 200,
              }}
              className="text-8xl mb-6"
            >
              {config.emoji}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold mb-3"
            >
              {config.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80"
            >
              {config.subtitle}
            </motion.p>

            {/* Pulse rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 m-auto w-64 h-64 rounded-full border-4 border-white/20"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: [0.5, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simple phase badge component
export function PhaseBadge({
  phase,
  isActive = false,
  isComplete = false,
  size = 'md',
}: {
  phase: LessonPhase;
  isActive?: boolean;
  isComplete?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const config = phaseConfig[phase];

  const sizeStyles = {
    sm: 'text-xl p-2',
    md: 'text-3xl p-3',
    lg: 'text-5xl p-4',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={cn(
        'rounded-2xl flex items-center justify-center',
        sizeStyles[size],
        isActive
          ? `bg-gradient-to-br ${config.bgGradient} shadow-lg`
          : isComplete
          ? 'bg-green-100'
          : 'bg-gray-100'
      )}
    >
      <span className={cn(!isActive && !isComplete && 'grayscale opacity-50')}>
        {isComplete ? '✓' : config.emoji}
      </span>
    </motion.div>
  );
}
