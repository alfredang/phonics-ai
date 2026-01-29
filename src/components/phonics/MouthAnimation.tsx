'use client';

import { motion } from 'framer-motion';
import { MouthShape } from '@/types/phonics';
import { cn } from '@/lib/utils/cn';

interface MouthAnimationProps {
  mouthShape: MouthShape;
  isAnimating?: boolean;
  size?: number;
  className?: string;
}

// SVG path definitions for different mouth shapes
const mouthPaths: Record<MouthShape, { lips: string; tongue?: string; teeth?: boolean }> = {
  // Closed positions
  closed: {
    lips: 'M 20 50 Q 50 45 80 50 Q 50 55 20 50',
  },
  closed_smile: {
    lips: 'M 15 55 Q 50 40 85 55 Q 50 60 15 55',
  },
  closed_rounded: {
    lips: 'M 35 45 Q 50 40 65 45 Q 65 60 50 65 Q 35 60 35 45',
  },

  // Open positions
  open_small: {
    lips: 'M 25 45 Q 50 35 75 45 L 75 55 Q 50 70 25 55 Z',
    teeth: true,
  },
  open_medium: {
    lips: 'M 20 40 Q 50 25 80 40 L 80 60 Q 50 80 20 60 Z',
    teeth: true,
    tongue: 'M 30 65 Q 50 55 70 65 Q 50 75 30 65',
  },
  open_wide: {
    lips: 'M 15 35 Q 50 15 85 35 L 85 65 Q 50 90 15 65 Z',
    teeth: true,
    tongue: 'M 25 70 Q 50 55 75 70 Q 50 85 25 70',
  },

  // Rounded positions
  rounded_small: {
    lips: 'M 35 40 Q 50 30 65 40 Q 70 50 65 60 Q 50 70 35 60 Q 30 50 35 40',
    teeth: true,
  },
  rounded_medium: {
    lips: 'M 30 35 Q 50 20 70 35 Q 80 50 70 65 Q 50 80 30 65 Q 20 50 30 35',
    teeth: true,
    tongue: 'M 35 60 Q 50 50 65 60 Q 50 70 35 60',
  },
  rounded_open: {
    lips: 'M 25 30 Q 50 10 75 30 Q 90 50 75 70 Q 50 90 25 70 Q 10 50 25 30',
    teeth: true,
    tongue: 'M 30 65 Q 50 50 70 65 Q 50 80 30 65',
  },

  // Tongue positions
  tongue_tip_up: {
    lips: 'M 20 40 Q 50 25 80 40 L 80 60 Q 50 80 20 60 Z',
    teeth: true,
    tongue: 'M 40 60 L 50 35 L 60 60 Q 50 70 40 60',
  },
  tongue_back: {
    lips: 'M 20 40 Q 50 25 80 40 L 80 60 Q 50 80 20 60 Z',
    teeth: true,
    tongue: 'M 25 55 Q 35 40 50 50 Q 65 60 75 55 Q 50 75 25 55',
  },

  // Special positions
  th_position: {
    lips: 'M 20 45 Q 50 35 80 45 L 80 55 Q 50 70 20 55 Z',
    teeth: true,
    tongue: 'M 40 47 Q 50 42 60 47 L 55 52 Q 50 54 45 52 Z',
  },
  l_position: {
    lips: 'M 20 42 Q 50 30 80 42 L 80 58 Q 50 75 20 58 Z',
    teeth: true,
    tongue: 'M 45 42 L 50 35 L 55 42 Q 55 60 50 70 Q 45 60 45 42',
  },
  r_position: {
    lips: 'M 25 40 Q 50 25 75 40 L 75 60 Q 50 78 25 60 Z',
    teeth: true,
    tongue: 'M 35 55 Q 40 45 50 50 Q 60 45 65 55 Q 50 65 35 55',
  },

  // Additional shapes for phoneme data compatibility
  lips_together: {
    lips: 'M 20 50 Q 50 48 80 50 Q 50 52 20 50',
  },
  lips_rounded: {
    lips: 'M 35 45 Q 50 40 65 45 Q 70 50 65 55 Q 50 60 35 55 Q 30 50 35 45',
  },
  tongue_ridge: {
    lips: 'M 20 40 Q 50 25 80 40 L 80 60 Q 50 80 20 60 Z',
    teeth: true,
    tongue: 'M 35 50 L 50 38 L 65 50 Q 50 60 35 50',
  },
  tongue_teeth: {
    lips: 'M 20 45 Q 50 35 80 45 L 80 55 Q 50 70 20 55 Z',
    teeth: true,
    tongue: 'M 40 47 Q 50 42 60 47 L 55 52 Q 50 54 45 52 Z',
  },
  teeth_lip: {
    lips: 'M 20 45 Q 50 38 80 45 L 80 55 Q 50 62 20 55 Z',
    teeth: true,
  },
  fricative: {
    lips: 'M 25 45 Q 50 35 75 45 L 75 55 Q 50 65 25 55 Z',
    teeth: true,
  },
  neutral: {
    lips: 'M 20 50 Q 50 45 80 50 Q 50 55 20 50',
  },
};

export function MouthAnimation({
  mouthShape,
  isAnimating = false,
  size = 120,
  className,
}: MouthAnimationProps) {
  const paths = mouthPaths[mouthShape] || mouthPaths.closed;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible"
      >
        {/* Face background */}
        <defs>
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFDBB4" />
            <stop offset="100%" stopColor="#F5C99D" />
          </linearGradient>
          <linearGradient id="lipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E57373" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
          <linearGradient id="tongueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F48FB1" />
            <stop offset="100%" stopColor="#E91E63" />
          </linearGradient>
        </defs>

        {/* Face circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#faceGradient)"
          stroke="#DEB887"
          strokeWidth="2"
        />

        {/* Mouth opening (black) */}
        {paths.teeth && (
          <motion.path
            d={paths.lips}
            fill="#1a1a1a"
            initial={false}
            animate={isAnimating ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Teeth (if mouth is open) */}
        {paths.teeth && (
          <>
            {/* Top teeth */}
            <rect x="30" y="38" width="40" height="8" rx="2" fill="white" opacity="0.9" />
            {/* Bottom teeth */}
            <rect x="32" y="54" width="36" height="6" rx="2" fill="white" opacity="0.8" />
          </>
        )}

        {/* Tongue */}
        {paths.tongue && (
          <motion.path
            d={paths.tongue}
            fill="url(#tongueGradient)"
            initial={false}
            animate={
              isAnimating
                ? { y: [0, -2, 0], scale: [1, 1.05, 1] }
                : { y: 0, scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Lips */}
        <motion.path
          d={paths.lips}
          fill="none"
          stroke="url(#lipGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={
            isAnimating
              ? { scale: [1, 1.03, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '50px 50px' }}
        />
      </svg>

      {/* Animation pulse effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-purple-400"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// Mouth shape guide component
export function MouthShapeGuide({
  shapes,
  currentShape,
  onSelect,
}: {
  shapes: MouthShape[];
  currentShape: MouthShape;
  onSelect?: (shape: MouthShape) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {shapes.map((shape) => (
        <motion.button
          key={shape}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect?.(shape)}
          className={cn(
            'p-2 rounded-xl transition-colors',
            currentShape === shape
              ? 'bg-purple-100 ring-2 ring-purple-500'
              : 'bg-gray-50 hover:bg-gray-100'
          )}
        >
          <MouthAnimation mouthShape={shape} size={60} />
          <p className="text-xs text-gray-600 mt-1 text-center">
            {shape.replace(/_/g, ' ')}
          </p>
        </motion.button>
      ))}
    </div>
  );
}
