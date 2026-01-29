'use client';

import { motion } from 'framer-motion';
import { PhonemeCategory } from '@/types/phonics';
import { cn } from '@/lib/utils/cn';

interface ColoredSegment {
  text: string;
  category?: PhonemeCategory;
  phonemeId?: string;
  isHighlighted?: boolean;
}

interface PhonemeColorTextProps {
  segments: ColoredSegment[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  highlightedIndex?: number;
  onSegmentClick?: (index: number) => void;
  className?: string;
}

const categoryTextColors: Record<PhonemeCategory, string> = {
  short_vowel: 'text-red-600',
  long_vowel: 'text-teal-600',
  consonant: 'text-blue-600',
  digraph: 'text-purple-600',
  blend: 'text-orange-600',
  r_controlled: 'text-green-600',
  diphthong: 'text-pink-600',
};

const categoryBgColors: Record<PhonemeCategory, string> = {
  short_vowel: 'bg-red-100',
  long_vowel: 'bg-teal-100',
  consonant: 'bg-blue-100',
  digraph: 'bg-purple-100',
  blend: 'bg-orange-100',
  r_controlled: 'bg-green-100',
  diphthong: 'bg-pink-100',
};

const sizeStyles = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
};

export function PhonemeColorText({
  segments,
  size = 'md',
  animated = true,
  highlightedIndex,
  onSegmentClick,
  className,
}: PhonemeColorTextProps) {
  return (
    <div className={cn('inline-flex items-baseline', sizeStyles[size], className)}>
      {segments.map((segment, index) => {
        const isHighlighted = highlightedIndex === index || segment.isHighlighted;
        const textColor = segment.category
          ? categoryTextColors[segment.category]
          : 'text-gray-800';
        const bgColor = segment.category
          ? categoryBgColors[segment.category]
          : 'bg-transparent';

        return (
          <motion.span
            key={index}
            initial={animated ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSegmentClick?.(index)}
            className={cn(
              'font-bold transition-all duration-200',
              textColor,
              onSegmentClick && 'cursor-pointer hover:scale-110',
              isHighlighted && [bgColor, 'px-1 rounded', 'scale-110']
            )}
          >
            {isHighlighted && animated ? (
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {segment.text}
              </motion.span>
            ) : (
              segment.text
            )}
          </motion.span>
        );
      })}
    </div>
  );
}

// Word with colored phonemes
export function ColoredWord({
  word,
  phonemeBreakdown,
  size = 'md',
  showUnderline = false,
  onPhonemeClick,
  className,
}: {
  word: string;
  phonemeBreakdown: Array<{
    letters: string;
    category: PhonemeCategory;
    phonemeId?: string;
  }>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUnderline?: boolean;
  onPhonemeClick?: (index: number, phonemeId?: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-baseline', className)}>
      {phonemeBreakdown.map((segment, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onPhonemeClick?.(index, segment.phonemeId)}
          className={cn(
            'font-bold transition-all relative',
            sizeStyles[size],
            categoryTextColors[segment.category],
            onPhonemeClick && 'cursor-pointer hover:scale-110'
          )}
        >
          {segment.letters}
          {showUnderline && (
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={cn(
                'absolute bottom-0 left-0 right-0 h-1 rounded-full origin-left',
                categoryBgColors[segment.category].replace('100', '400')
              )}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
}

// Sentence with highlighted words
export function ColoredSentence({
  words,
  highlightedWordIndex,
  onWordClick,
  className,
}: {
  words: Array<{
    text: string;
    phonemeBreakdown?: Array<{
      letters: string;
      category: PhonemeCategory;
    }>;
  }>;
  highlightedWordIndex?: number;
  onWordClick?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-3 gap-y-2', className)}>
      {words.map((word, index) => {
        const isHighlighted = highlightedWordIndex === index;

        // If word has phoneme breakdown, show colored
        if (word.phonemeBreakdown) {
          return (
            <motion.div
              key={index}
              animate={
                isHighlighted
                  ? { scale: 1.1, backgroundColor: 'rgba(147, 51, 234, 0.1)' }
                  : { scale: 1, backgroundColor: 'transparent' }
              }
              onClick={() => onWordClick?.(index)}
              className={cn(
                'px-1 py-0.5 rounded-lg cursor-pointer transition-all',
                isHighlighted && 'ring-2 ring-purple-400'
              )}
            >
              <ColoredWord
                word={word.text}
                phonemeBreakdown={word.phonemeBreakdown}
                size="md"
              />
            </motion.div>
          );
        }

        // Plain text (punctuation, etc.)
        return (
          <span key={index} className="text-2xl text-gray-600">
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
