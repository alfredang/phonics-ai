'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface IPADisplayProps {
  ipa: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onSpeak?: () => void;
  className?: string;
}

const sizeStyles = {
  sm: 'text-sm px-2 py-0.5',
  md: 'text-base px-3 py-1',
  lg: 'text-lg px-4 py-1.5',
};

export function IPADisplay({
  ipa,
  description,
  size = 'md',
  showTooltip = true,
  onSpeak,
  className,
}: IPADisplayProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative inline-block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn(
          'inline-flex items-center gap-2 font-mono rounded-lg',
          'bg-gray-100 text-gray-700 border border-gray-200',
          sizeStyles[size],
          className
        )}
        onMouseEnter={() => showTooltip && setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <span>{ipa}</span>

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-1">
          {description && showTooltip && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              className="p-0.5 rounded hover:bg-gray-200 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}

          {onSpeak && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onSpeak();
              }}
              className="p-0.5 rounded hover:bg-gray-200 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-gray-400" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showInfo && description && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg max-w-xs whitespace-normal"
          >
            {description}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// IPA Chart component for reference
export function IPAChart({ className }: { className?: string }) {
  const vowels = [
    { symbol: '/æ/', example: 'cat', label: 'Short a' },
    { symbol: '/ɛ/', example: 'bed', label: 'Short e' },
    { symbol: '/ɪ/', example: 'sit', label: 'Short i' },
    { symbol: '/ɒ/', example: 'hot', label: 'Short o' },
    { symbol: '/ʌ/', example: 'cup', label: 'Short u' },
    { symbol: '/eɪ/', example: 'cake', label: 'Long a' },
    { symbol: '/iː/', example: 'bee', label: 'Long e' },
    { symbol: '/aɪ/', example: 'bike', label: 'Long i' },
    { symbol: '/oʊ/', example: 'boat', label: 'Long o' },
    { symbol: '/juː/', example: 'cute', label: 'Long u' },
  ];

  const consonants = [
    { symbol: '/b/', example: 'bat' },
    { symbol: '/d/', example: 'dog' },
    { symbol: '/f/', example: 'fan' },
    { symbol: '/g/', example: 'go' },
    { symbol: '/h/', example: 'hat' },
    { symbol: '/k/', example: 'cat' },
    { symbol: '/l/', example: 'leg' },
    { symbol: '/m/', example: 'man' },
    { symbol: '/n/', example: 'net' },
    { symbol: '/p/', example: 'pet' },
    { symbol: '/r/', example: 'red' },
    { symbol: '/s/', example: 'sun' },
    { symbol: '/t/', example: 'top' },
    { symbol: '/v/', example: 'van' },
    { symbol: '/w/', example: 'wet' },
    { symbol: '/z/', example: 'zip' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Vowels */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-3">Vowel Sounds</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {vowels.map((v) => (
            <div
              key={v.symbol}
              className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-center"
            >
              <span className="text-xl font-mono text-teal-700">{v.symbol}</span>
              <p className="text-sm text-gray-600 mt-1">{v.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consonants */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-3">Consonant Sounds</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {consonants.map((c) => (
            <div
              key={c.symbol}
              className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-center"
            >
              <span className="text-lg font-mono text-blue-700">{c.symbol}</span>
              <p className="text-xs text-gray-500 mt-0.5">{c.example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
