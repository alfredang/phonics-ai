'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  Mic,
  Play,
  CheckCircle,
  Star,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { getWorld, WorldDefinition } from '@/constants/worlds';
import { getSentencesForLesson, SENTENCE_LESSONS } from '@/constants/sentences';
import { Sentence } from '@/types/phonics';
import { SentencePractice } from './SentencePractice';
import { KaraokeText } from './KaraokeText';
import { IntonationLegend } from './IntonationArrows';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface SentenceLessonClientProps {
  worldId: string;
  lessonId: string;
}

type LessonPhase = 'intro' | 'listen' | 'practice' | 'assess';

const phases: { id: LessonPhase; name: string; icon: React.ReactNode }[] = [
  { id: 'intro', name: 'Learn', icon: <Volume2 className="w-4 h-4" /> },
  { id: 'listen', name: 'Listen', icon: <Volume2 className="w-4 h-4" /> },
  { id: 'practice', name: 'Practice', icon: <Mic className="w-4 h-4" /> },
  { id: 'assess', name: 'Assess', icon: <CheckCircle className="w-4 h-4" /> },
];

export default function SentenceLessonClient({
  worldId,
  lessonId,
}: SentenceLessonClientProps) {
  const { completeLesson, addXP } = useGameStore();
  const [world, setWorld] = useState<WorldDefinition | undefined>(getWorld(worldId));
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('intro');
  const [phaseProgress, setPhaseProgress] = useState({
    intro: false,
    listen: false,
    practice: false,
    assess: false,
  });

  // Sentence navigation
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  // Practice state
  const [practiceScores, setPracticeScores] = useState<number[]>([]);

  // Assess state
  const [assessScores, setAssessScores] = useState<number[]>([]);
  const [assessComplete, setAssessComplete] = useState(false);

  const lessonNumber = parseInt(lessonId, 10);
  const lessonInfo = SENTENCE_LESSONS[lessonNumber - 1];

  useEffect(() => {
    const foundWorld = getWorld(worldId);
    setWorld(foundWorld);

    const lessonSentences = getSentencesForLesson(lessonNumber);
    setSentences(lessonSentences);
  }, [worldId, lessonNumber]);

  const currentSentence = sentences[currentSentenceIndex];

  const handlePhaseComplete = () => {
    setPhaseProgress((prev) => ({ ...prev, [currentPhase]: true }));

    const currentPhaseIndex = phases.findIndex((p) => p.id === currentPhase);
    const nextPhaseIndex = currentPhaseIndex + 1;

    if (nextPhaseIndex < phases.length) {
      setCurrentPhase(phases[nextPhaseIndex].id);
      setCurrentSentenceIndex(0);
    } else {
      // Lesson complete
      const lessonKey = `${worldId}-lesson-${lessonId}`;
      completeLesson(lessonKey);
      const avgScore =
        assessScores.length > 0
          ? assessScores.reduce((a, b) => a + b, 0) / assessScores.length
          : 70;
      const earnedXP = Math.round(50 + (avgScore / 100) * 30);
      addXP(earnedXP);
    }
  };

  const handlePracticeComplete = (score: number) => {
    setPracticeScores((prev) => [...prev, score]);
  };

  const handlePracticeNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    }
  };

  const handleAssessComplete = (score: number) => {
    setAssessScores((prev) => [...prev, score]);
    if (currentSentenceIndex >= sentences.length - 1) {
      setAssessComplete(true);
    } else {
      setCurrentSentenceIndex((prev) => prev + 1);
    }
  };

  const canProgressIntro = true;
  const canProgressListen = currentSentenceIndex >= sentences.length - 1;
  const canProgressPractice = practiceScores.length >= sentences.length;
  const canProgressAssess = assessComplete;

  const allPhasesComplete = Object.values(phaseProgress).every(Boolean);
  const currentPhaseIndex = phases.findIndex((p) => p.id === currentPhase);

  const calculateStars = () => {
    const avgScore =
      assessScores.length > 0
        ? assessScores.reduce((a, b) => a + b, 0) / assessScores.length
        : 0;
    if (avgScore >= 80) return 3;
    if (avgScore >= 60) return 2;
    return 1;
  };

  if (!world || sentences.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/dashboard/worlds/${worldId}`}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to {world.name}
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{world.emoji}</span>
          <div>
            <span className="font-semibold text-gray-700">Lesson {lessonNumber}</span>
            <p className="text-xs text-gray-500">{lessonInfo?.title || 'Intonation Practice'}</p>
          </div>
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
                    ? 'bg-yellow-500 text-white'
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
          <AnimatePresence mode="wait">
            {allPhasesComplete ? (
              /* Lesson Complete */
              <motion.div
                key="complete"
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
                      <Star
                        className={cn(
                          'w-12 h-12',
                          star <= calculateStars()
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        )}
                      />
                    </motion.div>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Lesson Complete!
                </h2>
                <p className="text-gray-500 mb-6">
                  Great intonation practice! You earned{' '}
                  {Math.round(
                    50 +
                      ((assessScores.reduce((a, b) => a + b, 0) /
                        Math.max(1, assessScores.length) /
                        100) *
                        30)
                  )}{' '}
                  XP!
                </p>
                <div className="flex justify-center gap-4">
                  <Link href={`/dashboard/worlds/${worldId}`}>
                    <Button variant="outline">Back to World</Button>
                  </Link>
                  {lessonNumber < 15 && (
                    <Link
                      href={`/dashboard/worlds/${worldId}/lessons/${lessonNumber + 1}`}
                    >
                      <Button variant="primary">Next Lesson</Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ) : currentPhase === 'intro' ? (
              /* Intro Phase - Learn about intonation */
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {lessonInfo?.title || 'Intonation Practice'}
                  </h2>
                  <p className="text-gray-500">
                    Learn how to make your voice go up and down when speaking
                  </p>
                </div>

                {/* Intonation explanation */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    What is Intonation?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Intonation is the music of language - how your voice rises
                    and falls when you speak. It helps show meaning and emotion!
                  </p>

                  <IntonationLegend className="justify-center" />

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4">
                      <p className="font-medium text-gray-800 mb-2">
                        ↘️ Falling (Statements)
                      </p>
                      <p className="text-sm text-gray-500">
                        &ldquo;I like pizza.&rdquo; - Voice goes down at the end
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="font-medium text-gray-800 mb-2">
                        ↗️ Rising (Yes/No Questions)
                      </p>
                      <p className="text-sm text-gray-500">
                        &ldquo;Do you like pizza?&rdquo; - Voice goes up at the end
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePhaseComplete}
                  >
                    Start Learning
                  </Button>
                </div>
              </motion.div>
            ) : currentPhase === 'listen' ? (
              /* Listen Phase */
              <motion.div
                key="listen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Listen & Watch
                  </h2>
                  <p className="text-gray-500">
                    Sentence {currentSentenceIndex + 1} of {sentences.length}
                  </p>
                </div>

                {currentSentence && (
                  <KaraokeText
                    sentence={currentSentence}
                    showIntonation
                    showStress
                    onComplete={() => {
                      if (currentSentenceIndex < sentences.length - 1) {
                        setTimeout(() => {
                          setCurrentSentenceIndex((prev) => prev + 1);
                        }, 1000);
                      }
                    }}
                  />
                )}

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentSentenceIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentSentenceIndex === 0}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>
                  {canProgressListen ? (
                    <Button
                      variant="primary"
                      onClick={handlePhaseComplete}
                    >
                      Start Practice
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() =>
                        setCurrentSentenceIndex((prev) =>
                          Math.min(sentences.length - 1, prev + 1)
                        )
                      }
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : currentPhase === 'practice' ? (
              /* Practice Phase */
              <motion.div
                key="practice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">
                    Practice {practiceScores.length + 1} of {sentences.length}
                  </p>
                </div>

                {currentSentence && (
                  <SentencePractice
                    sentence={currentSentence}
                    onComplete={handlePracticeComplete}
                    onNext={
                      practiceScores.length < sentences.length - 1
                        ? handlePracticeNext
                        : undefined
                    }
                  />
                )}

                {canProgressPractice && (
                  <div className="text-center mt-6">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handlePhaseComplete}
                    >
                      Continue to Assessment
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : currentPhase === 'assess' ? (
              /* Assess Phase */
              <motion.div
                key="assess"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {!assessComplete ? (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Final Assessment
                      </h2>
                      <p className="text-sm text-gray-500">
                        Sentence {assessScores.length + 1} of {sentences.length}
                      </p>
                    </div>

                    {currentSentence && (
                      <SentencePractice
                        sentence={currentSentence}
                        onComplete={handleAssessComplete}
                        showIntonationGuide={false}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">
                      {assessScores.reduce((a, b) => a + b, 0) /
                        assessScores.length >=
                      80
                        ? '🌟'
                        : assessScores.reduce((a, b) => a + b, 0) /
                            assessScores.length >=
                          60
                        ? '👍'
                        : '💪'}
                    </div>
                    <p className="text-xl font-medium text-gray-700 mb-2">
                      Average Score:{' '}
                      {Math.round(
                        assessScores.reduce((a, b) => a + b, 0) /
                          assessScores.length
                      )}
                      %
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handlePhaseComplete}
                    >
                      Complete Lesson
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
