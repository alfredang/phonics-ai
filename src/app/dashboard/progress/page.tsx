'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Star,
  Trophy,
  Target,
  TrendingUp,
  CheckCircle,
  Volume2,
  MapPin,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { WORLDS } from '@/constants/worlds';
import { ALL_PHONEMES, PHONEMES_BY_CATEGORY } from '@/constants/phonemes';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export default function ProgressPage() {
  const {
    level,
    xp,
    completedLessons,
    phonemeProgress,
    unlockedWorlds,
    currentStreak,
  } = useGameStore();

  // Calculate total lessons
  const totalLessons = WORLDS.reduce((sum, w) => sum + w.lessonCount, 0);
  const completedCount = completedLessons.length;
  const overallProgress = Math.round((completedCount / totalLessons) * 100);

  // Calculate phoneme mastery
  const masteredPhonemes = Object.entries(phonemeProgress).filter(
    ([_, progress]) => progress.averageScore >= 80 && progress.attempts >= 3
  ).length;
  const phonemeMasteryPercent = Math.round((masteredPhonemes / ALL_PHONEMES.length) * 100);

  // Get world progress
  const worldProgress = WORLDS.map((world) => {
    const worldLessons = completedLessons.filter((l) =>
      l.startsWith(`${world.id}-lesson-`)
    ).length;
    return {
      ...world,
      completed: worldLessons,
      progress: Math.round((worldLessons / world.lessonCount) * 100),
      isUnlocked: unlockedWorlds.includes(world.id),
    };
  });

  // Group phonemes by category for display
  const phonemeCategories = [
    { id: 'short_vowel', name: 'Short Vowels', color: '#FF6B6B' },
    { id: 'long_vowel', name: 'Long Vowels', color: '#4ECDC4' },
    { id: 'consonant', name: 'Consonants', color: '#45B7D1' },
    { id: 'digraph', name: 'Digraphs', color: '#96CEB4' },
    { id: 'blend', name: 'Blends', color: '#FFEAA7' },
    { id: 'diphthong', name: 'Diphthongs', color: '#DDA0DD' },
    { id: 'r_controlled', name: 'R-Controlled', color: '#98D8C8' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Progress</h1>
            <p className="text-gray-500">Track your phonics learning journey</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">Level {level}</div>
            <div className="text-xs text-gray-500">{xp.toLocaleString()} XP</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
            <div className="text-xs text-gray-500">Lessons Done</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{masteredPhonemes}</div>
            <div className="text-xs text-gray-500">Sounds Mastered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentStreak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Overall Progress
            </h2>
            <span className="text-2xl font-bold text-purple-600">{overallProgress}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completedCount} of {totalLessons} lessons completed
          </p>
        </CardContent>
      </Card>

      {/* World Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            World Progress
          </h2>
          <div className="space-y-4">
            {worldProgress.map((world, index) => (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                      world.isUnlocked ? 'bg-gray-100' : 'bg-gray-50 opacity-50'
                    )}
                  >
                    {world.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'font-medium',
                          world.isUnlocked ? 'text-gray-800' : 'text-gray-400'
                        )}
                      >
                        {world.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {world.completed}/{world.lessonCount}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${world.progress}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          background: world.isUnlocked
                            ? `linear-gradient(to right, ${world.theme.primaryColor}, ${world.theme.primaryColor}dd)`
                            : '#d1d5db',
                        }}
                      />
                    </div>
                  </div>
                  {world.progress === 100 && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phoneme Mastery */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-green-500" />
              Phoneme Mastery
            </h2>
            <span className="text-sm text-gray-500">
              {masteredPhonemes}/{ALL_PHONEMES.length} sounds mastered
            </span>
          </div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${phonemeMasteryPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          </div>

          {/* Phoneme categories */}
          <div className="space-y-4">
            {phonemeCategories.map((category) => {
              const categoryPhonemes = PHONEMES_BY_CATEGORY[category.id as keyof typeof PHONEMES_BY_CATEGORY] || [];
              const masteredInCategory = categoryPhonemes.filter((p) => {
                const progress = phonemeProgress[p.id];
                return progress && progress.averageScore >= 80 && progress.attempts >= 3;
              }).length;
              const categoryProgress = categoryPhonemes.length > 0
                ? Math.round((masteredInCategory / categoryPhonemes.length) * 100)
                : 0;

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-xs text-gray-500">
                      {masteredInCategory}/{categoryPhonemes.length}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {categoryPhonemes.map((phoneme) => {
                      const progress = phonemeProgress[phoneme.id];
                      const isMastered = progress && progress.averageScore >= 80 && progress.attempts >= 3;
                      const isPracticed = progress && progress.attempts > 0;

                      return (
                        <div
                          key={phoneme.id}
                          className={cn(
                            'w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all',
                            isMastered
                              ? 'text-white'
                              : isPracticed
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-gray-100 text-gray-400'
                          )}
                          style={{
                            backgroundColor: isMastered ? category.color : undefined,
                          }}
                          title={`${phoneme.symbol} - ${isMastered ? 'Mastered' : isPracticed ? 'In Progress' : 'Not Started'}`}
                        >
                          {phoneme.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Tips to Improve
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-1">Complete Daily Lessons</h4>
              <p className="text-blue-600">
                Aim to complete at least 2 lessons per day to maintain steady progress.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-medium text-green-800 mb-1">Practice Weak Sounds</h4>
              <p className="text-green-600">
                Focus on phonemes with lower scores to improve your overall mastery.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-medium text-purple-800 mb-1">Keep Your Streak</h4>
              <p className="text-purple-600">
                Daily practice builds muscle memory for pronunciation.
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <h4 className="font-medium text-orange-800 mb-1">Play Games</h4>
              <p className="text-orange-600">
                Games reinforce learning in a fun way while earning bonus XP.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
