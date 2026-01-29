'use client';

import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils/cn';

interface StreakCounterProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function StreakCounter({
  size = 'md',
  showLabel = true,
  variant = 'default',
  className,
}: StreakCounterProps) {
  const { currentStreak, longestStreak } = useGameStore();

  const sizeStyles = {
    sm: {
      icon: 'w-5 h-5',
      text: 'text-lg',
      label: 'text-xs',
    },
    md: {
      icon: 'w-6 h-6',
      text: 'text-2xl',
      label: 'text-sm',
    },
    lg: {
      icon: 'w-8 h-8',
      text: 'text-3xl',
      label: 'text-base',
    },
  };

  const styles = sizeStyles[size];

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <motion.div
          animate={currentStreak > 0 ? { scale: [1, 1.1, 1] } : undefined}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Flame
            className={cn(
              styles.icon,
              currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'
            )}
          />
        </motion.div>
        <span className={cn('font-bold', styles.text, currentStreak > 0 ? 'text-orange-600' : 'text-gray-400')}>
          {currentStreak}
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100', className)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700">Daily Streak</h3>
          <motion.div
            animate={currentStreak > 0 ? { rotate: [0, -10, 10, 0] } : undefined}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Flame
              className={cn(
                'w-6 h-6',
                currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'
              )}
            />
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* Current streak */}
          <div className="text-center">
            <motion.span
              key={currentStreak}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={cn('block font-bold text-orange-600', styles.text)}
            >
              {currentStreak}
            </motion.span>
            <span className={cn('text-gray-500', styles.label)}>Current</span>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-orange-200" />

          {/* Longest streak */}
          <div className="text-center">
            <span className={cn('block font-bold text-gray-600', styles.text)}>
              {longestStreak}
            </span>
            <span className={cn('text-gray-500', styles.label)}>Best</span>
          </div>
        </div>

        {/* Streak visualization */}
        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const isActive = i < Math.min(currentStreak, 7);
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium',
                  isActive
                    ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white'
                    : 'bg-orange-100 text-orange-300'
                )}
              >
                {i + 1}
              </motion.div>
            );
          })}
        </div>

        {currentStreak >= 7 && (
          <p className="text-center text-sm text-orange-600 mt-2 font-medium">
            🔥 {currentStreak} day streak! Keep it up!
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        currentStreak > 0
          ? 'bg-gradient-to-r from-orange-100 to-red-100'
          : 'bg-gray-100',
        className
      )}
    >
      <motion.div
        animate={currentStreak > 0 ? { scale: [1, 1.2, 1] } : undefined}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Flame
          className={cn(
            styles.icon,
            currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'
          )}
        />
      </motion.div>

      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'font-bold',
            styles.text,
            currentStreak > 0 ? 'text-orange-600' : 'text-gray-400'
          )}
        >
          {currentStreak}
        </span>
        {showLabel && (
          <span
            className={cn(
              styles.label,
              currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'
            )}
          >
            day{currentStreak !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
