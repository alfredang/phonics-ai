'use client';

import { motion } from 'framer-motion';
import { Lock, Star, ChevronRight, Check } from 'lucide-react';
import { WorldDefinition } from '@/constants/worlds';
import { cn } from '@/lib/utils/cn';

interface WorldCardProps {
  world: WorldDefinition;
  isUnlocked: boolean;
  isComplete?: boolean;
  progress?: number; // 0-100
  stars?: number; // 0-3
  onClick?: () => void;
}

export function WorldCard({
  world,
  isUnlocked,
  isComplete = false,
  progress = 0,
  stars = 0,
  onClick,
}: WorldCardProps) {
  return (
    <motion.button
      whileHover={isUnlocked ? { scale: 1.02, y: -4 } : undefined}
      whileTap={isUnlocked ? { scale: 0.98 } : undefined}
      onClick={isUnlocked ? onClick : undefined}
      className={cn(
        'relative w-full rounded-3xl overflow-hidden text-left transition-all',
        isUnlocked
          ? 'cursor-pointer shadow-lg hover:shadow-xl'
          : 'cursor-not-allowed opacity-60'
      )}
      style={{
        background: isUnlocked
          ? `linear-gradient(135deg, ${world.theme.gradientFrom}, ${world.theme.gradientTo})`
          : '#E5E7EB',
      }}
    >
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Emoji and name */}
          <div>
            <span className="text-5xl mb-2 block">{world.emoji}</span>
            <h3 className="text-2xl font-bold text-white">{world.name}</h3>
          </div>

          {/* Status icon */}
          {!isUnlocked ? (
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white/80" />
            </div>
          ) : isComplete ? (
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-white/80 mb-4 line-clamp-2">{world.description}</p>

        {/* Progress bar */}
        {isUnlocked && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>{Math.round(progress)}% Complete</span>
              <span>
                {Math.round((world.lessonCount * progress) / 100)}/{world.lessonCount} Lessons
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        )}

        {/* Stars */}
        {isUnlocked && stars > 0 && (
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((num) => (
              <Star
                key={num}
                className={cn(
                  'w-5 h-5',
                  num <= stars
                    ? 'text-yellow-300 fill-yellow-300'
                    : 'text-white/30'
                )}
              />
            ))}
          </div>
        )}

        {/* Lock overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/90 rounded-xl px-4 py-2 text-sm text-gray-600 font-medium">
              Complete previous world to unlock
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}

// Mini world card for quick navigation
export function WorldCardMini({
  world,
  isUnlocked,
  isCurrent,
  onClick,
}: {
  world: WorldDefinition;
  isUnlocked: boolean;
  isCurrent: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={isUnlocked ? { scale: 1.05 } : undefined}
      whileTap={isUnlocked ? { scale: 0.95 } : undefined}
      onClick={isUnlocked ? onClick : undefined}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all',
        isUnlocked
          ? isCurrent
            ? 'bg-purple-100 ring-2 ring-purple-500'
            : 'bg-gray-50 hover:bg-gray-100'
          : 'bg-gray-100 opacity-50 cursor-not-allowed'
      )}
    >
      <span className="text-2xl">{world.emoji}</span>
      <div className="text-left">
        <p className="font-semibold text-gray-800">{world.name}</p>
        <p className="text-xs text-gray-500">{world.lessonCount} lessons</p>
      </div>
      {!isUnlocked && <Lock className="w-4 h-4 text-gray-400 ml-auto" />}
    </motion.button>
  );
}
