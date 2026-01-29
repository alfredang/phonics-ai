'use client';

import { motion } from 'framer-motion';
import { Phoneme, PhonemeCategory } from '@/types/phonics';
import { PhonemeCard } from './PhonemeCard';
import { cn } from '@/lib/utils/cn';

interface PhonemeGridProps {
  phonemes: Phoneme[];
  selectedId?: string;
  onSelect?: (phoneme: Phoneme) => void;
  onSpeak?: (phoneme: Phoneme) => void;
  size?: 'sm' | 'md' | 'lg';
  columns?: 2 | 3 | 4 | 5 | 6;
  showCategories?: boolean;
  interactive?: boolean;
  className?: string;
}

const categoryLabels: Record<PhonemeCategory, string> = {
  short_vowel: 'Short Vowels',
  long_vowel: 'Long Vowels',
  consonant: 'Consonants',
  digraph: 'Digraphs',
  blend: 'Blends',
  r_controlled: 'R-Controlled',
  diphthong: 'Diphthongs',
};

const categoryColors: Record<PhonemeCategory, string> = {
  short_vowel: 'bg-red-500',
  long_vowel: 'bg-teal-500',
  consonant: 'bg-blue-500',
  digraph: 'bg-purple-500',
  blend: 'bg-orange-500',
  r_controlled: 'bg-green-500',
  diphthong: 'bg-pink-500',
};

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
  6: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6',
};

export function PhonemeGrid({
  phonemes,
  selectedId,
  onSelect,
  onSpeak,
  size = 'md',
  columns = 4,
  showCategories = false,
  interactive = true,
  className,
}: PhonemeGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  // Group phonemes by category if showing categories
  if (showCategories) {
    const grouped = phonemes.reduce(
      (acc, phoneme) => {
        const category = phoneme.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(phoneme);
        return acc;
      },
      {} as Record<PhonemeCategory, Phoneme[]>
    );

    return (
      <div className={cn('space-y-8', className)}>
        {Object.entries(grouped).map(([category, categoryPhonemes]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  categoryColors[category as PhonemeCategory]
                )}
              />
              <h3 className="font-bold text-lg text-gray-800">
                {categoryLabels[category as PhonemeCategory]}
              </h3>
              <span className="text-sm text-gray-500">
                ({categoryPhonemes.length})
              </span>
            </div>

            {/* Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={cn('grid gap-3', columnClasses[columns])}
            >
              {categoryPhonemes.map((phoneme) => (
                <motion.div key={phoneme.id} variants={item}>
                  <PhonemeCard
                    phoneme={phoneme}
                    size={size}
                    interactive={interactive}
                    isActive={selectedId === phoneme.id}
                    onClick={() => onSelect?.(phoneme)}
                    onSpeak={() => onSpeak?.(phoneme)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Simple grid without categories
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn('grid gap-3', columnClasses[columns], className)}
    >
      {phonemes.map((phoneme) => (
        <motion.div key={phoneme.id} variants={item}>
          <PhonemeCard
            phoneme={phoneme}
            size={size}
            interactive={interactive}
            isActive={selectedId === phoneme.id}
            onClick={() => onSelect?.(phoneme)}
            onSpeak={() => onSpeak?.(phoneme)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Category legend component
export function PhonemeCategoryLegend({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {Object.entries(categoryLabels).map(([category, label]) => (
        <div key={category} className="flex items-center gap-2">
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              categoryColors[category as PhonemeCategory]
            )}
          />
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  );
}
