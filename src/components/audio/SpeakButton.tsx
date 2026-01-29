'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';
import { cn } from '@/lib/utils/cn';

interface SpeakButtonProps {
  text: string;
  type?: 'phoneme' | 'word' | 'sentence';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'pill';
  showWave?: boolean;
  className?: string;
}

export function SpeakButton({
  text,
  type = 'word',
  size = 'md',
  variant = 'icon',
  showWave = false,
  className,
}: SpeakButtonProps) {
  const { isSpeaking, currentText, ttsSupported, speak, speakPhoneme, speakWord, stopSpeaking } =
    useAudioStore();

  const isThisSpeaking = isSpeaking && currentText === text;

  const handleClick = async () => {
    if (isThisSpeaking) {
      stopSpeaking();
      return;
    }

    try {
      switch (type) {
        case 'phoneme':
          await speakPhoneme(text);
          break;
        case 'word':
          await speakWord(text);
          break;
        case 'sentence':
          await speak(text);
          break;
      }
    } catch (error) {
      console.error('Speech failed:', error);
    }
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  if (!ttsSupported) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-400',
          buttonSizes[size],
          className
        )}
      >
        <VolumeX className={iconSizes[size]} />
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-colors',
          buttonSizes[size],
          isThisSpeaking
            ? 'bg-purple-100 text-purple-600'
            : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600',
          className
        )}
      >
        {isThisSpeaking ? (
          showWave ? (
            <SoundWaveVisualizer isActive variant="simple" size="sm" />
          ) : (
            <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
          )
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
      </motion.button>
    );
  }

  if (variant === 'pill') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
          isThisSpeaking
            ? 'bg-purple-500 text-white'
            : 'bg-purple-100 text-purple-600 hover:bg-purple-200',
          className
        )}
      >
        {isThisSpeaking ? (
          <>
            <SoundWaveVisualizer isActive variant="simple" size="sm" color="white" />
            <span>Speaking...</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Listen</span>
          </>
        )}
      </motion.button>
    );
  }

  // Button variant
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
        isThisSpeaking
          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl',
        className
      )}
    >
      {isThisSpeaking ? (
        <>
          <SoundWaveVisualizer isActive variant="simple" size="sm" color="white" />
          <span>Speaking...</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5" />
          <span>Listen</span>
        </>
      )}
    </motion.button>
  );
}

// Auto-speak component that speaks when mounted
export function AutoSpeak({
  text,
  type = 'word',
  delay = 500,
  onComplete,
}: {
  text: string;
  type?: 'phoneme' | 'word' | 'sentence';
  delay?: number;
  onComplete?: () => void;
}) {
  const { speak, speakPhoneme, speakWord } = useAudioStore();

  // Auto-speak on mount
  useState(() => {
    const timer = setTimeout(async () => {
      try {
        switch (type) {
          case 'phoneme':
            await speakPhoneme(text);
            break;
          case 'word':
            await speakWord(text);
            break;
          case 'sentence':
            await speak(text);
            break;
        }
        onComplete?.();
      } catch (error) {
        console.error('Auto-speak failed:', error);
      }
    }, delay);

    return () => clearTimeout(timer);
  });

  return null;
}

// Import useState for AutoSpeak
import { useState } from 'react';
