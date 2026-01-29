'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Star,
  Flame,
  BookOpen,
  Target,
  Zap,
  Crown,
  Medal,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

// Achievement definitions
const ALL_ACHIEVEMENTS = [
  // Progress achievements
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎓',
    category: 'progress',
    rarity: 'common',
    xpReward: 10,
  },
  {
    id: 'five-lessons',
    name: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '📚',
    category: 'progress',
    rarity: 'common',
    xpReward: 25,
  },
  {
    id: 'ten-lessons',
    name: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '🌟',
    category: 'progress',
    rarity: 'uncommon',
    xpReward: 50,
  },
  {
    id: 'twenty-five-lessons',
    name: 'Phonics Pro',
    description: 'Complete 25 lessons',
    icon: '🏆',
    category: 'progress',
    rarity: 'rare',
    xpReward: 100,
  },
  {
    id: 'fifty-lessons',
    name: 'Master Scholar',
    description: 'Complete 50 lessons',
    icon: '👑',
    category: 'progress',
    rarity: 'epic',
    xpReward: 200,
  },
  // Streak achievements
  {
    id: 'streak-3',
    name: 'On Fire',
    description: 'Reach a 3-day streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpReward: 15,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Reach a 7-day streak',
    icon: '⚡',
    category: 'streak',
    rarity: 'uncommon',
    xpReward: 50,
  },
  {
    id: 'streak-14',
    name: 'Fortnight Fighter',
    description: 'Reach a 14-day streak',
    icon: '💪',
    category: 'streak',
    rarity: 'rare',
    xpReward: 100,
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Reach a 30-day streak',
    icon: '🌙',
    category: 'streak',
    rarity: 'epic',
    xpReward: 250,
  },
  // Performance achievements
  {
    id: 'perfect-score',
    name: 'Perfect!',
    description: 'Get 100% on any lesson',
    icon: '💯',
    category: 'performance',
    rarity: 'uncommon',
    xpReward: 30,
  },
  {
    id: 'five-perfect',
    name: 'Perfectionist',
    description: 'Get 100% on 5 lessons',
    icon: '✨',
    category: 'performance',
    rarity: 'rare',
    xpReward: 75,
  },
  {
    id: 'ten-perfect',
    name: 'Flawless',
    description: 'Get 100% on 10 lessons',
    icon: '💎',
    category: 'performance',
    rarity: 'epic',
    xpReward: 150,
  },
  // Collection achievements
  {
    id: 'vowel-master',
    name: 'Vowel Master',
    description: 'Master all vowel sounds',
    icon: '🅰️',
    category: 'collection',
    rarity: 'rare',
    xpReward: 100,
  },
  {
    id: 'consonant-king',
    name: 'Consonant King',
    description: 'Master all consonant sounds',
    icon: '🔤',
    category: 'collection',
    rarity: 'epic',
    xpReward: 150,
  },
  {
    id: 'sound-master',
    name: 'Sound Master',
    description: 'Master all 44 phonemes',
    icon: '🎯',
    category: 'collection',
    rarity: 'legendary',
    xpReward: 500,
  },
  // World achievements
  {
    id: 'letters-land-complete',
    name: 'Letters Land Champion',
    description: 'Complete all lessons in Letters Land',
    icon: '🔤',
    category: 'progress',
    rarity: 'rare',
    xpReward: 100,
  },
  {
    id: 'word-city-complete',
    name: 'Word City Hero',
    description: 'Complete all lessons in Word City',
    icon: '🏙️',
    category: 'progress',
    rarity: 'rare',
    xpReward: 125,
  },
  {
    id: 'all-worlds-complete',
    name: 'Ultimate Champion',
    description: 'Complete all 5 worlds',
    icon: '🌍',
    category: 'progress',
    rarity: 'legendary',
    xpReward: 1000,
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  progress: <BookOpen className="w-5 h-5" />,
  streak: <Flame className="w-5 h-5" />,
  performance: <Target className="w-5 h-5" />,
  collection: <Star className="w-5 h-5" />,
  special: <Crown className="w-5 h-5" />,
};

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-600' },
  uncommon: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700' },
  rare: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700' },
  epic: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700' },
  legendary: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700' },
};

export default function AchievementsPage() {
  const { achievements } = useGameStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Get unlocked achievement IDs
  const unlockedIds = new Set(achievements.map((a) => a.id));

  // Filter achievements by category
  const filteredAchievements = selectedCategory
    ? ALL_ACHIEVEMENTS.filter((a) => a.category === selectedCategory)
    : ALL_ACHIEVEMENTS;

  // Count stats
  const unlockedCount = achievements.length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const totalXPEarned = achievements.reduce((sum, a) => {
    const def = ALL_ACHIEVEMENTS.find((d) => d.id === a.id);
    return sum + (def?.xpReward || 0);
  }, 0);

  const categories = ['progress', 'streak', 'performance', 'collection'];

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
            <h1 className="text-3xl font-bold text-gray-800">Achievements</h1>
            <p className="text-gray-500">Unlock badges by completing challenges!</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-gray-800">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-xs text-gray-500">Unlocked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Medal className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-gray-800">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Complete</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-gray-800">{totalXPEarned}</div>
            <div className="text-xs text-gray-500">XP Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedCategory === null ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            leftIcon={categoryIcons[cat]}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement, index) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const colors = rarityColors[achievement.rarity];

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  'overflow-hidden transition-all border-2',
                  isUnlocked ? colors.border : 'border-gray-200 opacity-60'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                        isUnlocked ? colors.bg : 'bg-gray-100'
                      )}
                    >
                      {isUnlocked ? (
                        achievement.icon
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={cn(
                            'font-bold',
                            isUnlocked ? 'text-gray-800' : 'text-gray-500'
                          )}
                        >
                          {achievement.name}
                        </h3>
                        {isUnlocked && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full capitalize',
                            colors.bg,
                            colors.text
                          )}
                        >
                          {achievement.rarity}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          +{achievement.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No achievements in this category
            </h3>
            <p className="text-gray-500">
              Try selecting a different category to see more achievements.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            How to Unlock Achievements
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <strong className="text-gray-800">Progress</strong>
                <p className="text-gray-500">Complete lessons and worlds to earn badges</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Flame className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <strong className="text-gray-800">Streaks</strong>
                <p className="text-gray-500">Practice every day to build your streak</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <strong className="text-gray-800">Performance</strong>
                <p className="text-gray-500">Aim for perfect scores on lessons</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <strong className="text-gray-800">Collection</strong>
                <p className="text-gray-500">Master all the phoneme sounds</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
