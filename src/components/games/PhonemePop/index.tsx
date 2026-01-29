'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Heart, Star, Clock, Pause, Play } from 'lucide-react';
import { Phoneme } from '@/types/phonics';
import { useAudioStore } from '@/stores/audioStore';
import { useLessonStore } from '@/stores/lessonStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface Bubble {
  id: string;
  phoneme: Phoneme;
  x: number;
  y: number;
  size: number;
  speed: number;
  isTarget: boolean;
}

interface PhonemPopGameProps {
  targetPhoneme: Phoneme;
  distractorPhonemes: Phoneme[];
  duration?: number; // seconds
  targetScore?: number;
  onComplete: (score: number, accuracy: number) => void;
}

export function PhonemePopGame({
  targetPhoneme,
  distractorPhonemes,
  duration = 60,
  targetScore = 100,
  onComplete,
}: PhonemPopGameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'complete'>('ready');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [correctPops, setCorrectPops] = useState(0);
  const [wrongPops, setWrongPops] = useState(0);
  const [combo, setCombo] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { speakPhoneme } = useAudioStore();
  const { updatePlayProgress } = useLessonStore();

  // Spawn bubbles
  const spawnBubble = useCallback(() => {
    if (!gameAreaRef.current) return;

    const area = gameAreaRef.current.getBoundingClientRect();
    const allPhonemes = [targetPhoneme, ...distractorPhonemes];
    const isTarget = Math.random() < 0.4; // 40% chance for target

    const phoneme = isTarget
      ? targetPhoneme
      : distractorPhonemes[Math.floor(Math.random() * distractorPhonemes.length)];

    const newBubble: Bubble = {
      id: `bubble-${Date.now()}-${Math.random()}`,
      phoneme,
      x: Math.random() * (area.width - 80),
      y: area.height + 50,
      size: 60 + Math.random() * 20,
      speed: 1 + Math.random() * 1.5,
      isTarget: phoneme.id === targetPhoneme.id,
    };

    setBubbles((prev) => [...prev, newBubble]);
  }, [targetPhoneme, distractorPhonemes]);

  // Move bubbles
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
          }))
          .filter((bubble) => bubble.y > -100)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [gameState]);

  // Spawn bubbles periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(spawnBubble, 1000);
    return () => clearInterval(interval);
  }, [gameState, spawnBubble]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Pop bubble
  const popBubble = (bubble: Bubble) => {
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

    if (bubble.isTarget) {
      // Correct!
      const comboMultiplier = 1 + combo * 0.1;
      const points = Math.round(10 * comboMultiplier);
      setScore((prev) => prev + points);
      setCorrectPops((prev) => prev + 1);
      setCombo((prev) => prev + 1);
      speakPhoneme(bubble.phoneme.symbol);
    } else {
      // Wrong!
      setWrongPops((prev) => prev + 1);
      setCombo(0);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          handleGameEnd();
        }
        return Math.max(0, newLives);
      });
    }
  };

  const handleGameEnd = () => {
    setGameState('complete');
    const accuracy = correctPops > 0 ? Math.round((correctPops / (correctPops + wrongPops)) * 100) : 0;
    const finalScore = Math.min(100, Math.round((score / targetScore) * 100));
    updatePlayProgress(finalScore);
    onComplete(finalScore, accuracy);
  };

  const startGame = () => {
    setGameState('playing');
    speakPhoneme(targetPhoneme.symbol);
  };

  const togglePause = () => {
    setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg p-4 flex items-center justify-between border-b">
        {/* Score */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-xl">{score}</span>
          {combo > 1 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-sm font-bold text-purple-500"
            >
              x{combo}
            </motion.span>
          )}
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                'w-6 h-6 transition-all',
                i < lives
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-300'
              )}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-xl font-mono">{timeLeft}s</span>
        </div>

        {/* Pause */}
        <button onClick={togglePause} className="p-2 rounded-full bg-gray-100">
          {gameState === 'paused' ? (
            <Play className="w-5 h-5" />
          ) : (
            <Pause className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Target indicator */}
      <div className="bg-purple-100 p-3 text-center">
        <span className="text-sm text-purple-600">Pop the bubbles with:</span>
        <button
          onClick={() => speakPhoneme(targetPhoneme.symbol)}
          className="ml-2 inline-flex items-center gap-2 px-4 py-1 bg-purple-500 text-white rounded-full font-bold"
        >
          <Volume2 className="w-4 h-4" />
          {targetPhoneme.symbol}
        </button>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="flex-1 relative bg-gradient-to-b from-sky-200 via-sky-300 to-blue-400 overflow-hidden"
      >
        {/* Ready screen */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm"
            >
              <div className="text-6xl mb-4">🫧</div>
              <h2 className="text-2xl font-bold mb-2">Phoneme Pop!</h2>
              <p className="text-gray-600 mb-4">
                Pop the bubbles with the sound{' '}
                <span className="font-bold text-purple-600">{targetPhoneme.symbol}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Avoid other sounds or you&apos;ll lose a life!
              </p>
              <Button variant="primary" size="lg" onClick={startGame}>
                Start Game
              </Button>
            </motion.div>
          </div>
        )}

        {/* Paused screen */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Paused</h2>
              <Button variant="primary" onClick={togglePause}>
                Resume
              </Button>
            </motion.div>
          </div>
        )}

        {/* Bubbles */}
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => popBubble(bubble)}
              style={{
                position: 'absolute',
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
              }}
              className={cn(
                'rounded-full flex items-center justify-center font-bold text-white',
                'bg-gradient-to-br shadow-lg cursor-pointer transition-transform',
                bubble.isTarget
                  ? 'from-purple-400 to-pink-500'
                  : 'from-blue-400 to-cyan-500'
              )}
            >
              <span className="text-xl">{bubble.phoneme.symbol}</span>
              {/* Bubble shine */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full" />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Complete screen */}
        {gameState === 'complete' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm"
            >
              <div className="text-6xl mb-4">
                {score >= targetScore ? '🎉' : lives <= 0 ? '💔' : '⏰'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {score >= targetScore
                  ? 'Amazing!'
                  : lives <= 0
                  ? 'Out of Lives!'
                  : "Time's Up!"}
              </h2>
              <div className="space-y-2 my-4">
                <p className="text-lg">
                  Score: <span className="font-bold text-purple-600">{score}</span>
                </p>
                <p className="text-lg">
                  Accuracy:{' '}
                  <span className="font-bold text-green-600">
                    {correctPops > 0
                      ? Math.round((correctPops / (correctPops + wrongPops)) * 100)
                      : 0}
                    %
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
