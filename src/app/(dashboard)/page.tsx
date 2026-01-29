'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Play,
  Target,
  Trophy,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Flame,
  Star,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    xp,
    level,
    levelTitle,
    levelProgress,
    currentStreak,
    longestStreak,
    dailyQuests,
    completedLessons,
    achievements,
  } = useGameStore();

  const greeting = getGreeting();
  const incompleteQuests = dailyQuests.filter((q) => !q.completed);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-sm font-medium"
            >
              {greeting}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold mt-1"
            >
              {user?.displayName || 'Learner'}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 mt-2 max-w-md"
            >
              Ready to continue your phonics adventure? You&apos;ve completed{' '}
              <span className="font-bold text-white">{completedLessons.length}</span>{' '}
              lessons so far. Keep it up!
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/dashboard/worlds">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<Play className="w-5 h-5" />}
                className="shadow-xl"
              >
                Continue Learning
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CircularProgress
                  value={levelProgress}
                  size={48}
                  strokeWidth={4}
                  className="text-purple-500"
                >
                  <span className="text-sm font-bold text-purple-600">{level}</span>
                </CircularProgress>
                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="font-bold text-gray-800">{levelTitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total XP</p>
                  <p className="font-bold text-gray-800">{xp.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Day Streak</p>
                  <p className="font-bold text-gray-800">
                    {currentStreak} <span className="text-gray-400 font-normal text-xs">/ {longestStreak} best</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Achievements</p>
                  <p className="font-bold text-gray-800">{achievements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Daily Quests
              </CardTitle>
              <Link
                href="/dashboard/quests"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {incompleteQuests.length > 0 ? (
                incompleteQuests.slice(0, 3).map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                      {quest.type === 'complete_lessons' && '📚'}
                      {quest.type === 'earn_xp' && '✨'}
                      {quest.type === 'practice_phonemes' && '🔤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{quest.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <ProgressBar
                          value={(quest.currentValue / quest.targetValue) * 100}
                          className="flex-1"
                          variant="default"
                        />
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {quest.currentValue}/{quest.targetValue}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-yellow-600">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Star className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="font-medium text-gray-800">All quests completed!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Come back tomorrow for new quests
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/worlds">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Continue Lesson</p>
                    <p className="text-xs text-gray-500">Pick up where you left off</p>
                  </div>
                </motion.div>
              </Link>

              <Link href="/dashboard/games">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <span className="text-xl">🎮</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Play Games</p>
                    <p className="text-xs text-gray-500">Practice with fun games</p>
                  </div>
                </motion.div>
              </Link>

              <Link href="/dashboard/achievements">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">View Achievements</p>
                    <p className="text-xs text-gray-500">See your badges</p>
                  </div>
                </motion.div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
