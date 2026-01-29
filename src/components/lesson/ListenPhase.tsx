'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, ChevronRight, Check } from 'lucide-react';
import { Phoneme } from '@/types/phonics';
import { useLessonStore } from '@/stores/lessonStore';
import { useAudioStore } from '@/stores/audioStore';
import { PhonemeCard, PhonemeCardExtended } from '@/components/phonics/PhonemeCard';
import { MouthAnimation } from '@/components/phonics/MouthAnimation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface ListenPhaseProps {
  phonemes: Phoneme[];
  autoPlay?: boolean;
  onComplete: () => void;
}

export function ListenPhase({
  phonemes,
  autoPlay = true,
  onComplete,
}: ListenPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedPhonemes, setPlayedPhonemes] = useState<Set<string>>(new Set());

  const { updateListenProgress } = useLessonStore();
  const { speakPhoneme, isSpeaking } = useAudioStore();

  const currentPhoneme = phonemes[currentIndex];
  const isLastPhoneme = currentIndex === phonemes.length - 1;
  const allPlayed = playedPhonemes.size === phonemes.length;

  // Auto-play on mount and phoneme change
  useEffect(() => {
    if (autoPlay && currentPhoneme && !playedPhonemes.has(currentPhoneme.id)) {
      const timer = setTimeout(() => {
        playCurrentPhoneme();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlay]);

  const playCurrentPhoneme = async () => {
    if (!currentPhoneme) return;

    setIsPlaying(true);
    try {
      // Speak the phoneme sound
      await speakPhoneme(currentPhoneme.symbol);

      // Wait a moment then speak example words
      await new Promise((resolve) => setTimeout(resolve, 500));
      for (const word of currentPhoneme.examples.slice(0, 3)) {
        await speakPhoneme(word);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Mark as played
      setPlayedPhonemes((prev) => new Set([...Array.from(prev), currentPhoneme.id]));
      updateListenProgress(currentPhoneme.id);
    } finally {
      setIsPlaying(false);
    }
  };

  const goToNext = () => {
    if (isLastPhoneme) {
      if (allPlayed) {
        onComplete();
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {phonemes.map((phoneme, index) => (
          <motion.button
            key={phoneme.id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              index === currentIndex
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 shadow-lg'
                : playedPhonemes.has(phoneme.id)
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            )}
          >
            {playedPhonemes.has(phoneme.id) ? (
              <Check className="w-5 h-5" />
            ) : (
              phoneme.symbol
            )}
          </motion.button>
        ))}
      </div>

      {/* Current phoneme display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoneme?.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header with large phoneme */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-center text-white">
              <motion.span
                key={currentPhoneme?.symbol}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-bold block mb-2"
              >
                {currentPhoneme?.symbol}
              </motion.span>
              <span className="text-2xl font-mono opacity-80">
                {currentPhoneme?.ipa}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Mouth animation */}
              <div className="flex justify-center">
                <MouthAnimation
                  mouthShape={currentPhoneme?.mouthShape || 'closed'}
                  isAnimating={isPlaying}
                  size={120}
                />
              </div>

              {/* Description */}
              <div className="text-center">
                <p className="text-lg text-gray-700">{currentPhoneme?.description}</p>
              </div>

              {/* Tips */}
              {currentPhoneme?.tips && currentPhoneme.tips.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-700 mb-2">Tips:</h4>
                  <ul className="space-y-1">
                    {currentPhoneme.tips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-purple-600"
                      >
                        <span className="text-green-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Example words */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 text-center">
                  Example Words:
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentPhoneme?.examples.map((word, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => speakPhoneme(word)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      {word}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Play button */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={playCurrentPhoneme}
                  isLoading={isPlaying}
                  leftIcon={<Volume2 className="w-6 h-6" />}
                  className="px-8"
                >
                  {isPlaying ? 'Playing...' : 'Listen Again'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="ghost"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <span className="text-gray-500">
          {currentIndex + 1} of {phonemes.length}
        </span>

        <Button
          variant={allPlayed && isLastPhoneme ? 'success' : 'primary'}
          onClick={goToNext}
          rightIcon={<ChevronRight className="w-5 h-5" />}
          disabled={!playedPhonemes.has(currentPhoneme?.id || '')}
        >
          {isLastPhoneme ? (allPlayed ? 'Continue' : 'Listen First') : 'Next'}
        </Button>
      </div>
    </div>
  );
}
