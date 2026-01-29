'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, ChevronRight, Check, X, RefreshCw } from 'lucide-react';
import { Phoneme } from '@/types/phonics';
import { useLessonStore } from '@/stores/lessonStore';
import { useAudioStore } from '@/stores/audioStore';
import { PhonemeCard } from '@/components/phonics/PhonemeCard';
import { MouthAnimation } from '@/components/phonics/MouthAnimation';
import { RecordingButton } from '@/components/audio/RecordingButton';
import { SpeechFeedback, ListeningIndicator } from '@/components/audio/SpeechFeedback';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface PracticeExercise {
  id: string;
  type: 'repeat_after' | 'identify_sound' | 'match_pairs';
  phoneme: Phoneme;
  targetWord?: string;
  options?: Phoneme[];
  correctAnswer?: string;
}

interface PracticePhaseProps {
  exercises: PracticeExercise[];
  onComplete: () => void;
}

export function PracticePhase({ exercises, onComplete }: PracticePhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exerciseState, setExerciseState] = useState<'ready' | 'listening' | 'result'>('ready');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  const { updatePracticeProgress, recordPhonemeAttempt, completePhase } = useLessonStore();
  const {
    speakWord,
    speakPhoneme,
    isListening,
    transcript,
    lastPronunciationScore,
    listenAndEvaluate,
    stopListening,
    clearRecognition,
  } = useAudioStore();

  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex === exercises.length - 1;

  const handleRepeatAfter = () => {
    const targetWord = currentExercise.targetWord || currentExercise.phoneme.examples[0];

    setExerciseState('listening');
    clearRecognition();

    listenAndEvaluate(targetWord, (score) => {
      const correct = score.overall >= 70;
      setIsCorrect(correct);
      setExerciseState('result');
      setAttempts((prev) => prev + 1);

      updatePracticeProgress(correct, score.overall);
      recordPhonemeAttempt(currentExercise.phoneme.id, correct, score.overall);
    });
  };

  const handleIdentifySound = (selected: Phoneme) => {
    const correct = selected.id === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setExerciseState('result');
    setAttempts((prev) => prev + 1);

    const score = correct ? 100 : 0;
    updatePracticeProgress(correct, score);
    recordPhonemeAttempt(currentExercise.phoneme.id, correct, score);
  };

  const handleNext = () => {
    if (isLastExercise) {
      completePhase();
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setExerciseState('ready');
      setIsCorrect(null);
      setAttempts(0);
      clearRecognition();
    }
  };

  const handleRetry = () => {
    setExerciseState('ready');
    setIsCorrect(null);
    clearRecognition();
  };

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'repeat_after':
        return (
          <RepeatAfterExercise
            phoneme={currentExercise.phoneme}
            targetWord={currentExercise.targetWord}
            state={exerciseState}
            isCorrect={isCorrect}
            transcript={transcript}
            score={lastPronunciationScore}
            isListening={isListening}
            onStart={handleRepeatAfter}
            onRetry={handleRetry}
          />
        );

      case 'identify_sound':
        return (
          <IdentifySoundExercise
            phoneme={currentExercise.phoneme}
            options={currentExercise.options || []}
            isCorrect={isCorrect}
            onSelect={handleIdentifySound}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {exercises.map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-3 h-3 rounded-full transition-all',
              index === currentIndex
                ? 'w-8 bg-purple-500'
                : index < currentIndex
                ? 'bg-green-500'
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Exercise */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          {renderExercise()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {exerciseState === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-8"
        >
          <Button
            variant={isCorrect ? 'success' : 'primary'}
            size="lg"
            onClick={handleNext}
            rightIcon={<ChevronRight className="w-5 h-5" />}
          >
            {isLastExercise ? 'Continue to Games' : 'Next Exercise'}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Repeat After Exercise
function RepeatAfterExercise({
  phoneme,
  targetWord,
  state,
  isCorrect,
  transcript,
  score,
  isListening,
  onStart,
  onRetry,
}: {
  phoneme: Phoneme;
  targetWord?: string;
  state: 'ready' | 'listening' | 'result';
  isCorrect: boolean | null;
  transcript: string;
  score: ReturnType<typeof useAudioStore.getState>['lastPronunciationScore'];
  isListening: boolean;
  onStart: () => void;
  onRetry: () => void;
}) {
  const { speakWord, speakPhoneme } = useAudioStore();
  const word = targetWord || phoneme.examples[0];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Say This Sound</h2>
        <p className="text-white/80">Listen, then repeat after me</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Word to say */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => speakWord(word)}
            className="inline-flex items-center gap-3 px-6 py-4 bg-purple-100 rounded-2xl hover:bg-purple-200 transition-colors"
          >
            <Volume2 className="w-6 h-6 text-purple-600" />
            <span className="text-4xl font-bold text-purple-700">{word}</span>
          </motion.button>
        </div>

        {/* Mouth animation */}
        <div className="flex justify-center">
          <MouthAnimation
            mouthShape={phoneme.mouthShape || 'closed'}
            isAnimating={state === 'listening'}
            size={100}
          />
        </div>

        {/* State-specific content */}
        {state === 'ready' && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Tap the word to listen, then press the microphone to say it
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onStart}
              leftIcon={<Mic className="w-6 h-6" />}
            >
              Start Speaking
            </Button>
          </div>
        )}

        {state === 'listening' && (
          <ListeningIndicator isListening={isListening} transcript={transcript} />
        )}

        {state === 'result' && score && (
          <SpeechFeedback
            score={score}
            expected={word}
            actual={transcript}
            onRetry={onRetry}
          />
        )}
      </div>
    </div>
  );
}

// Identify Sound Exercise
function IdentifySoundExercise({
  phoneme,
  options,
  isCorrect,
  onSelect,
}: {
  phoneme: Phoneme;
  options: Phoneme[];
  isCorrect: boolean | null;
  onSelect: (phoneme: Phoneme) => void;
}) {
  const { speakPhoneme } = useAudioStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: Phoneme) => {
    if (isCorrect !== null) return; // Already answered
    setSelectedId(option.id);
    onSelect(option);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Identify the Sound</h2>
        <p className="text-white/80">Listen and pick the matching sound</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Play sound button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => speakPhoneme(phoneme.symbol)}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <Volume2 className="w-10 h-10" />
          </motion.button>
        </div>

        <p className="text-center text-gray-600">
          Tap to hear the sound, then select the correct letter
        </p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            const isCorrectOption = isCorrect !== null && option.id === phoneme.id;
            const isWrong = isSelected && isCorrect === false;

            return (
              <motion.button
                key={option.id}
                whileHover={isCorrect === null ? { scale: 1.05 } : undefined}
                whileTap={isCorrect === null ? { scale: 0.95 } : undefined}
                onClick={() => handleSelect(option)}
                disabled={isCorrect !== null}
                className={cn(
                  'p-6 rounded-2xl border-4 transition-all text-center',
                  isCorrect === null
                    ? 'border-gray-200 hover:border-purple-300 bg-white'
                    : isCorrectOption
                    ? 'border-green-500 bg-green-50'
                    : isWrong
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                )}
              >
                <span className="text-4xl font-bold">{option.symbol}</span>
                <span className="block text-sm text-gray-500 mt-1">{option.ipa}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Result feedback */}
        {isCorrect !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'flex items-center justify-center gap-3 p-4 rounded-xl',
              isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            {isCorrect ? (
              <>
                <Check className="w-6 h-6" />
                <span className="font-semibold">Correct!</span>
              </>
            ) : (
              <>
                <X className="w-6 h-6" />
                <span className="font-semibold">
                  The answer was &quot;{phoneme.symbol}&quot;
                </span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
