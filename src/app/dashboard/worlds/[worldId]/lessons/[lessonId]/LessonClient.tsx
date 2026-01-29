'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  Mic,
  Play,
  CheckCircle,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { getWorld } from '@/constants/worlds';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface LessonClientProps {
  worldId: string;
  lessonId: string;
}

type LessonPhase = 'listen' | 'practice' | 'play' | 'assess';

const phases: { id: LessonPhase; name: string; icon: React.ReactNode }[] = [
  { id: 'listen', name: 'Listen', icon: <Volume2 className="w-4 h-4" /> },
  { id: 'practice', name: 'Practice', icon: <Mic className="w-4 h-4" /> },
  { id: 'play', name: 'Play', icon: <Play className="w-4 h-4" /> },
  { id: 'assess', name: 'Assess', icon: <CheckCircle className="w-4 h-4" /> },
];

export default function LessonClient({ worldId, lessonId }: LessonClientProps) {
  const router = useRouter();
  const { completeLesson, addXP } = useGameStore();
  const [world, setWorld] = useState(getWorld(worldId));
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('listen');
  const [phaseProgress, setPhaseProgress] = useState({
    listen: false,
    practice: false,
    play: false,
    assess: false,
  });

  useEffect(() => {
    const foundWorld = getWorld(worldId);
    if (!foundWorld) {
      router.push('/dashboard/worlds');
      return;
    }
    setWorld(foundWorld);
  }, [worldId, router]);

  if (!world) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const lessonNumber = parseInt(lessonId, 10);
  const currentPhaseIndex = phases.findIndex((p) => p.id === currentPhase);

  const handlePhaseComplete = () => {
    setPhaseProgress((prev) => ({ ...prev, [currentPhase]: true }));

    const nextPhaseIndex = currentPhaseIndex + 1;
    if (nextPhaseIndex < phases.length) {
      setCurrentPhase(phases[nextPhaseIndex].id);
    } else {
      // Lesson complete
      const lessonKey = `${worldId}-lesson-${lessonId}`;
      completeLesson(lessonKey);
      addXP(50); // Award XP for completing lesson
    }
  };

  const allPhasesComplete = Object.values(phaseProgress).every(Boolean);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/dashboard/worlds/${worldId}`}>
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to {world.name}
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{world.emoji}</span>
          <span className="font-semibold text-gray-700">Lesson {lessonNumber}</span>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center flex-1">
              <motion.button
                onClick={() => phaseProgress[phase.id] && setCurrentPhase(phase.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
                  currentPhase === phase.id
                    ? 'bg-purple-500 text-white'
                    : phaseProgress[phase.id]
                    ? 'bg-green-100 text-green-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400'
                )}
                whileHover={phaseProgress[phase.id] ? { scale: 1.05 } : {}}
                whileTap={phaseProgress[phase.id] ? { scale: 0.95 } : {}}
              >
                {phaseProgress[phase.id] ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  phase.icon
                )}
                <span className="font-medium text-sm">{phase.name}</span>
              </motion.button>
              {index < phases.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-8">
          {allPhasesComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: star * 0.2 }}
                  >
                    <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Lesson Complete!
              </h2>
              <p className="text-gray-500 mb-6">
                Great job! You&apos;ve earned 50 XP.
              </p>
              <div className="flex justify-center gap-4">
                <Link href={`/dashboard/worlds/${worldId}`}>
                  <Button variant="outline">Back to World</Button>
                </Link>
                {lessonNumber < world.lessonCount && (
                  <Link href={`/dashboard/worlds/${worldId}/lessons/${lessonNumber + 1}`}>
                    <Button variant="primary">Next Lesson</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${world.theme.gradientFrom}, ${world.theme.gradientTo})`,
                  }}
                >
                  {phases[currentPhaseIndex].icon &&
                    React.cloneElement(phases[currentPhaseIndex].icon as React.ReactElement, {
                      className: 'w-10 h-10 text-white',
                    })}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {phases[currentPhaseIndex].name} Phase
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {currentPhase === 'listen' &&
                    'Listen carefully to the sounds and words. Pay attention to how they are pronounced.'}
                  {currentPhase === 'practice' &&
                    'Practice saying the sounds and words. Try to match the pronunciation you heard.'}
                  {currentPhase === 'play' &&
                    'Time to play! Complete the game to practice what you learned.'}
                  {currentPhase === 'assess' &&
                    'Show what you know! Complete the assessment to finish the lesson.'}
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePhaseComplete}
                >
                  Complete {phases[currentPhaseIndex].name}
                </Button>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
