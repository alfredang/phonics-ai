'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, Volume2, Star, Gamepad2, Target, Puzzle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ALL_PHONEMES, getPhoneme } from '@/constants/phonemes';
import { speechSynthesis } from '@/lib/audio/speechSynthesis';
import { cn } from '@/lib/utils/cn';

interface GameDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  emoji: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isAvailable: boolean;
}

const GAMES: GameDefinition[] = [
  {
    id: 'phoneme-pop',
    name: 'Phoneme Pop',
    description: 'Pop bubbles with the target sound before they float away! Test your speed and accuracy.',
    icon: <Target className="w-8 h-8" />,
    emoji: '🫧',
    color: 'from-purple-500 to-pink-500',
    difficulty: 'easy',
    isAvailable: true,
  },
  {
    id: 'word-builder',
    name: 'Word Builder',
    description: 'Drag letter tiles to build words. Practice spelling and phoneme blending.',
    icon: <Puzzle className="w-8 h-8" />,
    emoji: '🧩',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'medium',
    isAvailable: false,
  },
  {
    id: 'sound-match',
    name: 'Sound Match',
    description: 'Memory matching game with audio. Match words that share the same sound.',
    icon: <Gamepad2 className="w-8 h-8" />,
    emoji: '🎴',
    color: 'from-green-500 to-emerald-500',
    difficulty: 'easy',
    isAvailable: false,
  },
  {
    id: 'sound-race',
    name: 'Sound Race',
    description: 'Race against the clock! Identify phonemes as fast as you can.',
    icon: <Zap className="w-8 h-8" />,
    emoji: '⚡',
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'hard',
    isAvailable: false,
  },
];

// Popular phonemes for quick selection
const POPULAR_PHONEMES = ['short-a', 'short-e', 'short-i', 'short-o', 'short-u', 'th-voiced', 'sh', 'ch'];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null);
  const [selectedPhoneme, setSelectedPhoneme] = useState<string>('short-a');
  const [showAllPhonemes, setShowAllPhonemes] = useState(false);

  const handlePlaySound = (symbol: string) => {
    speechSynthesis.speak(symbol, { rate: 0.8 });
  };

  const currentPhoneme = getPhoneme(selectedPhoneme);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Practice Games</h1>
            <p className="text-gray-500">Choose a game and phoneme to practice</p>
          </div>
        </div>
      </div>

      {!selectedGame ? (
        /* Game Selection */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GAMES.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    'overflow-hidden transition-all hover:shadow-lg cursor-pointer',
                    !game.isAvailable && 'opacity-60'
                  )}
                  onClick={() => game.isAvailable && setSelectedGame(game)}
                >
                  <div className={cn('h-2 bg-gradient-to-r', game.color)} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'p-4 rounded-2xl bg-gradient-to-br text-white',
                          game.color
                        )}
                      >
                        {game.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{game.emoji}</span>
                          <h3 className="text-xl font-bold text-gray-800">{game.name}</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-3">{game.description}</p>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'text-xs font-medium px-2 py-1 rounded-full',
                              game.difficulty === 'easy' && 'bg-green-100 text-green-700',
                              game.difficulty === 'medium' && 'bg-yellow-100 text-yellow-700',
                              game.difficulty === 'hard' && 'bg-red-100 text-red-700'
                            )}
                          >
                            {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                          </span>
                          {!game.isAvailable && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">Your Game Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-500">Games Played</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">0%</div>
                  <div className="text-sm text-gray-500">Avg Accuracy</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-600">0</div>
                  <div className="text-sm text-gray-500">High Score</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-500">XP Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Phoneme Selection */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Selected Game Banner */}
          <Card className="overflow-hidden">
            <div className={cn('h-2 bg-gradient-to-r', selectedGame.color)} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'p-4 rounded-2xl bg-gradient-to-br text-white',
                      selectedGame.color
                    )}
                  >
                    {selectedGame.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedGame.emoji}</span>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedGame.name}</h2>
                    </div>
                    <p className="text-gray-500">{selectedGame.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedGame(null)}>
                  Change Game
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Phoneme Selection */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">Select a Sound to Practice</h3>

              {/* Popular phonemes */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Popular choices:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_PHONEMES.map((phonemeId) => {
                    const phoneme = getPhoneme(phonemeId);
                    if (!phoneme) return null;
                    return (
                      <motion.button
                        key={phonemeId}
                        onClick={() => setSelectedPhoneme(phonemeId)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2',
                          selectedPhoneme === phonemeId
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        <span className="text-lg">{phoneme.symbol}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySound(phoneme.symbol);
                          }}
                          className="p-1 rounded-full hover:bg-white/20"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Show all phonemes toggle */}
              <button
                onClick={() => setShowAllPhonemes(!showAllPhonemes)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium mb-4"
              >
                {showAllPhonemes ? 'Show less' : 'Show all 44 phonemes'}
              </button>

              {/* All phonemes grid */}
              {showAllPhonemes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t pt-4"
                >
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {ALL_PHONEMES.map((phoneme) => (
                      <motion.button
                        key={phoneme.id}
                        onClick={() => setSelectedPhoneme(phoneme.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'p-3 rounded-xl font-bold text-center transition-all',
                          selectedPhoneme === phoneme.id
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'bg-gray-50 hover:bg-gray-100'
                        )}
                        style={{
                          backgroundColor:
                            selectedPhoneme === phoneme.id ? undefined : `${phoneme.color}20`,
                          borderColor: phoneme.color,
                        }}
                      >
                        <span className="text-xl">{phoneme.symbol}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Selected phoneme preview */}
              {currentPhoneme && (
                <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                        style={{ backgroundColor: currentPhoneme.color }}
                      >
                        {currentPhoneme.symbol}
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">
                          IPA: <span className="font-mono">/{currentPhoneme.ipa}/</span>
                        </p>
                        <p className="text-gray-600">
                          Example: <strong>{currentPhoneme.examples[0]}</strong>
                        </p>
                        <p className="text-gray-500 text-sm">{currentPhoneme.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handlePlaySound(currentPhoneme.symbol)}
                      leftIcon={<Volume2 className="w-4 h-4" />}
                    >
                      Hear Sound
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Play Button */}
          <div className="flex justify-center">
            <Link href={`/dashboard/games/${selectedGame.id}?phoneme=${selectedPhoneme}`}>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play className="w-5 h-5" />}
                className="px-12 py-4 text-lg"
              >
                Play {selectedGame.name}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
