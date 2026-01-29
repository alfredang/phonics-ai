'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Pause, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { LessonPhase } from '@/types/lesson';
import { useLessonStore } from '@/stores/lessonStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils/cn';

interface LessonHeaderProps {
  title: string;
  currentPhase: LessonPhase;
  phaseProgress?: number;
  className?: string;
}

const phaseLabels: Record<LessonPhase, { label: string; emoji: string; color: string }> = {
  listen: { label: 'Listen', emoji: '👂', color: 'from-blue-500 to-cyan-500' },
  practice: { label: 'Practice', emoji: '✏️', color: 'from-purple-500 to-pink-500' },
  play: { label: 'Play', emoji: '🎮', color: 'from-green-500 to-emerald-500' },
  assess: { label: 'Assess', emoji: '⭐', color: 'from-yellow-500 to-orange-500' },
};

const phaseOrder: LessonPhase[] = ['listen', 'practice', 'play', 'assess'];

export function LessonHeader({
  title,
  currentPhase,
  phaseProgress = 0,
  className,
}: LessonHeaderProps) {
  const router = useRouter();
  const { exitLesson, consumeHint } = useLessonStore();
  const { openModal, soundMuted, toggleSound } = useUIStore();

  const currentPhaseInfo = phaseLabels[currentPhase];
  const currentPhaseIndex = phaseOrder.indexOf(currentPhase);

  const handleExit = () => {
    openModal('confirmation', {
      title: 'Exit Lesson?',
      message: 'Your progress will not be saved.',
      onConfirm: () => {
        exitLesson();
        router.push('/dashboard/worlds');
      },
    });
  };

  const handlePause = () => {
    openModal('pause');
  };

  const handleHint = () => {
    consumeHint();
    // Show hint based on current phase/exercise
  };

  return (
    <header className={cn('bg-white/90 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30', className)}>
      {/* Top row: Title and controls */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Exit button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleExit}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Center: Lesson title and current phase */}
        <div className="text-center">
          <h1 className="font-bold text-gray-800">{title}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-lg">{currentPhaseInfo.emoji}</span>
            <span className={cn(
              'text-sm font-semibold bg-gradient-to-r bg-clip-text text-transparent',
              currentPhaseInfo.color
            )}>
              {currentPhaseInfo.label}
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSound}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHint}
            className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 hover:bg-purple-200 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Phase progress indicator */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          {phaseOrder.map((phase, index) => {
            const info = phaseLabels[phase];
            const isComplete = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;

            return (
              <div key={phase} className="flex-1 flex items-center">
                {/* Phase dot/icon */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isComplete
                      ? '#10B981'
                      : isCurrent
                      ? '#8B5CF6'
                      : '#E5E7EB',
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <span className={cn(
                    'text-sm',
                    isComplete || isCurrent ? 'grayscale-0' : 'grayscale opacity-50'
                  )}>
                    {info.emoji}
                  </span>
                </motion.div>

                {/* Connector line */}
                {index < phaseOrder.length - 1 && (
                  <div className="flex-1 h-1 mx-1 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: isComplete ? '100%' : isCurrent ? `${phaseProgress}%` : '0%',
                      }}
                      className={cn(
                        'h-full rounded-full bg-gradient-to-r',
                        info.color
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
