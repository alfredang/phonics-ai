'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  Star,
  Zap,
  CheckCircle,
  Clock,
  Trophy,
  Flame,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

const questIcons: Record<string, React.ReactNode> = {
  complete_lessons: <BookOpen className="w-6 h-6" />,
  earn_xp: <Star className="w-6 h-6" />,
  practice_phonemes: <Volume2 className="w-6 h-6" />,
  perfect_score: <Trophy className="w-6 h-6" />,
};

const questColors: Record<string, string> = {
  complete_lessons: 'from-blue-500 to-indigo-500',
  earn_xp: 'from-yellow-500 to-orange-500',
  practice_phonemes: 'from-purple-500 to-pink-500',
  perfect_score: 'from-green-500 to-emerald-500',
};

export default function QuestsPage() {
  const {
    dailyQuests,
    refreshDailyQuests,
    currentStreak,
    longestStreak,
    xp,
    level,
  } = useGameStore();

  // Refresh quests on page load
  useEffect(() => {
    refreshDailyQuests();
  }, [refreshDailyQuests]);

  const completedQuests = dailyQuests.filter((q) => q.completed).length;
  const totalXPAvailable = dailyQuests.reduce((sum, q) => sum + (q.completed ? 0 : q.xpReward), 0);

  // Get time until quests refresh (midnight)
  const getTimeUntilRefresh = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Daily Quests</h1>
            <p className="text-gray-500">Complete quests to earn bonus XP!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Resets in {getTimeUntilRefresh()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentStreak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100">
              <Trophy className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{longestStreak}</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {completedQuests}/{dailyQuests.length}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-100">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">+{totalXPAvailable}</div>
            <div className="text-xs text-gray-500">XP Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Today&apos;s Quests
        </h2>

        {dailyQuests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Quests Available</h3>
              <p className="text-gray-500 mb-4">
                Check back tomorrow for new daily quests!
              </p>
              <Button variant="primary" onClick={() => refreshDailyQuests()}>
                Refresh Quests
              </Button>
            </CardContent>
          </Card>
        ) : (
          dailyQuests.map((quest, index) => {
            const progress = Math.min((quest.currentValue / quest.targetValue) * 100, 100);
            const icon = questIcons[quest.type] || <Target className="w-6 h-6" />;
            const color = questColors[quest.type] || 'from-gray-500 to-gray-600';

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    'overflow-hidden transition-all',
                    quest.completed && 'opacity-75'
                  )}
                >
                  <div className={cn('h-1 bg-gradient-to-r', color)} />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          'p-3 rounded-xl bg-gradient-to-br text-white shrink-0',
                          color
                        )}
                      >
                        {icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{quest.title}</h3>
                          {quest.completed && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{quest.description}</p>

                        {/* Progress bar */}
                        <div className="relative">
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className={cn(
                                'h-full rounded-full bg-gradient-to-r',
                                quest.completed ? 'from-green-400 to-emerald-500' : color
                              )}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {quest.currentValue} / {quest.targetValue}
                            </span>
                            <span className="text-xs font-medium text-gray-600">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reward */}
                      <div className="text-right shrink-0">
                        <div
                          className={cn(
                            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold',
                            quest.completed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          )}
                        >
                          <Zap className="w-4 h-4" />
                          {quest.completed ? 'Claimed' : `+${quest.xpReward} XP`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Tips for Completing Quests
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-medium text-gray-800 mb-1">Complete Lessons</h4>
              <p className="text-sm text-gray-500">
                Each lesson you finish counts toward your daily quest progress.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <Volume2 className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-medium text-gray-800 mb-1">Practice Phonemes</h4>
              <p className="text-sm text-gray-500">
                Every sound you practice in lessons counts toward your total.
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <Flame className="w-6 h-6 text-orange-500 mb-2" />
              <h4 className="font-medium text-gray-800 mb-1">Keep Your Streak</h4>
              <p className="text-sm text-gray-500">
                Come back every day to maintain your streak and earn bonus rewards!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
