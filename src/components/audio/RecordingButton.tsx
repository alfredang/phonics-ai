'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';
import { cn } from '@/lib/utils/cn';

interface RecordingButtonProps {
  onRecordingComplete?: (result: { blob: Blob; url: string; duration: number }) => void;
  maxDuration?: number;
  size?: 'sm' | 'md' | 'lg';
  showTimer?: boolean;
  showWave?: boolean;
  className?: string;
}

export function RecordingButton({
  onRecordingComplete,
  maxDuration = 10000,
  size = 'md',
  showTimer = true,
  showWave = true,
  className,
}: RecordingButtonProps) {
  const {
    isRecording,
    recordingDuration,
    recordingVolume,
    recordingSupported,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioStore();

  const [isStarting, setIsStarting] = useState(false);

  const buttonSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = async () => {
    if (isRecording) {
      const result = await stopRecording();
      if (result) {
        onRecordingComplete?.(result);
      }
    } else {
      setIsStarting(true);
      try {
        await startRecording(maxDuration);
        const result = await stopRecording();
        if (result) {
          onRecordingComplete?.(result);
        }
      } catch (error) {
        console.error('Recording failed:', error);
      } finally {
        setIsStarting(false);
      }
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${seconds}.${tenths}s`;
  };

  if (!recordingSupported) {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div
          className={cn(
            'rounded-full bg-gray-100 flex items-center justify-center text-gray-400',
            buttonSizes[size]
          )}
        >
          <MicOff className={iconSizes[size]} />
        </div>
        <p className="text-xs text-gray-500">Recording not supported</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Recording button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        disabled={isStarting}
        className={cn(
          'relative rounded-full flex items-center justify-center transition-all',
          buttonSizes[size],
          isRecording
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30',
          isStarting && 'opacity-70 cursor-not-allowed'
        )}
      >
        {/* Pulse animation when recording */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}

        {/* Icon */}
        <span className="relative z-10">
          {isStarting ? (
            <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
          ) : isRecording ? (
            <Square className={iconSizes[size]} />
          ) : (
            <Mic className={iconSizes[size]} />
          )}
        </span>
      </motion.button>

      {/* Timer */}
      <AnimatePresence>
        {showTimer && isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-mono text-gray-600">
              {formatTime(recordingDuration)}
            </span>
            <span className="text-xs text-gray-400">
              / {formatTime(maxDuration)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wave visualizer */}
      <AnimatePresence>
        {showWave && isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <SoundWaveVisualizer
              isActive={isRecording}
              volume={recordingVolume}
              variant="bars"
              size={size}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel button */}
      <AnimatePresence>
        {isRecording && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelRecording}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Cancel
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact inline recording button
export function RecordingButtonInline({
  onRecordingComplete,
  maxDuration = 10000,
  className,
}: Omit<RecordingButtonProps, 'size' | 'showTimer' | 'showWave'>) {
  const {
    isRecording,
    recordingDuration,
    recordingSupported,
    startRecording,
    stopRecording,
  } = useAudioStore();

  const [isStarting, setIsStarting] = useState(false);

  const handleClick = async () => {
    if (isRecording) {
      const result = await stopRecording();
      if (result) {
        onRecordingComplete?.(result);
      }
    } else {
      setIsStarting(true);
      try {
        await startRecording(maxDuration);
        const result = await stopRecording();
        if (result) {
          onRecordingComplete?.(result);
        }
      } catch (error) {
        console.error('Recording failed:', error);
      } finally {
        setIsStarting(false);
      }
    }
  };

  if (!recordingSupported) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isStarting}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
        isRecording
          ? 'bg-red-100 text-red-600 border border-red-200'
          : 'bg-purple-100 text-purple-600 border border-purple-200 hover:bg-purple-200',
        className
      )}
    >
      {isStarting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isRecording ? (
        <>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{Math.floor(recordingDuration / 1000)}s</span>
          <Square className="w-4 h-4" />
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          <span>Record</span>
        </>
      )}
    </motion.button>
  );
}
