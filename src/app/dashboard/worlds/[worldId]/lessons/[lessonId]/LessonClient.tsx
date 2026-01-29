'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  Mic,
  Play,
  CheckCircle,
  Star,
  ChevronRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { getWorld } from '@/constants/worlds';
import { getLesson, getLessonPhonemes, LessonContent } from '@/constants/lessons';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { Phoneme } from '@/types/phonics';
import { speechSynthesis } from '@/lib/audio/speechSynthesis';
import { speechRecognition, PronunciationScore } from '@/lib/audio/speechRecognition';
import { getAIPronunciationFeedback, AIFeedback } from '@/lib/ai/pronunciationAI';

interface LessonClientProps {
  worldId: string;
  lessonId: string;
}

type LessonPhase = 'listen' | 'practice' | 'play' | 'assess';

const phases: { id: LessonPhase; name: string; icon: React.ReactNode }[] = [
  { id: 'listen', name: 'Listen', icon: <Volume2 className="w-4 h-4" /> },
  { id: 'practice', name: 'Practice', icon: <Mic className="w-4 h-4" /> },
  { id: 'play', name: 'Play', icon: <Play className="w-4 h-4" /> },
  { id: 'assess', name: 'Assess', icon: <CheckCircle className="w-4 h-4" /> },
];

export default function LessonClient({ worldId, lessonId }: LessonClientProps) {
  const router = useRouter();
  const { completeLesson, addXP } = useGameStore();
  const [world, setWorld] = useState(getWorld(worldId));
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [phonemes, setPhonemes] = useState<Phoneme[]>([]);
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('listen');
  const [phaseProgress, setPhaseProgress] = useState({
    listen: false,
    practice: false,
    play: false,
    assess: false,
  });

  // Listen phase state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [listenedWords, setListenedWords] = useState<Set<string>>(new Set());

  // Practice phase state
  const [practiceWordIndex, setPracticeWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState<PronunciationScore | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [attemptCount, setAttemptCount] = useState(1);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [practiceScores, setPracticeScores] = useState<number[]>([]);

  // Play phase state
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [gameScore, setGameScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameQuestionIndex, setGameQuestionIndex] = useState(0);

  // Assess phase state
  const [assessScore, setAssessScore] = useState(0);
  const [assessWordIndex, setAssessWordIndex] = useState(0);
  const [assessComplete, setAssessComplete] = useState(false);

  const lessonNumber = parseInt(lessonId, 10);

  useEffect(() => {
    const foundWorld = getWorld(worldId);
    if (!foundWorld) {
      router.push('/dashboard/worlds');
      return;
    }
    setWorld(foundWorld);

    const foundLesson = getLesson(worldId, lessonNumber);
    if (foundLesson) {
      setLesson(foundLesson);
      const lessonPhonemes = getLessonPhonemes(foundLesson);
      setPhonemes(lessonPhonemes);
      // Shuffle words for game
      setGameWords([...foundLesson.words].sort(() => Math.random() - 0.5));
    }
  }, [worldId, lessonNumber, router]);

  // Speak a word using TTS
  const speakWord = useCallback((word: string) => {
    speechSynthesis.speak(word, { rate: 0.8 });
  }, []);

  // Speak phoneme sound
  const speakPhoneme = useCallback((phoneme: Phoneme) => {
    // Speak the phoneme examples to demonstrate the sound
    const example = phoneme.examples[0];
    speechSynthesis.speak(example, { rate: 0.7 });
  }, []);

  // Handle listen phase
  const handleListenWord = (word: string, index: number) => {
    speakWord(word);
    setListenedWords((prev) => new Set(prev).add(word));
    setCurrentWordIndex(index);
  };

  const canProgressListen = lesson && listenedWords.size >= Math.min(3, lesson.words.length);

  // Handle practice phase recording
  const startRecording = () => {
    if (!lesson) return;
    const currentWord = lesson.words[practiceWordIndex];

    setIsRecording(true);
    setTranscript('');
    setPronunciationScore(null);
    setAiFeedback(null);

    speechRecognition.start(
      async (result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          setIsRecording(false);
          const score = speechRecognition.evaluatePronunciation(currentWord, result.transcript);
          setPronunciationScore(score);
          setPracticeScores((prev) => [...prev, score.overall]);

          // Get AI feedback
          setIsLoadingFeedback(true);
          try {
            const feedback = await getAIPronunciationFeedback({
              targetWord: currentWord,
              spokenWord: result.transcript,
              phoneme: phonemes[0],
              score,
              attemptNumber: attemptCount,
            });
            setAiFeedback(feedback);
          } catch (error) {
            console.error('Error getting AI feedback:', error);
          }
          setIsLoadingFeedback(false);
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

  const nextPracticeWord = () => {
    if (lesson && practiceWordIndex < lesson.words.length - 1) {
      setPracticeWordIndex(practiceWordIndex + 1);
      setTranscript('');
      setPronunciationScore(null);
      setAiFeedback(null);
      setAttemptCount(1);
    }
  };

  const retryPractice = () => {
    setTranscript('');
    setPronunciationScore(null);
    setAiFeedback(null);
    setAttemptCount(attemptCount + 1);
  };

  const canProgressPractice = practiceScores.length >= Math.min(3, lesson?.words.length || 3);

  // Handle play phase (word matching game)
  const handleGameAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === gameWords[gameQuestionIndex];
    if (isCorrect) {
      setGameScore(gameScore + 1);
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      if (gameQuestionIndex < Math.min(4, gameWords.length - 1)) {
        setGameQuestionIndex(gameQuestionIndex + 1);
      }
    }, 1000);
  };

  const canProgressPlay = gameScore >= Math.min(3, gameWords.length);

  // Handle assess phase
  const handleAssessAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setAssessScore(assessScore + 1);
    }
    if (lesson && assessWordIndex < Math.min(4, lesson.words.length - 1)) {
      setAssessWordIndex(assessWordIndex + 1);
    } else {
      setAssessComplete(true);
    }
  };

  const canProgressAssess = assessComplete;

  // Phase completion
  const handlePhaseComplete = () => {
    setPhaseProgress((prev) => ({ ...prev, [currentPhase]: true }));

    const currentPhaseIndex = phases.findIndex((p) => p.id === currentPhase);
    const nextPhaseIndex = currentPhaseIndex + 1;

    if (nextPhaseIndex < phases.length) {
      setCurrentPhase(phases[nextPhaseIndex].id);
    } else {
      // Lesson complete
      const lessonKey = `${worldId}-lesson-${lessonId}`;
      completeLesson(lessonKey);
      const earnedXP = Math.round(50 + assessScore * 10);
      addXP(earnedXP);
    }
  };

  const allPhasesComplete = Object.values(phaseProgress).every(Boolean);
  const currentPhaseIndex = phases.findIndex((p) => p.id === currentPhase);

  if (!world || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate stars based on performance
  const calculateStars = () => {
    const avgPractice = practiceScores.length > 0
      ? practiceScores.reduce((a, b) => a + b, 0) / practiceScores.length
      : 0;
    const totalScore = (avgPractice + gameScore * 20 + assessScore * 25) / 3;
    if (totalScore >= 80) return 3;
    if (totalScore >= 60) return 2;
    return 1;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/dashboard/worlds/${worldId}`}>
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to {world.name}
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{world.emoji}</span>
          <div>
            <span className="font-semibold text-gray-700">Lesson {lessonNumber}</span>
            <p className="text-xs text-gray-500">{lesson.title}</p>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center flex-1">
              <motion.button
                onClick={() => phaseProgress[phase.id] && setCurrentPhase(phase.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
                  currentPhase === phase.id
                    ? 'bg-purple-500 text-white'
                    : phaseProgress[phase.id]
                    ? 'bg-green-100 text-green-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400'
                )}
                whileHover={phaseProgress[phase.id] ? { scale: 1.05 } : {}}
                whileTap={phaseProgress[phase.id] ? { scale: 0.95 } : {}}
              >
                {phaseProgress[phase.id] ? <CheckCircle className="w-4 h-4" /> : phase.icon}
                <span className="font-medium text-sm">{phase.name}</span>
              </motion.button>
              {index < phases.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {allPhasesComplete ? (
              /* Lesson Complete */
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: star * 0.2 }}
                    >
                      <Star
                        className={cn(
                          'w-12 h-12',
                          star <= calculateStars()
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        )}
                      />
                    </motion.div>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
                <p className="text-gray-500 mb-6">
                  Great job! You earned {Math.round(50 + assessScore * 10)} XP!
                </p>
                <div className="flex justify-center gap-4">
                  <Link href={`/dashboard/worlds/${worldId}`}>
                    <Button variant="outline">Back to World</Button>
                  </Link>
                  {lessonNumber < world.lessonCount && (
                    <Link href={`/dashboard/worlds/${worldId}/lessons/${lessonNumber + 1}`}>
                      <Button variant="primary">Next Lesson</Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ) : currentPhase === 'listen' ? (
              /* Listen Phase */
              <motion.div
                key="listen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{lesson.title}</h2>
                  <p className="text-gray-500">{lesson.description}</p>
                </div>

                {/* Phoneme Cards */}
                {phonemes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Sound to Learn: {phonemes[0].symbol}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {phonemes.map((phoneme) => (
                        <motion.button
                          key={phoneme.id}
                          onClick={() => speakPhoneme(phoneme)}
                          className="p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition-all bg-white shadow-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 mx-auto"
                            style={{ backgroundColor: phoneme.color }}
                          >
                            {phoneme.symbol}
                          </div>
                          <p className="text-sm text-gray-500">{phoneme.ipa}</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-[150px]">
                            {phoneme.tips[0]}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Word List */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Listen to the Words (tap to hear)
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {lesson.words.map((word, index) => (
                      <motion.button
                        key={word}
                        onClick={() => handleListenWord(word, index)}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all',
                          listenedWords.has(word)
                            ? 'border-green-400 bg-green-50'
                            : currentWordIndex === index
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Volume2
                          className={cn(
                            'w-5 h-5 mx-auto mb-2',
                            listenedWords.has(word) ? 'text-green-500' : 'text-gray-400'
                          )}
                        />
                        <span className="font-medium text-gray-700">{word}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Listen to at least 3 words to continue
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePhaseComplete}
                    disabled={!canProgressListen}
                  >
                    Continue to Practice
                  </Button>
                </div>
              </motion.div>
            ) : currentPhase === 'practice' ? (
              /* Practice Phase */
              <motion.div
                key="practice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Practice Speaking</h2>
                  <p className="text-gray-500">Say the word and get AI feedback!</p>
                </div>

                {/* Current Word to Practice */}
                <div className="text-center mb-8">
                  <motion.div
                    key={practiceWordIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block p-8 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100"
                  >
                    <button
                      onClick={() => speakWord(lesson.words[practiceWordIndex])}
                      className="flex items-center gap-3"
                    >
                      <Volume2 className="w-8 h-8 text-purple-500" />
                      <span className="text-4xl font-bold text-gray-800">
                        {lesson.words[practiceWordIndex]}
                      </span>
                    </button>
                  </motion.div>
                  <p className="text-sm text-gray-500 mt-3">
                    Tap the word to hear it, then record yourself saying it
                  </p>
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center mb-8">
                  {!pronunciationScore ? (
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
                  ) : (
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={retryPractice}
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                      >
                        Try Again
                      </Button>
                      {practiceWordIndex < lesson.words.length - 1 && (
                        <Button variant="primary" onClick={nextPracticeWord}>
                          Next Word
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Transcript */}
                {(isRecording || transcript) && (
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">
                      {isRecording ? 'Listening...' : 'You said:'}
                    </p>
                    <p className="text-xl font-medium text-gray-700">
                      {transcript || '...'}
                    </p>
                  </div>
                )}

                {/* Score and AI Feedback */}
                {pronunciationScore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                  >
                    {/* Score Display */}
                    <div
                      className={cn(
                        'text-center p-6 rounded-2xl mb-4',
                        pronunciationScore.overall >= 80
                          ? 'bg-green-100'
                          : pronunciationScore.overall >= 50
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                      )}
                    >
                      <div className="text-5xl font-bold mb-2">
                        {pronunciationScore.overall}%
                      </div>
                      <div className="text-sm opacity-80">
                        Accuracy: {pronunciationScore.accuracy}% | Similarity:{' '}
                        {pronunciationScore.similarity}%
                      </div>
                    </div>

                    {/* AI Feedback */}
                    {isLoadingFeedback ? (
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Getting AI feedback...
                      </div>
                    ) : aiFeedback ? (
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="font-medium text-gray-800 mb-2">
                          {aiFeedback.encouragement}
                        </p>
                        <p className="text-gray-600 mb-3">{aiFeedback.overallFeedback}</p>
                        {aiFeedback.specificTips.length > 0 && (
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-purple-700 mb-1">Tips:</p>
                            <ul className="text-sm text-purple-600 list-disc list-inside">
                              {aiFeedback.specificTips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </motion.div>
                )}

                <div className="text-center mt-8">
                  <p className="text-sm text-gray-500 mb-4">
                    Practice at least 3 words to continue ({practiceScores.length}/3)
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePhaseComplete}
                    disabled={!canProgressPractice}
                  >
                    Continue to Play
                  </Button>
                </div>
              </motion.div>
            ) : currentPhase === 'play' ? (
              /* Play Phase - Word Matching Game */
              <motion.div
                key="play"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Word Game!</h2>
                  <p className="text-gray-500">Listen and tap the correct word</p>
                  <p className="text-sm text-purple-600 mt-2">Score: {gameScore}/5</p>
                </div>

                {/* Game Question */}
                <div className="text-center mb-8">
                  <motion.button
                    onClick={() => speakWord(gameWords[gameQuestionIndex])}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Volume2 className="w-16 h-16 text-white" />
                  </motion.button>
                  <p className="text-gray-500">Tap to hear the word</p>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                  {[...lesson.words]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4)
                    .map((word) => (
                      <motion.button
                        key={word}
                        onClick={() => !selectedAnswer && handleGameAnswer(word)}
                        className={cn(
                          'p-4 rounded-xl border-2 text-lg font-medium transition-all',
                          selectedAnswer === word
                            ? word === gameWords[gameQuestionIndex]
                              ? 'border-green-500 bg-green-100 text-green-700'
                              : 'border-red-500 bg-red-100 text-red-700'
                            : 'border-gray-200 hover:border-purple-400'
                        )}
                        whileHover={!selectedAnswer ? { scale: 1.05 } : {}}
                        whileTap={!selectedAnswer ? { scale: 0.95 } : {}}
                        disabled={!!selectedAnswer}
                      >
                        {word}
                      </motion.button>
                    ))}
                </div>

                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePhaseComplete}
                    disabled={!canProgressPlay}
                  >
                    Continue to Assessment
                  </Button>
                </div>
              </motion.div>
            ) : currentPhase === 'assess' ? (
              /* Assess Phase */
              <motion.div
                key="assess"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Final Assessment</h2>
                  <p className="text-gray-500">Show what you learned!</p>
                  <p className="text-sm text-purple-600 mt-2">
                    Question {assessWordIndex + 1}/5 | Score: {assessScore}
                  </p>
                </div>

                {!assessComplete ? (
                  <>
                    {/* Assessment Question */}
                    <div className="text-center mb-8">
                      <p className="text-lg text-gray-700 mb-4">
                        Which word has the &ldquo;{phonemes[0]?.symbol || 'a'}&rdquo; sound?
                      </p>
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        {[lesson.words[assessWordIndex], lesson.words[(assessWordIndex + 2) % lesson.words.length]]
                          .sort(() => Math.random() - 0.5)
                          .map((word, idx) => (
                            <motion.button
                              key={`${word}-${idx}`}
                              onClick={() =>
                                handleAssessAnswer(word === lesson.words[assessWordIndex])
                              }
                              className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 text-lg font-medium transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {word}
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {assessScore >= 4 ? '🌟' : assessScore >= 3 ? '👍' : '💪'}
                    </div>
                    <p className="text-xl font-medium text-gray-700 mb-2">
                      You scored {assessScore}/5!
                    </p>
                    <p className="text-gray-500 mb-6">
                      {assessScore >= 4
                        ? 'Excellent! You mastered this lesson!'
                        : assessScore >= 3
                        ? 'Good job! Keep practicing!'
                        : 'Nice try! Practice makes perfect!'}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePhaseComplete}
                    disabled={!canProgressAssess}
                  >
                    Complete Lesson
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
