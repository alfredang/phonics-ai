'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Home, Star } from 'lucide-react';
import { PhonemePopGame } from '@/components/games/PhonemePop';
import { getPhoneme, ALL_PHONEMES } from '@/constants/phonemes';
import { Phoneme } from '@/types/phonics';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useGameStore } from '@/stores/gameStore';

export default function PhonemePopPage() {
  const searchParams = useSearchParams();
  const phonemeId = searchParams.get('phoneme') || 'short-a';
  const { addXP } = useGameStore();

  const [targetPhoneme, setTargetPhoneme] = useState<Phoneme | null>(null);
  const [distractors, setDistractors] = useState<Phoneme[]>([]);
  const [gameKey, setGameKey] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);

  useEffect(() => {
    const phoneme = getPhoneme(phonemeId);
    if (phoneme) {
      setTargetPhoneme(phoneme);
      // Select random distractors (different phonemes from the target)
      const otherPhonemes = ALL_PHONEMES.filter((p) => p.id !== phonemeId);
      const shuffled = otherPhonemes.sort(() => Math.random() - 0.5);
      setDistractors(shuffled.slice(0, 5));
    }
  }, [phonemeId]);

  const handleGameComplete = (score: number, accuracy: number) => {
    setGameComplete(true);
    setFinalScore(score);
    setFinalAccuracy(accuracy);

    // Award XP based on score
    const earnedXP = Math.round(score * 0.5);
    if (earnedXP > 0) {
      addXP(earnedXP);
    }
  };

  const handlePlayAgain = () => {
    setGameComplete(false);
    setFinalScore(0);
    setFinalAccuracy(0);
    setGameKey((prev) => prev + 1);
  };

  if (!targetPhoneme) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Back button */}
      <div className="p-4 bg-white border-b">
        <Link href="/dashboard/games">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Games
          </Button>
        </Link>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative">
        {!gameComplete ? (
          <PhonemePopGame
            key={gameKey}
            targetPhoneme={targetPhoneme}
            distractorPhonemes={distractors}
            duration={60}
            targetScore={100}
            onComplete={handleGameComplete}
          />
        ) : (
          /* Game Complete Screen */
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-purple-500 to-pink-500">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">
                    {finalScore >= 80 ? '🏆' : finalScore >= 50 ? '🌟' : '👏'}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {finalScore >= 80 ? 'Amazing!' : finalScore >= 50 ? 'Great Job!' : 'Good Try!'}
                  </h2>

                  <div className="flex justify-center gap-2 my-4">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-10 h-10 ${
                          (finalScore >= 40 && star === 1) ||
                          (finalScore >= 60 && star === 2) ||
                          (finalScore >= 80 && star === 3)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-3 my-6">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                      <span className="text-gray-600">Score</span>
                      <span className="text-2xl font-bold text-purple-600">{finalScore}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <span className="text-gray-600">Accuracy</span>
                      <span className="text-2xl font-bold text-green-600">{finalAccuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                      <span className="text-gray-600">XP Earned</span>
                      <span className="text-2xl font-bold text-yellow-600">+{Math.round(finalScore * 0.5)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePlayAgain}
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                      className="flex-1"
                    >
                      Play Again
                    </Button>
                    <Link href="/dashboard/games" className="flex-1">
                      <Button
                        variant="primary"
                        leftIcon={<Home className="w-4 h-4" />}
                        className="w-full"
                      >
                        More Games
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
