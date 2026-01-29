/**
 * Phonics type definitions for the learning app
 */

// Phoneme category types
export type PhonemeCategory =
  | 'short_vowel'
  | 'long_vowel'
  | 'consonant'
  | 'digraph'
  | 'blend'
  | 'diphthong'
  | 'r_controlled';

// Individual phoneme definition
export interface Phoneme {
  id: string;
  symbol: string;           // Display text (e.g., "sh", "th", "a")
  ipa: string;              // IPA notation (e.g., "/ʃ/", "/θ/", "/æ/")
  category: PhonemeCategory;
  color: string;            // Hex color for visual coding
  description: string;      // How to produce the sound
  tips: string[];           // Pronunciation tips
  examples: string[];       // Example words
  audioKey?: string;        // Key for TTS or audio file
  mouthShape?: MouthShape;  // For mouth animation
}

// Mouth shape for animation
export type MouthShape =
  // Closed positions
  | 'closed'         // Lips together, rest
  | 'closed_smile'   // /i/, /eɪ/
  | 'closed_rounded' // /u/ starting position
  // Open positions
  | 'open_wide'      // /ɑ/, /æ/
  | 'open_medium'    // /ɛ/, /ʌ/
  | 'open_small'     // /ɪ/, /ʊ/
  // Rounded positions
  | 'rounded_open'   // /ɔ/, /oʊ/
  | 'rounded_medium' // /ʊ/
  | 'rounded_small'  // /u/, /ʊ/
  // Lip positions
  | 'lips_together'  // /p/, /b/, /m/
  | 'lips_rounded'   // /w/
  // Tongue positions
  | 'tongue_tip_up'  // /l/, /n/, /t/, /d/
  | 'tongue_back'    // /k/, /g/
  | 'tongue_ridge'   // /t/, /d/, /n/, /l/
  | 'tongue_teeth'   // /θ/, /ð/
  // Special positions
  | 'teeth_lip'      // /f/, /v/
  | 'th_position'    // /θ/, /ð/
  | 'l_position'     // /l/
  | 'r_position'     // /r/
  | 'fricative'      // /s/, /z/, /ʃ/, /ʒ/
  | 'neutral';       // Rest position

// Word with phoneme breakdown
export interface Word {
  id: string;
  text: string;
  phonemes: WordPhoneme[];
  syllables: string[];
  syllableBreaks: number[];     // Character indices of breaks
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: WordCategory;
  definition?: string;
  exampleSentence?: string;
  imageUrl?: string;
}

export interface WordPhoneme {
  phonemeId: string;
  position: {
    start: number;          // Character index start
    end: number;            // Character index end
  };
}

export type WordCategory =
  | 'cvc'                   // Consonant-Vowel-Consonant (cat, dog)
  | 'cvce'                  // Magic E (cake, bike)
  | 'ccvc'                  // Blend start (stop, frog)
  | 'cvcc'                  // Blend end (best, lamp)
  | 'ccvcc'                 // Complex (frost, blend)
  | 'digraph'               // Contains digraph (ship, that)
  | 'vowel_team'            // Vowel teams (rain, boat)
  | 'r_controlled'          // R-controlled (car, bird)
  | 'sight_word'            // High-frequency irregular (the, was)
  | 'multisyllable';        // Multiple syllables

// Sentence with timing and intonation
export interface Sentence {
  id: string;
  text: string;
  words: SentenceWord[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'statement' | 'question' | 'exclamation' | 'command';
  intonationPattern: IntonationPoint[];
}

export interface SentenceWord {
  text: string;
  startTime?: number;       // Audio timestamp (ms) - for karaoke sync
  endTime?: number;
  isStressed: boolean;
  stressLevel?: 1 | 2 | 3;  // Primary, secondary, unstressed
  phonemes?: WordPhoneme[];
}

export interface IntonationPoint {
  wordIndex: number;        // Which word this applies to
  direction: 'rising' | 'falling' | 'sustained';
  intensity: 'slight' | 'moderate' | 'strong';
}

// Paragraph/Story for advanced reading
export interface Paragraph {
  id: string;
  text: string;
  sentences: Sentence[];
  chunks: ReadingChunk[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface ReadingChunk {
  text: string;
  startIndex: number;
  endIndex: number;
  pauseAfter: 'none' | 'short' | 'medium' | 'long';
}

// Phonics rules
export interface PhonicsRule {
  id: string;
  name: string;             // "Silent E Rule", "Bossy R"
  description: string;      // Full explanation
  shortDescription: string; // Brief summary
  pattern: string;          // Pattern description
  examples: string[];       // Example words
  exceptions: string[];     // Exception words
  mnemonic?: string;        // Memory aid
  level: 1 | 2 | 3;         // Complexity level
}

// Blending pattern
export interface BlendingPattern {
  id: string;
  type: 'initial' | 'final';
  letters: string;          // "bl", "str", "ck"
  phonemes: string[];       // Phoneme IDs involved
  examples: string[];       // Example words
}

// Color mapping for phoneme categories
export const PHONEME_COLORS: Record<PhonemeCategory, string> = {
  short_vowel: '#FF6B6B',
  long_vowel: '#4ECDC4',
  consonant: '#45B7D1',
  digraph: '#96CEB4',
  blend: '#FFEAA7',
  diphthong: '#DDA0DD',
  r_controlled: '#F39C12',
};

// Phoneme category display names
export const PHONEME_CATEGORY_NAMES: Record<PhonemeCategory, string> = {
  short_vowel: 'Short Vowel',
  long_vowel: 'Long Vowel',
  consonant: 'Consonant',
  digraph: 'Digraph',
  blend: 'Blend',
  diphthong: 'Diphthong',
  r_controlled: 'R-Controlled',
};
