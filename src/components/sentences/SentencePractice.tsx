'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { Sentence } from '@/types/phonics';
import { KaraokeText, SimpleSentenceDisplay } from './KaraokeText';
import { IntonationLegend } from './IntonationArrows';
import { speechSynthesis } from '@/lib/audio/speechSynthesis';
import { speechRecognition, PronunciationScore } from '@/lib/audio/speechRecognition';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface SentencePracticeProps {
  sentence: Sentence;
  onComplete?: (score: number) => void;
  onNext?: () => void;
  showIntonationGuide?: boolean;
  className?: string;
}

interface IntonationFeedback {
  overallScore: number;
  pronunciationScore: number;
  fluencyNote: string;
  intonationTip: string;
  encouragement: string;
}

/**
 * Sentence practice component with recording and AI feedback
 */
export function SentencePractice({
  sentence,
  onComplete,
  onNext,
  showIntonationGuide = true,
  className,
}: SentencePracticeProps) {
  const [phase, setPhase] = useState<'listen' | 'practice' | 'feedback'>('listen');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState<PronunciationScore | null>(null);
  const [feedback, setFeedback] = useState<IntonationFeedback | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [hasListened, setHasListened] = useState(false);

  const handleListenComplete = () => {
    setHasListened(true);
  };

  const startPractice = () => {
    setPhase('practice');
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setPronunciationScore(null);
    setFeedback(null);

    speechRecognition.start(
      async (result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          setIsRecording(false);
          await evaluatePronunciation(result.transcript);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
      }
    );
  };

  const stopRecording = () => {
    speechRecognition.stop();
    setIsRecording(false);
  };

  const evaluatePronunciation = async (spokenText: string) => {
    setIsLoadingFeedback(true);

    // Calculate pronunciation score
    const score = speechRecognition.evaluatePronunciation(sentence.text, spokenText);
    setPronunciationScore(score);

    // Generate intonation feedback
    const intonationFeedback = generateIntonationFeedback(sentence, spokenText, score);
    setFeedback(intonationFeedback);

    setIsLoadingFeedback(false);
    setPhase('feedback');

    onComplete?.(intonationFeedback.overallScore);
  };

  const retry = () => {
    setPhase('practice');
    setTranscript('');
    setPronunciationScore(null);
    setFeedback(null);
  };

  const handleNext = () => {
    setPhase('listen');
    setHasListened(false);
    setTranscript('');
    setPronunciationScore(null);
    setFeedback(null);
    onNext?.();
  };

  return (
    <div className={cn('space-y-6', className)}>
      <AnimatePresence mode="wait">
        {phase === 'listen' && (
          <motion.div
            key="listen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Listen & Learn
              </h3>
              <p className="text-gray-500">
                Listen to the sentence and notice the intonation pattern
              </p>
            </div>

            <KaraokeText
              sentence={sentence}
              onComplete={handleListenComplete}
              showIntonation={showIntonationGuide}
              showStress
            />

            {showIntonationGuide && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-medium text-purple-800 mb-2">Intonation Tips:</h4>
                <IntonationTip sentence={sentence} />
              </div>
            )}

            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={startPractice}
                disabled={!hasListened}
              >
                {hasListened ? 'Start Practice' : 'Listen First'}
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Your Turn!
              </h3>
              <p className="text-gray-500">
                Read the sentence with the correct intonation
              </p>
            </div>

            {/* Sentence to read */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <SimpleSentenceDisplay
                sentence={sentence}
                showIntonation={showIntonationGuide}
              />

              {/* Listen again button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => speechSynthesis.speak(sentence.text, { rate: 0.85 })}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen again
                </button>
              </div>
            </div>

            {/* Recording controls */}
            <div className="flex flex-col items-center gap-4">
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  'w-24 h-24 rounded-full flex items-center justify-center transition-all',
                  isRecording
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-purple-500 hover:bg-purple-600'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.button>

              <p className="text-sm text-gray-500">
                {isRecording ? 'Listening... tap to stop' : 'Tap to record'}
              </p>
            </div>

            {/* Transcript */}
            {(isRecording || transcript) && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">You said:</p>
                <p className="text-lg text-gray-700">{transcript || '...'}</p>
              </div>
            )}

            {isLoadingFeedback && (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing your pronunciation...
              </div>
            )}
          </motion.div>
        )}

        {phase === 'feedback' && feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score display */}
            <div
              className={cn(
                'text-center p-8 rounded-2xl',
                feedback.overallScore >= 80
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                  : feedback.overallScore >= 60
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-400'
                  : 'bg-gradient-to-br from-orange-400 to-red-400'
              )}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="text-6xl mb-2"
              >
                {feedback.overallScore >= 80 ? '🌟' : feedback.overallScore >= 60 ? '👍' : '💪'}
              </motion.div>
              <div className="text-white">
                <div className="text-5xl font-bold mb-1">{feedback.overallScore}%</div>
                <div className="text-lg opacity-90">{feedback.encouragement}</div>
              </div>
            </div>

            {/* Detailed feedback */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              {/* What you said */}
              <div>
                <p className="text-sm text-gray-500 mb-1">You said:</p>
                <p className="text-lg text-gray-700">{transcript}</p>
              </div>

              {/* Pronunciation score */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Pronunciation</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${feedback.pronunciationScore}%` }}
                      className={cn(
                        'h-full rounded-full',
                        feedback.pronunciationScore >= 80
                          ? 'bg-green-500'
                          : feedback.pronunciationScore >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      )}
                    />
                  </div>
                </div>
                <span className="font-bold text-gray-700">{feedback.pronunciationScore}%</span>
              </div>

              {/* Fluency note */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Fluency:</strong> {feedback.fluencyNote}
                </p>
              </div>

              {/* Intonation tip */}
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-purple-700">
                  <strong>Intonation tip:</strong> {feedback.intonationTip}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={retry}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </Button>
              {onNext && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  rightIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Next Sentence
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Generate intonation tips based on sentence type
 */
function IntonationTip({ sentence }: { sentence: Sentence }) {
  const tips: Record<string, string> = {
    statement:
      'Statements have a falling intonation at the end. Start at a comfortable pitch and let your voice go down on the last word.',
    question:
      sentence.text.toLowerCase().startsWith('wh') ||
      sentence.text.toLowerCase().startsWith('how')
        ? 'Wh-questions start slightly higher and fall at the end, like statements.'
        : 'Yes/No questions rise at the end. Let your voice go up on the last word, like you\'re asking for an answer.',
    exclamation:
      'Exclamations have strong emotion! Start high and let your voice fall dramatically at the end.',
    command:
      'Commands are firm but not harsh. Keep a steady tone and fall slightly at the end.',
  };

  return (
    <p className="text-sm text-purple-600">{tips[sentence.type] || tips.statement}</p>
  );
}

/**
 * Generate feedback based on pronunciation and sentence type
 */
function generateIntonationFeedback(
  sentence: Sentence,
  spokenText: string,
  score: PronunciationScore
): IntonationFeedback {
  const pronunciationScore = score.overall;

  // Calculate overall score (pronunciation + estimated fluency)
  const fluencyEstimate = Math.min(100, pronunciationScore + 10);
  const overallScore = Math.round((pronunciationScore + fluencyEstimate) / 2);

  // Generate fluency note
  let fluencyNote: string;
  if (pronunciationScore >= 80) {
    fluencyNote = 'Great pace and clarity! Your words flowed smoothly.';
  } else if (pronunciationScore >= 60) {
    fluencyNote = 'Good effort! Try speaking a bit more smoothly.';
  } else {
    fluencyNote = 'Keep practicing! Try to read without long pauses.';
  }

  // Generate intonation tip based on sentence type
  let intonationTip: string;
  switch (sentence.type) {
    case 'question':
      if (sentence.text.toLowerCase().match(/^(who|what|where|when|why|how)/)) {
        intonationTip =
          pronunciationScore >= 70
            ? 'Good falling intonation on your Wh-question!'
            : 'Remember: Wh-questions fall at the end, not rise.';
      } else {
        intonationTip =
          pronunciationScore >= 70
            ? 'Nice rising intonation at the end!'
            : 'Try to raise your voice at the end of yes/no questions.';
      }
      break;
    case 'exclamation':
      intonationTip =
        pronunciationScore >= 70
          ? 'Great energy and expression!'
          : 'Add more emotion! Exclamations need excitement.';
      break;
    case 'command':
      intonationTip =
        pronunciationScore >= 70
          ? 'Clear and confident command!'
          : 'Be more direct. Commands should sound confident.';
      break;
    default:
      intonationTip =
        pronunciationScore >= 70
          ? 'Nice falling intonation at the end!'
          : 'Remember to let your voice fall at the end of statements.';
  }

  // Generate encouragement
  let encouragement: string;
  if (overallScore >= 90) {
    encouragement = 'Excellent! You nailed it!';
  } else if (overallScore >= 80) {
    encouragement = 'Great job! Almost perfect!';
  } else if (overallScore >= 70) {
    encouragement = 'Good work! Keep practicing!';
  } else if (overallScore >= 60) {
    encouragement = 'Nice try! You\'re improving!';
  } else {
    encouragement = 'Keep going! Practice makes perfect!';
  }

  return {
    overallScore,
    pronunciationScore,
    fluencyNote,
    intonationTip,
    encouragement,
  };
}
