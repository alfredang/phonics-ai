'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Pause, RotateCcw } from 'lucide-react';
import { Sentence, SentenceWord, IntonationPoint } from '@/types/phonics';
import { InlineIntonation } from './IntonationArrows';
import { speechSynthesis } from '@/lib/audio/speechSynthesis';
import { cn } from '@/lib/utils/cn';

interface KaraokeTextProps {
  sentence: Sentence;
  onComplete?: () => void;
  autoPlay?: boolean;
  showIntonation?: boolean;
  showStress?: boolean;
  className?: string;
}

/**
 * Karaoke-style text display with word-by-word highlighting
 * synchronized with TTS playback
 */
export function KaraokeText({
  sentence,
  onComplete,
  autoPlay = false,
  showIntonation = true,
  showStress = true,
  className,
}: KaraokeTextProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Calculate word timing based on average speaking rate
  const getWordDuration = (word: string) => {
    // Average speaking rate: ~150 words per minute = 400ms per word
    // Adjust based on word length
    const baseTime = 350;
    const lengthFactor = Math.min(word.length / 5, 1.5);
    return baseTime * lengthFactor;
  };

  const playSequence = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setCurrentWordIndex(-1);

    // Start TTS for full sentence
    speechSynthesis.speak(sentence.text, {
      rate: 0.85,
      onEnd: () => {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        setHasPlayed(true);
        onComplete?.();
      },
    });

    // Animate through words with timing
    let totalDelay = 200; // Initial delay
    for (let i = 0; i < sentence.words.length; i++) {
      const word = sentence.words[i];
      const duration = getWordDuration(word.text);

      setTimeout(() => {
        setCurrentWordIndex(i);
      }, totalDelay);

      totalDelay += duration;
    }
  }, [isPlaying, sentence, onComplete]);

  const stopPlayback = () => {
    speechSynthesis.stop();
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  };

  const reset = () => {
    stopPlayback();
    setHasPlayed(false);
  };

  useEffect(() => {
    if (autoPlay && !hasPlayed) {
      const timer = setTimeout(playSequence, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, hasPlayed, playSequence]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.stop();
    };
  }, []);

  const getIntonationForWord = (index: number): IntonationPoint | undefined => {
    return sentence.intonationPattern.find((p) => p.wordIndex === index);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Sentence display */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 text-2xl leading-relaxed">
          {sentence.words.map((word, index) => {
            const intonation = getIntonationForWord(index);
            const isActive = currentWordIndex === index;
            const isPast = currentWordIndex > index;

            return (
              <span key={index} className="relative inline-flex flex-col items-center">
                {/* Intonation arrow above word */}
                {showIntonation && intonation && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                  >
                    <InlineIntonation direction={intonation.direction} />
                  </motion.span>
                )}

                {/* Word */}
                <motion.span
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive
                      ? '#7C3AED'
                      : isPast
                      ? '#9CA3AF'
                      : '#1F2937',
                  }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'transition-all',
                    word.isStressed && showStress && 'font-bold',
                    isActive && 'bg-purple-100 px-2 py-1 rounded-lg'
                  )}
                >
                  {word.text}
                </motion.span>

                {/* Stress indicator */}
                {showStress && word.isStressed && (
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </span>
            );
          })}
        </div>

        {/* Sentence type indicator */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              sentence.type === 'statement' && 'bg-blue-100 text-blue-700',
              sentence.type === 'question' && 'bg-green-100 text-green-700',
              sentence.type === 'exclamation' && 'bg-orange-100 text-orange-700',
              sentence.type === 'command' && 'bg-purple-100 text-purple-700'
            )}
          >
            {sentence.type.charAt(0).toUpperCase() + sentence.type.slice(1)}
          </span>
          <span className="text-xs text-gray-400">
            Difficulty: {'⭐'.repeat(sentence.difficulty)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <motion.button
          onClick={isPlaying ? stopPlayback : playSequence}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
            isPlaying
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              Stop
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              {hasPlayed ? 'Play Again' : 'Listen'}
            </>
          )}
        </motion.button>

        {hasPlayed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={reset}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        )}
      </div>

      {/* Intonation guide */}
      {showIntonation && sentence.intonationPattern.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          <span className="text-green-500">↗️</span> = voice goes up &nbsp;
          <span className="text-red-500">↘️</span> = voice goes down &nbsp;
          <span className="text-blue-500">➡️</span> = hold steady
        </div>
      )}
    </div>
  );
}

/**
 * Simple sentence display without karaoke (for assessment)
 */
interface SimpleSentenceDisplayProps {
  sentence: Sentence;
  showIntonation?: boolean;
  className?: string;
}

export function SimpleSentenceDisplay({
  sentence,
  showIntonation = false,
  className,
}: SimpleSentenceDisplayProps) {
  return (
    <div className={cn('text-2xl text-gray-800', className)}>
      {sentence.words.map((word, index) => {
        const intonation = sentence.intonationPattern.find((p) => p.wordIndex === index);

        return (
          <span key={index}>
            <span className={cn(word.isStressed && 'font-bold')}>{word.text}</span>
            {showIntonation && intonation && (
              <InlineIntonation direction={intonation.direction} />
            )}
            {index < sentence.words.length - 1 && ' '}
          </span>
        );
      })}
    </div>
  );
}
