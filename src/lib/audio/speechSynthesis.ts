/**
 * Speech Synthesis (Text-to-Speech) utilities
 * Uses Web Speech API with preference for US English voices
 */

export interface SpeakOptions {
  rate?: number;         // 0.1 to 10, default 1
  pitch?: number;        // 0 to 2, default 1
  volume?: number;       // 0 to 1, default 1
  voice?: SpeechSynthesisVoice;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onWord?: (charIndex: number) => void;
}

class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private defaultVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();

      // Chrome loads voices async
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;

    this.voices = this.synth.getVoices();

    // Prefer US English voices for phonics
    const preferredVoices = [
      'Google US English',
      'Microsoft Zira',
      'Microsoft David',
      'Samantha',
      'Alex',
      'en-US',
    ];

    for (const preferred of preferredVoices) {
      const voice = this.voices.find(
        (v) =>
          v.name.includes(preferred) ||
          v.lang === preferred ||
          v.lang.startsWith('en-US')
      );
      if (voice) {
        this.defaultVoice = voice;
        break;
      }
    }

    // Fallback to any English voice
    if (!this.defaultVoice) {
      this.defaultVoice =
        this.voices.find((v) => v.lang.startsWith('en')) || this.voices[0];
    }
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter((v) => v.lang.startsWith('en'));
  }

  getDefaultVoice(): SpeechSynthesisVoice | null {
    return this.defaultVoice;
  }

  speak(text: string, options: SpeakOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        const error = 'Speech synthesis is not supported in this browser';
        options.onError?.(error);
        reject(new Error(error));
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);

      // Apply options
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      utterance.voice = options.voice ?? this.defaultVoice;

      // Event handlers
      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        const error = event.error || 'Speech synthesis error';
        options.onError?.(error);
        reject(new Error(error));
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          options.onWord?.(event.charIndex);
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  // Speak a phoneme (slower, clearer pronunciation)
  speakPhoneme(phoneme: string, options: SpeakOptions = {}): Promise<void> {
    return this.speak(phoneme, {
      rate: 0.7,
      pitch: 1,
      ...options,
    });
  }

  // Speak a word with optional emphasis
  speakWord(word: string, options: SpeakOptions = {}): Promise<void> {
    return this.speak(word, {
      rate: 0.85,
      ...options,
    });
  }

  // Speak a sentence at normal pace
  speakSentence(sentence: string, options: SpeakOptions = {}): Promise<void> {
    return this.speak(sentence, {
      rate: 0.95,
      ...options,
    });
  }

  // Speak with word-by-word callback for karaoke effect
  speakWithWordHighlight(
    text: string,
    onWordChange: (wordIndex: number) => void,
    options: SpeakOptions = {}
  ): Promise<void> {
    const words = text.split(/\s+/);
    let currentWordIndex = 0;

    return this.speak(text, {
      ...options,
      onWord: (charIndex) => {
        // Calculate which word we're at based on character index
        let charCount = 0;
        for (let i = 0; i < words.length; i++) {
          charCount += words[i].length + 1; // +1 for space
          if (charIndex < charCount) {
            if (i !== currentWordIndex) {
              currentWordIndex = i;
              onWordChange(i);
            }
            break;
          }
        }
      },
    });
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }

  isPaused(): boolean {
    return this.synth?.paused ?? false;
  }
}

// Singleton instance
export const speechSynthesis = new SpeechSynthesisService();

// Convenience functions
export const speak = (text: string, options?: SpeakOptions) =>
  speechSynthesis.speak(text, options);

export const speakPhoneme = (phoneme: string, options?: SpeakOptions) =>
  speechSynthesis.speakPhoneme(phoneme, options);

export const speakWord = (word: string, options?: SpeakOptions) =>
  speechSynthesis.speakWord(word, options);

export const stopSpeaking = () => speechSynthesis.stop();
