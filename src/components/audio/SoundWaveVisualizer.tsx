'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SoundWaveVisualizerProps {
  isActive: boolean;
  volume?: number;
  variant?: 'bars' | 'wave' | 'circle' | 'simple';
  color?: string;
  barCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SoundWaveVisualizer({
  isActive,
  volume = 0,
  variant = 'bars',
  color = 'purple',
  barCount = 5,
  size = 'md',
  className,
}: SoundWaveVisualizerProps) {
  const colorClass = `bg-${color}-500`;

  const sizeStyles = {
    sm: { container: 'h-8 gap-0.5', bar: 'w-1' },
    md: { container: 'h-12 gap-1', bar: 'w-1.5' },
    lg: { container: 'h-16 gap-1.5', bar: 'w-2' },
  };

  const styles = sizeStyles[size];

  if (variant === 'simple') {
    return (
      <SimpleWave
        isActive={isActive}
        color={color}
        size={size}
        className={className}
      />
    );
  }

  if (variant === 'circle') {
    return (
      <CircleWave
        isActive={isActive}
        volume={volume}
        color={color}
        size={size}
        className={className}
      />
    );
  }

  // Bars variant
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        styles.container,
        className
      )}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const delay = i * 0.1;
        const baseHeight = 20 + Math.random() * 30;

        return (
          <motion.div
            key={i}
            className={cn('rounded-full', styles.bar, colorClass)}
            initial={{ height: '20%' }}
            animate={
              isActive
                ? {
                    height: ['20%', `${baseHeight + volume * 50}%`, '20%'],
                    opacity: [0.5, 1, 0.5],
                  }
                : { height: '20%', opacity: 0.3 }
            }
            transition={
              isActive
                ? {
                    duration: 0.5 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  }
                : { duration: 0.2 }
            }
          />
        );
      })}
    </div>
  );
}

// Simple animated wave
function SimpleWave({
  isActive,
  color,
  size,
  className,
}: {
  isActive: boolean;
  color: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const heights = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const bars = 3;
  const height = heights[size];

  return (
    <div
      className={cn('flex items-center justify-center gap-1', className)}
      style={{ height }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('w-1 rounded-full', `bg-${color}-500`)}
          animate={
            isActive
              ? {
                  height: [height * 0.3, height * 0.8, height * 0.3],
                }
              : { height: height * 0.3 }
          }
          transition={
            isActive
              ? {
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

// Circle pulsing wave
function CircleWave({
  isActive,
  volume,
  color,
  size,
  className,
}: {
  isActive: boolean;
  volume: number;
  color: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const baseSize = sizes[size];

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: baseSize * 1.5, height: baseSize * 1.5 }}
    >
      {/* Outer pulse rings */}
      {isActive && (
        <>
          <motion.div
            className={cn(
              'absolute rounded-full border-2',
              `border-${color}-400`
            )}
            initial={{ width: baseSize, height: baseSize, opacity: 0.5 }}
            animate={{
              width: baseSize * 1.5,
              height: baseSize * 1.5,
              opacity: 0,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className={cn(
              'absolute rounded-full border-2',
              `border-${color}-400`
            )}
            initial={{ width: baseSize, height: baseSize, opacity: 0.5 }}
            animate={{
              width: baseSize * 1.5,
              height: baseSize * 1.5,
              opacity: 0,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Center circle */}
      <motion.div
        className={cn('rounded-full', `bg-${color}-500`)}
        animate={
          isActive
            ? {
                width: baseSize * (0.8 + volume * 0.4),
                height: baseSize * (0.8 + volume * 0.4),
              }
            : { width: baseSize * 0.6, height: baseSize * 0.6 }
        }
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// Real-time audio visualizer using Web Audio API
export function LiveAudioVisualizer({
  analyser,
  isActive,
  color = 'purple',
  height = 80,
  className,
}: {
  analyser: AnalyserNode | null;
  isActive: boolean;
  color?: string;
  height?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isActive) return;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'transparent';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, `rgba(147, 51, 234, 0.8)`); // purple-600
        gradient.addColorStop(1, `rgba(236, 72, 153, 0.8)`); // pink-500

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={height}
      className={cn('rounded-lg', className)}
    />
  );
}
