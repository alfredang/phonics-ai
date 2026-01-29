'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Zap, Clock, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { useLessonStore } from '@/stores/lessonStore';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface LessonCompleteProps {
  lessonId: string;
  worldId: string;
  nextLessonId?: string;
}

export function LessonComplete({
  lessonId,
  worldId,
  nextLessonId,
}: LessonCompleteProps) {
  const router = useRouter();
  const { calculateResults, exitLesson, currentLesson } = useLessonStore();
  const { addXP, completeLesson } = useGameStore();

  const results = calculateResults();
  const { totalScore, stars, xpEarned, timeSpent } = results;

  // Award XP on mount
  useState(() => {
    addXP(xpEarned, 'lesson_complete');
    completeLesson(lessonId);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextLesson = () => {
    exitLesson();
    if (nextLessonId) {
      router.push(`/dashboard/worlds/${worldId}/lessons/${nextLessonId}`);
    } else {
      router.push(`/dashboard/worlds/${worldId}`);
    }
  };

  const handleRetry = () => {
    exitLesson();
    router.push(`/dashboard/worlds/${worldId}/lessons/${lessonId}`);
  };

  const handleBackToWorld = () => {
    exitLesson();
    router.push(`/dashboard/worlds/${worldId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      {/* Confetti effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars >= 2 &&
          Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB'][
                  i % 5
                ],
                left: `${Math.random() * 100}%`,
              }}
              initial={{ top: -20, rotate: 0 }}
              animate={{
                top: '110%',
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
      </div>

      {/* Content card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 p-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {stars === 3 ? '🏆' : stars === 2 ? '🎉' : stars === 1 ? '👍' : '💪'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            {stars === 3
              ? 'Perfect!'
              : stars === 2
              ? 'Great Job!'
              : stars === 1
              ? 'Good Try!'
              : 'Keep Practicing!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80"
          >
            {currentLesson?.title || 'Lesson Complete'}
          </motion.p>
        </div>

        {/* Stars */}
        <div className="flex justify-center -mt-6 relative z-10">
          <div className="flex gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
            {[1, 2, 3].map((starNum) => (
              <motion.div
                key={starNum}
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: 'spring',
                  delay: 0.5 + starNum * 0.1,
                }}
              >
                <Star
                  className={cn(
                    'w-10 h-10',
                    starNum <= stars
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          {/* Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between p-4 bg-purple-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-purple-500" />
              <span className="font-medium text-gray-700">Score</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">{totalScore}%</span>
          </motion.div>

          {/* XP Earned */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="font-medium text-gray-700">XP Earned</span>
            </div>
            <span className="text-2xl font-bold text-yellow-600">+{xpEarned}</span>
          </motion.div>

          {/* Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-500" />
              <span className="font-medium text-gray-700">Time</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {formatTime(timeSpent)}
            </span>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          {nextLessonId ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleNextLesson}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Next Lesson
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleBackToWorld}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Continue
            </Button>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRetry}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={handleBackToWorld}
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to World
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Missing import
import { useState } from 'react';
