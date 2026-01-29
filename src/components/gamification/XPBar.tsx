'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { getXPForLevel } from '@/types/game';
import { cn } from '@/lib/utils/cn';

interface XPBarProps {
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
  showXPText?: boolean;
  animated?: boolean;
  className?: string;
}

export function XPBar({
  size = 'md',
  showLevel = true,
  showXPText = true,
  animated = true,
  className,
}: XPBarProps) {
  const { xp, level, levelProgress, levelTitle } = useGameStore();

  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const xpInLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  const sizeStyles = {
    sm: {
      bar: 'h-2',
      level: 'w-8 h-8 text-sm',
      text: 'text-xs',
    },
    md: {
      bar: 'h-3',
      level: 'w-10 h-10 text-base',
      text: 'text-sm',
    },
    lg: {
      bar: 'h-4',
      level: 'w-12 h-12 text-lg',
      text: 'text-base',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Level badge */}
      {showLevel && (
        <motion.div
          initial={animated ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          className={cn(
            'flex-shrink-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500',
            'flex items-center justify-center font-bold text-white shadow-lg',
            styles.level
          )}
        >
          {level}
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="flex-1">
        {/* XP text */}
        {showXPText && (
          <div className={cn('flex justify-between mb-1', styles.text)}>
            <span className="text-gray-600 font-medium">{levelTitle}</span>
            <span className="text-gray-500">
              {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
            </span>
          </div>
        )}

        {/* Bar */}
        <div
          className={cn(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            styles.bar
          )}
        >
          <motion.div
            initial={animated ? { width: 0 } : false}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full relative"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30" />

            {/* Sparkle animation */}
            {animated && levelProgress > 0 && (
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-yellow-200" />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// XP gain animation component
export function XPGainAnimation({
  amount,
  onComplete,
}: {
  amount: number;
  onComplete?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={onComplete}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.5, repeat: 2 }}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
      >
        <Zap className="w-6 h-6 text-white" />
        <span className="text-xl font-bold text-white">+{amount} XP</span>
      </motion.div>
    </motion.div>
  );
}

// Mini XP indicator for compact spaces
export function XPIndicator({ className }: { className?: string }) {
  const { xp, level } = useGameStore();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
        {level}
      </div>
      <span className="text-sm font-medium text-gray-600">
        {xp.toLocaleString()} XP
      </span>
    </div>
  );
}
