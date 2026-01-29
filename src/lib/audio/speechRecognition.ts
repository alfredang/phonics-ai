/**
 * Speech Recognition utilities
 * Uses Web Speech API for voice input
 */

export interface RecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: Array<{ transcript: string; confidence: number }>;
}

export interface PronunciationScore {
  overall: number;          // 0-100
  accuracy: number;         // How close to expected
  completeness: number;     // How much was recognized
  similarity: number;       // String similarity score
}

type RecognitionCallback = (result: RecognitionResult) => void;
type ErrorCallback = (error: string) => void;

class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private resultCallback: RecognitionCallback | null = null;
  private errorCallback: ErrorCallback | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const primary = result[0];

      const recognitionResult: RecognitionResult = {
        transcript: primary.transcript.toLowerCase().trim(),
        confidence: primary.confidence,
        isFinal: result.isFinal,
        alternatives: Array.from(result)
          .slice(1)
          .map((alt: any) => ({
            transcript: alt.transcript.toLowerCase().trim(),
            confidence: alt.confidence,
          })),
      };

      this.resultCallback?.(recognitionResult);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech was detected. Please try again.',
        'audio-capture': 'No microphone was found. Please check your device.',
        'not-allowed': 'Microphone permission was denied. Please allow access.',
        network: 'A network error occurred. Please check your connection.',
        aborted: 'Speech recognition was aborted.',
      };

      const message = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
      this.errorCallback?.(message);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  isActive(): boolean {
    return this.isListening;
  }

  start(
    onResult: RecognitionCallback,
    onError?: ErrorCallback,
    options?: RecognitionOptions
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    // Apply options
    if (options) {
      this.recognition.continuous = options.continuous ?? false;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.lang = options.lang ?? 'en-US';
      this.recognition.maxAlternatives = options.maxAlternatives ?? 3;
    }

    this.resultCallback = onResult;
    this.errorCallback = onError ?? null;

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      onError?.('Failed to start speech recognition');
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  // Evaluate pronunciation accuracy
  evaluatePronunciation(expected: string, actual: string): PronunciationScore {
    const expectedLower = expected.toLowerCase().trim();
    const actualLower = actual.toLowerCase().trim();

    // Exact match
    if (expectedLower === actualLower) {
      return {
        overall: 100,
        accuracy: 100,
        completeness: 100,
        similarity: 100,
      };
    }

    // Calculate Levenshtein distance for similarity
    const similarity = this.calculateSimilarity(expectedLower, actualLower);

    // Check completeness (how much of expected was captured)
    const expectedWords = expectedLower.split(/\s+/);
    const actualWords = actualLower.split(/\s+/);
    const matchedWords = expectedWords.filter((word) =>
      actualWords.some((actual) => this.calculateSimilarity(word, actual) > 0.8)
    );
    const completeness = (matchedWords.length / expectedWords.length) * 100;

    // Calculate accuracy based on word-level matching
    const accuracy = actualWords.length > 0
      ? (matchedWords.length / actualWords.length) * 100
      : 0;

    // Overall score (weighted average)
    const overall = similarity * 0.4 + completeness * 0.35 + accuracy * 0.25;

    return {
      overall: Math.round(overall),
      accuracy: Math.round(accuracy),
      completeness: Math.round(completeness),
      similarity: Math.round(similarity * 100),
    };
  }

  // Calculate string similarity (0-1) using Levenshtein distance
  private calculateSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1;
    if (s1.length === 0 || s2.length === 0) return 0;

    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= s1.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= s2.length; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const distance = matrix[s1.length][s2.length];
    const maxLength = Math.max(s1.length, s2.length);

    return 1 - distance / maxLength;
  }

  // Quick check if word sounds correct
  isWordCorrect(expected: string, actual: string, threshold: number = 0.75): boolean {
    const score = this.evaluatePronunciation(expected, actual);
    return score.overall >= threshold * 100;
  }
}

// Singleton instance
export const speechRecognition = new SpeechRecognitionService();
