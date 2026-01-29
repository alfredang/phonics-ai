'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Mic, RefreshCw } from 'lucide-react';
import { PronunciationScore } from '@/lib/audio/speechRecognition';
import { cn } from '@/lib/utils/cn';

interface SpeechFeedbackProps {
  score: PronunciationScore | null;
  expected?: string;
  actual?: string;
  showDetails?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function SpeechFeedback({
  score,
  expected,
  actual,
  showDetails = true,
  onRetry,
  className,
}: SpeechFeedbackProps) {
  if (!score) return null;

  const isExcellent = score.overall >= 90;
  const isGood = score.overall >= 70;
  const isOkay = score.overall >= 50;

  const getFeedbackEmoji = () => {
    if (isExcellent) return '🌟';
    if (isGood) return '👍';
    if (isOkay) return '💪';
    return '🔄';
  };

  const getFeedbackMessage = () => {
    if (isExcellent) return 'Perfect pronunciation!';
    if (isGood) return 'Great job! Almost there!';
    if (isOkay) return 'Good try! Keep practicing!';
    return "Let's try again!";
  };

  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-600 bg-green-100';
    if (value >= 70) return 'text-yellow-600 bg-yellow-100';
    if (value >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn('rounded-2xl overflow-hidden bg-white shadow-lg', className)}
    >
      {/* Header with main score */}
      <div
        className={cn(
          'p-6 text-center',
          isExcellent
            ? 'bg-gradient-to-br from-green-400 to-emerald-500'
            : isGood
            ? 'bg-gradient-to-br from-yellow-400 to-orange-400'
            : isOkay
            ? 'bg-gradient-to-br from-orange-400 to-red-400'
            : 'bg-gradient-to-br from-gray-400 to-gray-500'
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="text-6xl mb-2"
        >
          {getFeedbackEmoji()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white"
        >
          <div className="text-4xl font-bold mb-1">{score.overall}%</div>
          <div className="text-lg font-medium opacity-90">{getFeedbackMessage()}</div>
        </motion.div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="p-6 space-y-4">
          {/* What you said vs expected */}
          {expected && actual && (
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-20 text-sm text-gray-500 flex-shrink-0">Expected:</div>
                <div className="font-medium text-gray-800">{expected}</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-20 text-sm text-gray-500 flex-shrink-0">You said:</div>
                <div
                  className={cn(
                    'font-medium',
                    isGood ? 'text-green-600' : 'text-orange-600'
                  )}
                >
                  {actual || '(No speech detected)'}
                </div>
              </div>
            </div>
          )}

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <ScoreItem label="Accuracy" value={score.accuracy} />
            <ScoreItem label="Completeness" value={score.completeness} />
            <ScoreItem label="Similarity" value={score.similarity} />
          </div>

          {/* Retry button */}
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-purple-100 text-purple-600 rounded-xl font-semibold hover:bg-purple-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  const getColor = () => {
    if (value >= 90) return 'bg-green-100 text-green-600';
    if (value >= 70) return 'bg-yellow-100 text-yellow-600';
    if (value >= 50) return 'bg-orange-100 text-orange-600';
    return 'bg-red-100 text-red-600';
  };

  return (
    <div className={cn('rounded-xl p-3 text-center', getColor())}>
      <div className="text-2xl font-bold">{value}%</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}

// Listening indicator component
export function ListeningIndicator({
  isListening,
  transcript,
  className,
}: {
  isListening: boolean;
  transcript?: string;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'flex flex-col items-center gap-3 p-6 rounded-2xl bg-purple-50 border-2 border-purple-200',
            className
          )}
        >
          {/* Animated mic icon */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="relative w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center">
            <p className="font-semibold text-purple-700">Listening...</p>
            {transcript && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-purple-600 mt-1"
              >
                &quot;{transcript}&quot;
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simple pass/fail indicator
export function PronunciationResult({
  isCorrect,
  message,
  className,
}: {
  isCorrect: boolean;
  message?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl',
        isCorrect ? 'bg-green-100' : 'bg-red-100',
        className
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        )}
      >
        {isCorrect ? (
          <Check className="w-6 h-6 text-white" />
        ) : (
          <X className="w-6 h-6 text-white" />
        )}
      </div>
      <div>
        <p
          className={cn(
            'font-semibold',
            isCorrect ? 'text-green-700' : 'text-red-700'
          )}
        >
          {isCorrect ? 'Correct!' : 'Try again!'}
        </p>
        {message && (
          <p
            className={cn(
              'text-sm',
              isCorrect ? 'text-green-600' : 'text-red-600'
            )}
          >
            {message}
          </p>
        )}
      </div>
    </motion.div>
  );
}
