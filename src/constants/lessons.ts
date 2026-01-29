/**
 * Lesson definitions mapping each lesson to specific phonemes and content
 */

import { ALL_PHONEMES, INITIAL_BLENDS, getPhoneme } from './phonemes';
import { Phoneme } from '@/types/phonics';

export interface LessonContent {
  id: string;
  worldId: string;
  lessonNumber: number;
  title: string;
  description: string;
  phonemes: string[]; // phoneme IDs
  words: string[]; // practice words
  sentences?: string[]; // for higher levels
  targetSkill: string;
}

// Letters Land (World 1) - 20 lessons covering basic phonemes
const lettersLandLessons: LessonContent[] = [
  // Short vowels (Lessons 1-5)
  {
    id: 'letters-land-1',
    worldId: 'letters-land',
    lessonNumber: 1,
    title: 'The "a" Sound',
    description: 'Learn the short "a" sound like in cat and hat!',
    phonemes: ['short-a'],
    words: ['cat', 'hat', 'bat', 'man', 'can', 'pan'],
    targetSkill: 'Short vowel a',
  },
  {
    id: 'letters-land-2',
    worldId: 'letters-land',
    lessonNumber: 2,
    title: 'The "e" Sound',
    description: 'Learn the short "e" sound like in bed and red!',
    phonemes: ['short-e'],
    words: ['bed', 'red', 'pet', 'hen', 'pen', 'ten'],
    targetSkill: 'Short vowel e',
  },
  {
    id: 'letters-land-3',
    worldId: 'letters-land',
    lessonNumber: 3,
    title: 'The "i" Sound',
    description: 'Learn the short "i" sound like in sit and pig!',
    phonemes: ['short-i'],
    words: ['sit', 'bit', 'hit', 'pig', 'big', 'dig'],
    targetSkill: 'Short vowel i',
  },
  {
    id: 'letters-land-4',
    worldId: 'letters-land',
    lessonNumber: 4,
    title: 'The "o" Sound',
    description: 'Learn the short "o" sound like in hot and dog!',
    phonemes: ['short-o'],
    words: ['hot', 'pot', 'dog', 'log', 'mop', 'top'],
    targetSkill: 'Short vowel o',
  },
  {
    id: 'letters-land-5',
    worldId: 'letters-land',
    lessonNumber: 5,
    title: 'The "u" Sound',
    description: 'Learn the short "u" sound like in cup and bus!',
    phonemes: ['short-u'],
    words: ['cup', 'bus', 'nut', 'sun', 'run', 'fun'],
    targetSkill: 'Short vowel u',
  },
  // Basic consonants (Lessons 6-15)
  {
    id: 'letters-land-6',
    worldId: 'letters-land',
    lessonNumber: 6,
    title: 'B and P Sounds',
    description: 'Learn the sounds of B and P!',
    phonemes: ['b', 'p'],
    words: ['bat', 'boy', 'pan', 'pet', 'ball', 'pop'],
    targetSkill: 'Consonants b, p',
  },
  {
    id: 'letters-land-7',
    worldId: 'letters-land',
    lessonNumber: 7,
    title: 'D and T Sounds',
    description: 'Learn the sounds of D and T!',
    phonemes: ['d', 't'],
    words: ['dog', 'dad', 'top', 'ten', 'dot', 'tap'],
    targetSkill: 'Consonants d, t',
  },
  {
    id: 'letters-land-8',
    worldId: 'letters-land',
    lessonNumber: 8,
    title: 'M and N Sounds',
    description: 'Learn the sounds of M and N!',
    phonemes: ['m', 'n'],
    words: ['mom', 'man', 'no', 'net', 'map', 'nap'],
    targetSkill: 'Consonants m, n',
  },
  {
    id: 'letters-land-9',
    worldId: 'letters-land',
    lessonNumber: 9,
    title: 'S and Z Sounds',
    description: 'Learn the sounds of S and Z - the snake and bee!',
    phonemes: ['s', 'z'],
    words: ['sun', 'sit', 'zoo', 'zip', 'bus', 'buzz'],
    targetSkill: 'Consonants s, z',
  },
  {
    id: 'letters-land-10',
    worldId: 'letters-land',
    lessonNumber: 10,
    title: 'F and V Sounds',
    description: 'Learn the sounds of F and V!',
    phonemes: ['f', 'v'],
    words: ['fan', 'fun', 'van', 'vine', 'off', 'love'],
    targetSkill: 'Consonants f, v',
  },
  {
    id: 'letters-land-11',
    worldId: 'letters-land',
    lessonNumber: 11,
    title: 'C/K and G Sounds',
    description: 'Learn the sounds of C/K and G!',
    phonemes: ['c-k', 'g'],
    words: ['cat', 'kite', 'go', 'get', 'duck', 'dog'],
    targetSkill: 'Consonants c/k, g',
  },
  {
    id: 'letters-land-12',
    worldId: 'letters-land',
    lessonNumber: 12,
    title: 'H and W Sounds',
    description: 'Learn the sounds of H and W!',
    phonemes: ['h', 'w'],
    words: ['hat', 'hot', 'win', 'wet', 'house', 'wow'],
    targetSkill: 'Consonants h, w',
  },
  {
    id: 'letters-land-13',
    worldId: 'letters-land',
    lessonNumber: 13,
    title: 'L and R Sounds',
    description: 'Learn the sounds of L and R!',
    phonemes: ['l', 'r'],
    words: ['leg', 'lamp', 'red', 'run', 'ball', 'car'],
    targetSkill: 'Consonants l, r',
  },
  {
    id: 'letters-land-14',
    worldId: 'letters-land',
    lessonNumber: 14,
    title: 'J and Y Sounds',
    description: 'Learn the sounds of J and Y!',
    phonemes: ['j', 'y'],
    words: ['jam', 'jet', 'yes', 'yell', 'jump', 'yummy'],
    targetSkill: 'Consonants j, y',
  },
  {
    id: 'letters-land-15',
    worldId: 'letters-land',
    lessonNumber: 15,
    title: 'X and Qu Sounds',
    description: 'Learn the sounds of X and Qu!',
    phonemes: ['x', 'qu'],
    words: ['box', 'fox', 'queen', 'quick', 'six', 'quiz'],
    targetSkill: 'Consonants x, qu',
  },
  // Long vowels (Lessons 16-20)
  {
    id: 'letters-land-16',
    worldId: 'letters-land',
    lessonNumber: 16,
    title: 'Long A Sound',
    description: 'Learn the long "a" sound - say the letter name!',
    phonemes: ['long-a'],
    words: ['cake', 'make', 'rain', 'play', 'day', 'way'],
    targetSkill: 'Long vowel a',
  },
  {
    id: 'letters-land-17',
    worldId: 'letters-land',
    lessonNumber: 17,
    title: 'Long E Sound',
    description: 'Learn the long "e" sound - smile wide!',
    phonemes: ['long-e'],
    words: ['bee', 'see', 'tree', 'feet', 'meat', 'seat'],
    targetSkill: 'Long vowel e',
  },
  {
    id: 'letters-land-18',
    worldId: 'letters-land',
    lessonNumber: 18,
    title: 'Long I Sound',
    description: 'Learn the long "i" sound - say the letter name!',
    phonemes: ['long-i'],
    words: ['bike', 'like', 'time', 'five', 'kite', 'ride'],
    targetSkill: 'Long vowel i',
  },
  {
    id: 'letters-land-19',
    worldId: 'letters-land',
    lessonNumber: 19,
    title: 'Long O Sound',
    description: 'Learn the long "o" sound - round your lips!',
    phonemes: ['long-o'],
    words: ['bone', 'home', 'rope', 'boat', 'coat', 'road'],
    targetSkill: 'Long vowel o',
  },
  {
    id: 'letters-land-20',
    worldId: 'letters-land',
    lessonNumber: 20,
    title: 'Long U Sound',
    description: 'Learn the long "u" sound - like moon!',
    phonemes: ['long-u'],
    words: ['tube', 'cube', 'blue', 'glue', 'moon', 'food'],
    targetSkill: 'Long vowel u',
  },
];

// Word City (World 2) - 25 lessons on blends and CVC words
const wordCityLessons: LessonContent[] = [
  // L-blends (Lessons 1-6)
  {
    id: 'word-city-1',
    worldId: 'word-city',
    lessonNumber: 1,
    title: 'BL Blend',
    description: 'Blend B and L together!',
    phonemes: ['bl'],
    words: ['blue', 'black', 'blend', 'block', 'blow', 'blade'],
    targetSkill: 'BL blend',
  },
  {
    id: 'word-city-2',
    worldId: 'word-city',
    lessonNumber: 2,
    title: 'CL Blend',
    description: 'Blend C and L together!',
    phonemes: ['cl'],
    words: ['clap', 'class', 'clean', 'clock', 'cloud', 'club'],
    targetSkill: 'CL blend',
  },
  {
    id: 'word-city-3',
    worldId: 'word-city',
    lessonNumber: 3,
    title: 'FL Blend',
    description: 'Blend F and L together!',
    phonemes: ['fl'],
    words: ['flag', 'flat', 'flip', 'floor', 'flower', 'fly'],
    targetSkill: 'FL blend',
  },
  {
    id: 'word-city-4',
    worldId: 'word-city',
    lessonNumber: 4,
    title: 'GL Blend',
    description: 'Blend G and L together!',
    phonemes: ['gl'],
    words: ['glad', 'glass', 'glue', 'glow', 'globe', 'glove'],
    targetSkill: 'GL blend',
  },
  {
    id: 'word-city-5',
    worldId: 'word-city',
    lessonNumber: 5,
    title: 'PL Blend',
    description: 'Blend P and L together!',
    phonemes: ['pl'],
    words: ['plan', 'play', 'please', 'plate', 'plus', 'plant'],
    targetSkill: 'PL blend',
  },
  {
    id: 'word-city-6',
    worldId: 'word-city',
    lessonNumber: 6,
    title: 'SL Blend',
    description: 'Blend S and L together!',
    phonemes: ['sl'],
    words: ['slip', 'slow', 'sleep', 'slide', 'slim', 'sled'],
    targetSkill: 'SL blend',
  },
  // R-blends (Lessons 7-13)
  {
    id: 'word-city-7',
    worldId: 'word-city',
    lessonNumber: 7,
    title: 'BR Blend',
    description: 'Blend B and R together!',
    phonemes: ['br'],
    words: ['brown', 'bread', 'bring', 'bright', 'brush', 'brave'],
    targetSkill: 'BR blend',
  },
  {
    id: 'word-city-8',
    worldId: 'word-city',
    lessonNumber: 8,
    title: 'CR Blend',
    description: 'Blend C and R together!',
    phonemes: ['cr'],
    words: ['cry', 'crab', 'cream', 'cross', 'crowd', 'crown'],
    targetSkill: 'CR blend',
  },
  {
    id: 'word-city-9',
    worldId: 'word-city',
    lessonNumber: 9,
    title: 'DR Blend',
    description: 'Blend D and R together!',
    phonemes: ['dr'],
    words: ['drum', 'drop', 'draw', 'drink', 'dress', 'dream'],
    targetSkill: 'DR blend',
  },
  {
    id: 'word-city-10',
    worldId: 'word-city',
    lessonNumber: 10,
    title: 'FR Blend',
    description: 'Blend F and R together!',
    phonemes: ['fr'],
    words: ['frog', 'from', 'free', 'fresh', 'friend', 'fruit'],
    targetSkill: 'FR blend',
  },
  {
    id: 'word-city-11',
    worldId: 'word-city',
    lessonNumber: 11,
    title: 'GR Blend',
    description: 'Blend G and R together!',
    phonemes: ['gr'],
    words: ['green', 'grow', 'great', 'grape', 'grass', 'grab'],
    targetSkill: 'GR blend',
  },
  {
    id: 'word-city-12',
    worldId: 'word-city',
    lessonNumber: 12,
    title: 'PR Blend',
    description: 'Blend P and R together!',
    phonemes: ['pr'],
    words: ['print', 'price', 'proud', 'pretty', 'prize', 'press'],
    targetSkill: 'PR blend',
  },
  {
    id: 'word-city-13',
    worldId: 'word-city',
    lessonNumber: 13,
    title: 'TR Blend',
    description: 'Blend T and R together!',
    phonemes: ['tr'],
    words: ['tree', 'train', 'true', 'try', 'trip', 'trick'],
    targetSkill: 'TR blend',
  },
  // S-blends (Lessons 14-19)
  {
    id: 'word-city-14',
    worldId: 'word-city',
    lessonNumber: 14,
    title: 'ST Blend',
    description: 'Blend S and T together!',
    phonemes: ['st'],
    words: ['stop', 'star', 'stay', 'step', 'stone', 'store'],
    targetSkill: 'ST blend',
  },
  {
    id: 'word-city-15',
    worldId: 'word-city',
    lessonNumber: 15,
    title: 'SC/SK Blend',
    description: 'Blend S and K together!',
    phonemes: ['sc-sk'],
    words: ['skip', 'skin', 'sky', 'scare', 'scale', 'score'],
    targetSkill: 'SC/SK blend',
  },
  {
    id: 'word-city-16',
    worldId: 'word-city',
    lessonNumber: 16,
    title: 'SM Blend',
    description: 'Blend S and M together!',
    phonemes: ['sm'],
    words: ['small', 'smart', 'smell', 'smile', 'smoke', 'smooth'],
    targetSkill: 'SM blend',
  },
  {
    id: 'word-city-17',
    worldId: 'word-city',
    lessonNumber: 17,
    title: 'SN Blend',
    description: 'Blend S and N together!',
    phonemes: ['sn'],
    words: ['snap', 'snack', 'snake', 'snow', 'snail', 'snore'],
    targetSkill: 'SN blend',
  },
  {
    id: 'word-city-18',
    worldId: 'word-city',
    lessonNumber: 18,
    title: 'SP Blend',
    description: 'Blend S and P together!',
    phonemes: ['sp'],
    words: ['spin', 'spot', 'spell', 'speak', 'space', 'sport'],
    targetSkill: 'SP blend',
  },
  {
    id: 'word-city-19',
    worldId: 'word-city',
    lessonNumber: 19,
    title: 'SW Blend',
    description: 'Blend S and W together!',
    phonemes: ['sw'],
    words: ['swim', 'swing', 'sweet', 'switch', 'swan', 'sweep'],
    targetSkill: 'SW blend',
  },
  // Digraphs (Lessons 20-25)
  {
    id: 'word-city-20',
    worldId: 'word-city',
    lessonNumber: 20,
    title: 'SH Digraph',
    description: 'Two letters, one sound - SH!',
    phonemes: ['sh'],
    words: ['ship', 'shop', 'fish', 'wish', 'cash', 'shell'],
    targetSkill: 'SH digraph',
  },
  {
    id: 'word-city-21',
    worldId: 'word-city',
    lessonNumber: 21,
    title: 'CH Digraph',
    description: 'Two letters, one sound - CH!',
    phonemes: ['ch'],
    words: ['chip', 'chat', 'rich', 'much', 'lunch', 'church'],
    targetSkill: 'CH digraph',
  },
  {
    id: 'word-city-22',
    worldId: 'word-city',
    lessonNumber: 22,
    title: 'TH Sounds',
    description: 'Learn both TH sounds - voiced and unvoiced!',
    phonemes: ['th-voiced', 'th-unvoiced'],
    words: ['the', 'this', 'think', 'thing', 'that', 'three'],
    targetSkill: 'TH digraphs',
  },
  {
    id: 'word-city-23',
    worldId: 'word-city',
    lessonNumber: 23,
    title: 'WH Digraph',
    description: 'Two letters, one sound - WH!',
    phonemes: ['wh'],
    words: ['what', 'when', 'where', 'why', 'white', 'wheel'],
    targetSkill: 'WH digraph',
  },
  {
    id: 'word-city-24',
    worldId: 'word-city',
    lessonNumber: 24,
    title: 'PH Digraph',
    description: 'PH makes the F sound!',
    phonemes: ['ph'],
    words: ['phone', 'photo', 'graph', 'dolphin', 'elephant', 'alphabet'],
    targetSkill: 'PH digraph',
  },
  {
    id: 'word-city-25',
    worldId: 'word-city',
    lessonNumber: 25,
    title: 'NG Digraph',
    description: 'The NG sound at the end of words!',
    phonemes: ['ng'],
    words: ['ring', 'sing', 'king', 'long', 'song', 'thing'],
    targetSkill: 'NG digraph',
  },
];

// Rule Realm (World 3) - 20 lessons on vowel patterns
const ruleRealmLessons: LessonContent[] = [
  // R-controlled vowels (Lessons 1-5)
  {
    id: 'rule-realm-1',
    worldId: 'rule-realm',
    lessonNumber: 1,
    title: 'AR Sound',
    description: 'The bossy R changes A - AR!',
    phonemes: ['ar'],
    words: ['car', 'star', 'park', 'farm', 'arm', 'art'],
    targetSkill: 'R-controlled ar',
  },
  {
    id: 'rule-realm-2',
    worldId: 'rule-realm',
    lessonNumber: 2,
    title: 'ER Sound',
    description: 'The bossy R changes E - ER!',
    phonemes: ['er'],
    words: ['her', 'fern', 'term', 'herd', 'verb', 'perch'],
    targetSkill: 'R-controlled er',
  },
  {
    id: 'rule-realm-3',
    worldId: 'rule-realm',
    lessonNumber: 3,
    title: 'IR Sound',
    description: 'The bossy R changes I - IR!',
    phonemes: ['ir'],
    words: ['bird', 'girl', 'first', 'shirt', 'third', 'dirt'],
    targetSkill: 'R-controlled ir',
  },
  {
    id: 'rule-realm-4',
    worldId: 'rule-realm',
    lessonNumber: 4,
    title: 'OR Sound',
    description: 'The bossy R changes O - OR!',
    phonemes: ['or'],
    words: ['for', 'door', 'more', 'store', 'corn', 'horn'],
    targetSkill: 'R-controlled or',
  },
  {
    id: 'rule-realm-5',
    worldId: 'rule-realm',
    lessonNumber: 5,
    title: 'UR Sound',
    description: 'The bossy R changes U - UR!',
    phonemes: ['ur'],
    words: ['fur', 'turn', 'burn', 'hurt', 'nurse', 'purse'],
    targetSkill: 'R-controlled ur',
  },
  // Diphthongs (Lessons 6-8)
  {
    id: 'rule-realm-6',
    worldId: 'rule-realm',
    lessonNumber: 6,
    title: 'OI/OY Sound',
    description: 'The gliding OI and OY sounds!',
    phonemes: ['oi'],
    words: ['oil', 'coin', 'boy', 'toy', 'joy', 'noise'],
    targetSkill: 'Diphthong oi/oy',
  },
  {
    id: 'rule-realm-7',
    worldId: 'rule-realm',
    lessonNumber: 7,
    title: 'OU/OW Sound',
    description: 'The gliding OU and OW sounds - ouch!',
    phonemes: ['ou'],
    words: ['out', 'house', 'cow', 'now', 'how', 'brown'],
    targetSkill: 'Diphthong ou/ow',
  },
  {
    id: 'rule-realm-8',
    worldId: 'rule-realm',
    lessonNumber: 8,
    title: 'OO Sound',
    description: 'The long OO sound like a ghost!',
    phonemes: ['oo-long'],
    words: ['moon', 'food', 'cool', 'school', 'zoo', 'room'],
    targetSkill: 'Diphthong oo',
  },
  // Vowel teams (Lessons 9-20) - simplified for now
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `rule-realm-${i + 9}`,
    worldId: 'rule-realm',
    lessonNumber: i + 9,
    title: `Vowel Patterns ${i + 1}`,
    description: 'Practice vowel team patterns!',
    phonemes: ['long-a', 'long-e', 'long-i', 'long-o', 'long-u'][i % 5] ? [['long-a', 'long-e', 'long-i', 'long-o', 'long-u'][i % 5]] : ['long-a'],
    words: ['rain', 'team', 'boat', 'night', 'play', 'green'],
    targetSkill: 'Vowel teams',
  })),
];

// Sentence Station (World 4) - 15 lessons on fluency
const sentenceStationLessons: LessonContent[] = Array.from({ length: 15 }, (_, i) => ({
  id: `sentence-station-${i + 1}`,
  worldId: 'sentence-station',
  lessonNumber: i + 1,
  title: `Fluency Practice ${i + 1}`,
  description: 'Read sentences with expression!',
  phonemes: [], // Sentence level
  words: ['the', 'quick', 'brown', 'fox', 'jumps', 'over'],
  sentences: [
    'The cat sat on the mat.',
    'I can see a big dog.',
    'She has a red hat.',
    'We like to play games.',
    'Can you help me please?',
  ],
  targetSkill: 'Sentence fluency',
}));

// Story Kingdom (World 5) - 15 lessons on comprehension
const storyKingdomLessons: LessonContent[] = Array.from({ length: 15 }, (_, i) => ({
  id: `story-kingdom-${i + 1}`,
  worldId: 'story-kingdom',
  lessonNumber: i + 1,
  title: `Story Reading ${i + 1}`,
  description: 'Read stories and understand them!',
  phonemes: [], // Story level
  words: [],
  sentences: [
    'Once upon a time, there was a little cat.',
    'The cat liked to play in the sun.',
    'One day, the cat found a ball.',
    'The cat played with the ball all day.',
    'The cat was very happy.',
  ],
  targetSkill: 'Reading comprehension',
}));

// Combine all lessons
export const ALL_LESSONS: LessonContent[] = [
  ...lettersLandLessons,
  ...wordCityLessons,
  ...ruleRealmLessons,
  ...sentenceStationLessons,
  ...storyKingdomLessons,
];

// Get lesson by world and number
export function getLesson(worldId: string, lessonNumber: number): LessonContent | undefined {
  return ALL_LESSONS.find(
    (lesson) => lesson.worldId === worldId && lesson.lessonNumber === lessonNumber
  );
}

// Get all lessons for a world
export function getLessonsByWorld(worldId: string): LessonContent[] {
  return ALL_LESSONS.filter((lesson) => lesson.worldId === worldId);
}

// Get phoneme objects for a lesson
export function getLessonPhonemes(lesson: LessonContent): Phoneme[] {
  return lesson.phonemes
    .map((id) => getPhoneme(id))
    .filter((p): p is Phoneme => p !== undefined);
}
