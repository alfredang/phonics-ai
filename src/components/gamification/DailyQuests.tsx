'use client';

import { motion } from 'framer-motion';
import { Target, Check, Clock, Zap, ChevronRight } from 'lucide-react';
import { DailyQuest } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils/cn';

interface DailyQuestsProps {
  variant?: 'full' | 'compact' | 'mini';
  maxDisplay?: number;
  className?: string;
}

const questEmojis: Record<string, string> = {
  complete_lessons: '📚',
  earn_xp: '✨',
  practice_phonemes: '🔤',
  complete_games: '🎮',
  maintain_streak: '🔥',
  perfect_score: '⭐',
};

export function DailyQuests({
  variant = 'full',
  maxDisplay = 3,
  className,
}: DailyQuestsProps) {
  const { dailyQuests, refreshDailyQuests } = useGameStore();

  // Filter and sort quests
  const sortedQuests = [...dailyQuests].sort((a, b) => {
    // Incomplete first, then by progress
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (b.currentValue / b.targetValue) - (a.currentValue / a.targetValue);
  });

  const displayQuests = sortedQuests.slice(0, maxDisplay);
  const completedCount = dailyQuests.filter((q) => q.completed).length;

  if (variant === 'mini') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Target className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-gray-600">
          {completedCount}/{dailyQuests.length} Quests
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {displayQuests.map((quest) => (
          <QuestItemCompact key={quest.id} quest={quest} />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-800">Daily Quests</h3>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-bold text-purple-600">{completedCount}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">{dailyQuests.length}</span>
        </div>
      </div>

      {/* Quest list */}
      <div className="divide-y divide-gray-50">
        {displayQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <QuestItem quest={quest} />
          </motion.div>
        ))}
      </div>

      {/* Footer - refresh info */}
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Resets at midnight</span>
        </div>
        {dailyQuests.length > maxDisplay && (
          <button className="text-sm text-purple-600 font-medium flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function QuestItem({ quest }: { quest: DailyQuest }) {
  const progress = (quest.currentValue / quest.targetValue) * 100;
  const emoji = questEmojis[quest.type] || '🎯';

  return (
    <div className={cn('p-4', quest.completed && 'bg-green-50/50')}>
      <div className="flex items-start gap-3">
        {/* Emoji/Check */}
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            quest.completed
              ? 'bg-green-100 text-green-600'
              : 'bg-purple-100 text-2xl'
          )}
        >
          {quest.completed ? <Check className="w-5 h-5" /> : emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4
                className={cn(
                  'font-medium',
                  quest.completed ? 'text-green-700 line-through' : 'text-gray-800'
                )}
              >
                {quest.title}
              </h4>
              <p className="text-sm text-gray-500">{quest.description}</p>
            </div>

            {/* XP reward */}
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium flex-shrink-0',
                quest.completed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-700'
              )}
            >
              <Zap className="w-3 h-3" />
              {quest.completed ? 'Claimed' : `+${quest.xpReward}`}
            </div>
          </div>

          {/* Progress bar */}
          {!quest.completed && (
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar value={progress} className="flex-1" variant="default" />
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {quest.currentValue}/{quest.targetValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestItemCompact({ quest }: { quest: DailyQuest }) {
  const progress = (quest.currentValue / quest.targetValue) * 100;
  const emoji = questEmojis[quest.type] || '🎯';

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl',
        quest.completed ? 'bg-green-50' : 'bg-gray-50'
      )}
    >
      <span className="text-xl">{quest.completed ? '✅' : emoji}</span>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            quest.completed ? 'text-green-700' : 'text-gray-700'
          )}
        >
          {quest.title}
        </p>
        <ProgressBar value={progress} className="mt-1 h-1.5" />
      </div>
      <span className="text-xs text-gray-500">
        {quest.currentValue}/{quest.targetValue}
      </span>
    </div>
  );
}
