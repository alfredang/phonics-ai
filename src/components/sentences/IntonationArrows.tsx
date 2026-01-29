'use client';

import { motion } from 'framer-motion';
import { IntonationPoint } from '@/types/phonics';
import { cn } from '@/lib/utils/cn';

interface IntonationArrowsProps {
  intonationPattern: IntonationPoint[];
  wordCount: number;
  activeWordIndex?: number;
  showLabels?: boolean;
  className?: string;
}

/**
 * Visual intonation markers showing rising/falling pitch patterns
 */
export function IntonationArrows({
  intonationPattern,
  wordCount,
  activeWordIndex,
  showLabels = false,
  className,
}: IntonationArrowsProps) {
  return (
    <div className={cn('flex items-end gap-1', className)}>
      {Array.from({ length: wordCount }).map((_, index) => {
        const intonation = intonationPattern.find((p) => p.wordIndex === index);
        const isActive = activeWordIndex === index;

        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center"
          >
            {intonation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="mb-1"
              >
                <IntonationMarker
                  direction={intonation.direction}
                  intensity={intonation.intensity}
                  isActive={isActive}
                />
                {showLabels && (
                  <span className="text-[10px] text-gray-400 mt-0.5 block text-center">
                    {intonation.direction === 'rising'
                      ? 'up'
                      : intonation.direction === 'falling'
                      ? 'down'
                      : 'hold'}
                  </span>
                )}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface IntonationMarkerProps {
  direction: 'rising' | 'falling' | 'sustained';
  intensity: 'slight' | 'moderate' | 'strong';
  isActive?: boolean;
}

function IntonationMarker({ direction, intensity, isActive }: IntonationMarkerProps) {
  const getSize = () => {
    switch (intensity) {
      case 'strong':
        return 'w-6 h-6';
      case 'moderate':
        return 'w-5 h-5';
      case 'slight':
        return 'w-4 h-4';
    }
  };

  const getColor = () => {
    if (isActive) {
      return direction === 'rising'
        ? 'text-green-500'
        : direction === 'falling'
        ? 'text-red-500'
        : 'text-blue-500';
    }
    return direction === 'rising'
      ? 'text-green-400'
      : direction === 'falling'
      ? 'text-red-400'
      : 'text-blue-400';
  };

  const getArrow = () => {
    switch (direction) {
      case 'rising':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={cn(getSize(), getColor())}>
            <path d="M7 14l5-5 5 5H7z" />
            <path d="M12 9v10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'falling':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={cn(getSize(), getColor())}>
            <path d="M7 10l5 5 5-5H7z" />
            <path d="M12 5v10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'sustained':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={cn(getSize(), getColor())}>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {getArrow()}
    </motion.div>
  );
}

/**
 * Inline intonation display within text
 */
interface InlineIntonationProps {
  direction: 'rising' | 'falling' | 'sustained';
  className?: string;
}

export function InlineIntonation({ direction, className }: InlineIntonationProps) {
  const getEmoji = () => {
    switch (direction) {
      case 'rising':
        return '↗️';
      case 'falling':
        return '↘️';
      case 'sustained':
        return '➡️';
    }
  };

  return (
    <span className={cn('inline-block mx-0.5', className)} title={`${direction} intonation`}>
      {getEmoji()}
    </span>
  );
}

/**
 * Legend explaining intonation markers
 */
export function IntonationLegend({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-4 text-sm', className)}>
      <div className="flex items-center gap-1">
        <span className="text-green-500">↗️</span>
        <span className="text-gray-600">Rising (questions)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-red-500">↘️</span>
        <span className="text-gray-600">Falling (statements)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-blue-500">➡️</span>
        <span className="text-gray-600">Sustained (lists)</span>
      </div>
    </div>
  );
}
