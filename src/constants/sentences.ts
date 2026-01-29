/**
 * Sentence data with intonation patterns for fluency training
 */

import { Sentence, IntonationPoint, SentenceWord } from '@/types/phonics';

// Helper to create sentence words with stress markers
function createWords(
  words: string[],
  stressedIndices: number[] = []
): SentenceWord[] {
  return words.map((text, index) => ({
    text,
    isStressed: stressedIndices.includes(index),
    stressLevel: stressedIndices.includes(index) ? 2 : 1,
  }));
}

// Intonation patterns by sentence type
export const INTONATION_PATTERNS = {
  // Statements fall at the end
  statement: (wordCount: number): IntonationPoint[] => [
    { wordIndex: wordCount - 1, direction: 'falling', intensity: 'moderate' },
  ],

  // Yes/No questions rise at the end
  yesNoQuestion: (wordCount: number): IntonationPoint[] => [
    { wordIndex: wordCount - 1, direction: 'rising', intensity: 'strong' },
  ],

  // Wh-questions fall at the end
  whQuestion: (wordCount: number): IntonationPoint[] => [
    { wordIndex: 0, direction: 'rising', intensity: 'slight' },
    { wordIndex: wordCount - 1, direction: 'falling', intensity: 'moderate' },
  ],

  // Exclamations have strong fall
  exclamation: (wordCount: number): IntonationPoint[] => [
    { wordIndex: wordCount - 1, direction: 'falling', intensity: 'strong' },
  ],

  // Lists rise on each item, fall on last
  list: (itemIndices: number[], lastIndex: number): IntonationPoint[] => [
    ...itemIndices.slice(0, -1).map((i) => ({
      wordIndex: i,
      direction: 'rising' as const,
      intensity: 'slight' as const,
    })),
    { wordIndex: lastIndex, direction: 'falling', intensity: 'moderate' },
  ],
};

// Level 1: Simple statements (Sentence Station Lesson 1-3)
export const SIMPLE_STATEMENTS: Sentence[] = [
  {
    id: 'stmt-1',
    text: 'The cat sat on the mat.',
    words: createWords(['The', 'cat', 'sat', 'on', 'the', 'mat.'], [1, 2, 5]),
    difficulty: 1,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 1, direction: 'sustained', intensity: 'slight' },
      { wordIndex: 5, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'stmt-2',
    text: 'I like to run and play.',
    words: createWords(['I', 'like', 'to', 'run', 'and', 'play.'], [1, 3, 5]),
    difficulty: 1,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 3, direction: 'rising', intensity: 'slight' },
      { wordIndex: 5, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'stmt-3',
    text: 'She has a big red ball.',
    words: createWords(['She', 'has', 'a', 'big', 'red', 'ball.'], [1, 3, 4, 5]),
    difficulty: 1,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 5, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'stmt-4',
    text: 'The dog is in the yard.',
    words: createWords(['The', 'dog', 'is', 'in', 'the', 'yard.'], [1, 5]),
    difficulty: 1,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 5, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'stmt-5',
    text: 'We go to school every day.',
    words: createWords(['We', 'go', 'to', 'school', 'every', 'day.'], [1, 3, 5]),
    difficulty: 1,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 3, direction: 'sustained', intensity: 'slight' },
      { wordIndex: 5, direction: 'falling', intensity: 'moderate' },
    ],
  },
];

// Level 2: Yes/No Questions (Sentence Station Lesson 4-6)
export const YES_NO_QUESTIONS: Sentence[] = [
  {
    id: 'ynq-1',
    text: 'Can you help me?',
    words: createWords(['Can', 'you', 'help', 'me?'], [0, 2]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 3, direction: 'rising', intensity: 'strong' },
    ],
  },
  {
    id: 'ynq-2',
    text: 'Is this your book?',
    words: createWords(['Is', 'this', 'your', 'book?'], [0, 3]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 3, direction: 'rising', intensity: 'strong' },
    ],
  },
  {
    id: 'ynq-3',
    text: 'Do you like ice cream?',
    words: createWords(['Do', 'you', 'like', 'ice', 'cream?'], [0, 2, 4]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 4, direction: 'rising', intensity: 'strong' },
    ],
  },
  {
    id: 'ynq-4',
    text: 'Are you coming to the party?',
    words: createWords(['Are', 'you', 'coming', 'to', 'the', 'party?'], [0, 2, 5]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 5, direction: 'rising', intensity: 'strong' },
    ],
  },
  {
    id: 'ynq-5',
    text: 'Did she finish her homework?',
    words: createWords(['Did', 'she', 'finish', 'her', 'homework?'], [0, 2, 4]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 4, direction: 'rising', intensity: 'strong' },
    ],
  },
];

// Level 3: Wh-Questions (Sentence Station Lesson 7-9)
export const WH_QUESTIONS: Sentence[] = [
  {
    id: 'whq-1',
    text: 'What is your name?',
    words: createWords(['What', 'is', 'your', 'name?'], [0, 3]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 3, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'whq-2',
    text: 'Where do you live?',
    words: createWords(['Where', 'do', 'you', 'live?'], [0, 3]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 3, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'whq-3',
    text: 'How old are you?',
    words: createWords(['How', 'old', 'are', 'you?'], [0, 1]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 3, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'whq-4',
    text: 'Why is the sky blue?',
    words: createWords(['Why', 'is', 'the', 'sky', 'blue?'], [0, 3, 4]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 4, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'whq-5',
    text: 'When does the movie start?',
    words: createWords(['When', 'does', 'the', 'movie', 'start?'], [0, 3, 4]),
    difficulty: 2,
    type: 'question',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 4, direction: 'falling', intensity: 'moderate' },
    ],
  },
];

// Level 4: Exclamations (Sentence Station Lesson 10-12)
export const EXCLAMATIONS: Sentence[] = [
  {
    id: 'exc-1',
    text: 'What a beautiful day!',
    words: createWords(['What', 'a', 'beautiful', 'day!'], [0, 2, 3]),
    difficulty: 2,
    type: 'exclamation',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 2, direction: 'sustained', intensity: 'strong' },
      { wordIndex: 3, direction: 'falling', intensity: 'strong' },
    ],
  },
  {
    id: 'exc-2',
    text: 'I love this song!',
    words: createWords(['I', 'love', 'this', 'song!'], [1, 3]),
    difficulty: 2,
    type: 'exclamation',
    intonationPattern: [
      { wordIndex: 1, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 3, direction: 'falling', intensity: 'strong' },
    ],
  },
  {
    id: 'exc-3',
    text: 'That was amazing!',
    words: createWords(['That', 'was', 'amazing!'], [2]),
    difficulty: 2,
    type: 'exclamation',
    intonationPattern: [
      { wordIndex: 2, direction: 'falling', intensity: 'strong' },
    ],
  },
  {
    id: 'exc-4',
    text: 'Great job everyone!',
    words: createWords(['Great', 'job', 'everyone!'], [0, 1, 2]),
    difficulty: 2,
    type: 'exclamation',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'strong' },
      { wordIndex: 2, direction: 'falling', intensity: 'strong' },
    ],
  },
  {
    id: 'exc-5',
    text: 'Watch out for that car!',
    words: createWords(['Watch', 'out', 'for', 'that', 'car!'], [0, 1, 4]),
    difficulty: 3,
    type: 'exclamation',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'strong' },
      { wordIndex: 4, direction: 'falling', intensity: 'strong' },
    ],
  },
];

// Level 5: Complex sentences with lists (Sentence Station Lesson 13-15)
export const COMPLEX_SENTENCES: Sentence[] = [
  {
    id: 'cmx-1',
    text: 'I need apples, oranges, and bananas.',
    words: createWords(['I', 'need', 'apples,', 'oranges,', 'and', 'bananas.'], [1, 2, 3, 5]),
    difficulty: 3,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 2, direction: 'rising', intensity: 'slight' },
      { wordIndex: 3, direction: 'rising', intensity: 'slight' },
      { wordIndex: 5, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'cmx-2',
    text: 'She can sing, dance, and act.',
    words: createWords(['She', 'can', 'sing,', 'dance,', 'and', 'act.'], [2, 3, 5]),
    difficulty: 3,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 2, direction: 'rising', intensity: 'slight' },
      { wordIndex: 3, direction: 'rising', intensity: 'slight' },
      { wordIndex: 5, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'cmx-3',
    text: 'First, mix the flour. Then, add the eggs.',
    words: createWords(['First,', 'mix', 'the', 'flour.', 'Then,', 'add', 'the', 'eggs.'], [0, 1, 3, 4, 5, 7]),
    difficulty: 3,
    type: 'command',
    intonationPattern: [
      { wordIndex: 0, direction: 'rising', intensity: 'slight' },
      { wordIndex: 3, direction: 'falling', intensity: 'slight' },
      { wordIndex: 4, direction: 'rising', intensity: 'slight' },
      { wordIndex: 7, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'cmx-4',
    text: 'If it rains, we will stay inside.',
    words: createWords(['If', 'it', 'rains,', 'we', 'will', 'stay', 'inside.'], [0, 2, 5, 6]),
    difficulty: 3,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 2, direction: 'rising', intensity: 'moderate' },
      { wordIndex: 6, direction: 'falling', intensity: 'moderate' },
    ],
  },
  {
    id: 'cmx-5',
    text: 'The big, brown dog jumped over the fence.',
    words: createWords(['The', 'big,', 'brown', 'dog', 'jumped', 'over', 'the', 'fence.'], [1, 2, 3, 4, 7]),
    difficulty: 3,
    type: 'statement',
    intonationPattern: [
      { wordIndex: 3, direction: 'sustained', intensity: 'slight' },
      { wordIndex: 4, direction: 'rising', intensity: 'slight' },
      { wordIndex: 7, direction: 'falling', intensity: 'moderate' },
    ],
  },
];

// All sentences organized by lesson
export const SENTENCE_LESSONS = [
  { lessonNumber: 1, title: 'Simple Statements 1', sentences: SIMPLE_STATEMENTS.slice(0, 2) },
  { lessonNumber: 2, title: 'Simple Statements 2', sentences: SIMPLE_STATEMENTS.slice(2, 4) },
  { lessonNumber: 3, title: 'Simple Statements 3', sentences: [SIMPLE_STATEMENTS[4], SIMPLE_STATEMENTS[0]] },
  { lessonNumber: 4, title: 'Yes/No Questions 1', sentences: YES_NO_QUESTIONS.slice(0, 2) },
  { lessonNumber: 5, title: 'Yes/No Questions 2', sentences: YES_NO_QUESTIONS.slice(2, 4) },
  { lessonNumber: 6, title: 'Yes/No Questions 3', sentences: [YES_NO_QUESTIONS[4], YES_NO_QUESTIONS[0]] },
  { lessonNumber: 7, title: 'Wh-Questions 1', sentences: WH_QUESTIONS.slice(0, 2) },
  { lessonNumber: 8, title: 'Wh-Questions 2', sentences: WH_QUESTIONS.slice(2, 4) },
  { lessonNumber: 9, title: 'Wh-Questions 3', sentences: [WH_QUESTIONS[4], WH_QUESTIONS[0]] },
  { lessonNumber: 10, title: 'Exclamations 1', sentences: EXCLAMATIONS.slice(0, 2) },
  { lessonNumber: 11, title: 'Exclamations 2', sentences: EXCLAMATIONS.slice(2, 4) },
  { lessonNumber: 12, title: 'Exclamations 3', sentences: [EXCLAMATIONS[4], EXCLAMATIONS[0]] },
  { lessonNumber: 13, title: 'Complex Sentences 1', sentences: COMPLEX_SENTENCES.slice(0, 2) },
  { lessonNumber: 14, title: 'Complex Sentences 2', sentences: COMPLEX_SENTENCES.slice(2, 4) },
  { lessonNumber: 15, title: 'Complex Sentences 3', sentences: [COMPLEX_SENTENCES[4], COMPLEX_SENTENCES[0]] },
];

// Get sentences for a specific lesson
export function getSentencesForLesson(lessonNumber: number): Sentence[] {
  const lesson = SENTENCE_LESSONS.find(l => l.lessonNumber === lessonNumber);
  return lesson?.sentences || [];
}

// Get all sentences
export function getAllSentences(): Sentence[] {
  return [
    ...SIMPLE_STATEMENTS,
    ...YES_NO_QUESTIONS,
    ...WH_QUESTIONS,
    ...EXCLAMATIONS,
    ...COMPLEX_SENTENCES,
  ];
}
