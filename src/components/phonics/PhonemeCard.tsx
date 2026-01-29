'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Volume2, Info } from 'lucide-react';
import { Phoneme } from '@/types/phonics';
import { cn } from '@/lib/utils/cn';

interface PhonemeCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  phoneme: Phoneme;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIPA?: boolean;
  showDescription?: boolean;
  showExamples?: boolean;
  interactive?: boolean;
  isActive?: boolean;
  isCorrect?: boolean | null;
  onSpeak?: () => void;
  onInfoClick?: () => void;
}

const sizeStyles = {
  sm: {
    card: 'w-16 h-16',
    symbol: 'text-xl',
    ipa: 'text-[10px]',
    iconSize: 'w-3 h-3',
  },
  md: {
    card: 'w-24 h-24',
    symbol: 'text-3xl',
    ipa: 'text-xs',
    iconSize: 'w-4 h-4',
  },
  lg: {
    card: 'w-32 h-32',
    symbol: 'text-4xl',
    ipa: 'text-sm',
    iconSize: 'w-5 h-5',
  },
  xl: {
    card: 'w-40 h-40',
    symbol: 'text-5xl',
    ipa: 'text-base',
    iconSize: 'w-6 h-6',
  },
};

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  short_vowel: {
    bg: 'bg-gradient-to-br from-red-100 to-red-200',
    border: 'border-red-300',
    text: 'text-red-700',
  },
  long_vowel: {
    bg: 'bg-gradient-to-br from-teal-100 to-teal-200',
    border: 'border-teal-300',
    text: 'text-teal-700',
  },
  consonant: {
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    border: 'border-blue-300',
    text: 'text-blue-700',
  },
  digraph: {
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200',
    border: 'border-purple-300',
    text: 'text-purple-700',
  },
  blend: {
    bg: 'bg-gradient-to-br from-orange-100 to-orange-200',
    border: 'border-orange-300',
    text: 'text-orange-700',
  },
  r_controlled: {
    bg: 'bg-gradient-to-br from-green-100 to-green-200',
    border: 'border-green-300',
    text: 'text-green-700',
  },
  diphthong: {
    bg: 'bg-gradient-to-br from-pink-100 to-pink-200',
    border: 'border-pink-300',
    text: 'text-pink-700',
  },
};

export const PhonemeCard = forwardRef<HTMLDivElement, PhonemeCardProps>(
  (
    {
      phoneme,
      size = 'md',
      showIPA = true,
      showDescription = false,
      showExamples = false,
      interactive = true,
      isActive = false,
      isCorrect = null,
      onSpeak,
      onInfoClick,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const colors = categoryColors[phoneme.category] || categoryColors.consonant;

    // Determine border color based on state
    const getBorderColor = () => {
      if (isCorrect === true) return 'border-green-500 border-4';
      if (isCorrect === false) return 'border-red-500 border-4';
      if (isActive) return 'border-purple-500 border-4';
      return `border-2 ${colors.border}`;
    };

    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { scale: 1.05, y: -4 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        className={cn(
          'relative rounded-2xl overflow-hidden cursor-pointer transition-shadow',
          colors.bg,
          getBorderColor(),
          interactive && 'hover:shadow-xl',
          isActive && 'shadow-lg shadow-purple-500/25',
          isCorrect === true && 'shadow-lg shadow-green-500/25',
          isCorrect === false && 'shadow-lg shadow-red-500/25 animate-shake',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {/* Main card content */}
        <div className={cn('flex flex-col items-center justify-center p-3', styles.card)}>
          {/* Symbol */}
          <motion.span
            initial={false}
            animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn('font-bold', styles.symbol, colors.text)}
          >
            {phoneme.symbol}
          </motion.span>

          {/* IPA */}
          {showIPA && (
            <span className={cn('text-gray-500 font-mono mt-1', styles.ipa)}>
              {phoneme.ipa}
            </span>
          )}
        </div>

        {/* Action buttons */}
        {interactive && (size === 'lg' || size === 'xl') && (
          <div className="absolute top-2 right-2 flex gap-1">
            {onSpeak && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak();
                }}
                className={cn(
                  'p-1.5 rounded-lg bg-white/80 backdrop-blur',
                  colors.text,
                  'hover:bg-white'
                )}
              >
                <Volume2 className={styles.iconSize} />
              </motion.button>
            )}
            {onInfoClick && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick();
                }}
                className={cn(
                  'p-1.5 rounded-lg bg-white/80 backdrop-blur',
                  colors.text,
                  'hover:bg-white'
                )}
              >
                <Info className={styles.iconSize} />
              </motion.button>
            )}
          </div>
        )}

        {/* Correct/Incorrect feedback overlay */}
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
            )}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-4xl"
            >
              {isCorrect ? '✓' : '✗'}
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

PhonemeCard.displayName = 'PhonemeCard';

// Extended card with description and examples
export function PhonemeCardExtended({
  phoneme,
  onSpeak,
  className,
}: {
  phoneme: Phoneme;
  onSpeak?: () => void;
  className?: string;
}) {
  const colors = categoryColors[phoneme.category] || categoryColors.consonant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-3xl overflow-hidden',
        colors.bg,
        `border-2 ${colors.border}`,
        className
      )}
    >
      {/* Header */}
      <div className="p-6 text-center">
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn('text-6xl font-bold block mb-2', colors.text)}
        >
          {phoneme.symbol}
        </motion.span>
        <span className="text-xl font-mono text-gray-600">{phoneme.ipa}</span>

        {/* Speak button */}
        {onSpeak && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSpeak}
            className={cn(
              'mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl',
              'bg-white/80 backdrop-blur hover:bg-white',
              colors.text,
              'font-semibold transition-all'
            )}
          >
            <Volume2 className="w-5 h-5" />
            Listen
          </motion.button>
        )}
      </div>

      {/* Description */}
      <div className="px-6 pb-4">
        <p className="text-gray-700 text-center">{phoneme.description}</p>
      </div>

      {/* Tips */}
      {phoneme.tips && phoneme.tips.length > 0 && (
        <div className="px-6 pb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Tips:</h4>
          <ul className="space-y-1">
            {phoneme.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples */}
      {phoneme.examples && phoneme.examples.length > 0 && (
        <div className="px-6 pb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Example Words:</h4>
          <div className="flex flex-wrap gap-2">
            {phoneme.examples.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1.5 bg-white/60 rounded-lg text-sm font-medium text-gray-700"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
