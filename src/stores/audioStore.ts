import { create } from 'zustand';
import { speechSynthesis, SpeakOptions } from '@/lib/audio/speechSynthesis';
import { speechRecognition, RecognitionResult, PronunciationScore } from '@/lib/audio/speechRecognition';
import { audioRecorder, RecordingResult } from '@/lib/audio/audioRecorder';

interface AudioStore {
  // TTS State
  isSpeaking: boolean;
  currentText: string | null;
  speechRate: number;
  selectedVoice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];

  // Recording State
  isRecording: boolean;
  recordingDuration: number;
  currentRecording: RecordingResult | null;
  recordingVolume: number;

  // Recognition State
  isListening: boolean;
  transcript: string;
  confidence: number;
  recognitionResult: RecognitionResult | null;

  // Pronunciation Evaluation
  lastPronunciationScore: PronunciationScore | null;

  // Support flags
  ttsSupported: boolean;
  recognitionSupported: boolean;
  recordingSupported: boolean;

  // TTS Actions
  speak: (text: string, options?: SpeakOptions) => Promise<void>;
  speakPhoneme: (phoneme: string) => Promise<void>;
  speakWord: (word: string) => Promise<void>;
  stopSpeaking: () => void;
  setSpeechRate: (rate: number) => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  loadVoices: () => void;

  // Recording Actions
  startRecording: (maxDuration?: number) => Promise<void>;
  stopRecording: () => Promise<RecordingResult | null>;
  cancelRecording: () => void;
  playRecording: () => void;
  clearRecording: () => void;

  // Recognition Actions
  startListening: () => void;
  stopListening: () => void;
  evaluatePronunciation: (expected: string) => PronunciationScore | null;
  clearRecognition: () => void;

  // Combined Actions
  listenAndEvaluate: (expected: string, onResult: (score: PronunciationScore) => void) => void;
}

export const useAudioStore = create<AudioStore>()((set, get) => ({
  // Initial state
  isSpeaking: false,
  currentText: null,
  speechRate: 1.0,
  selectedVoice: null,
  availableVoices: [],

  isRecording: false,
  recordingDuration: 0,
  currentRecording: null,
  recordingVolume: 0,

  isListening: false,
  transcript: '',
  confidence: 0,
  recognitionResult: null,

  lastPronunciationScore: null,

  ttsSupported: typeof window !== 'undefined' && speechSynthesis.isSupported(),
  recognitionSupported: typeof window !== 'undefined' && speechRecognition.isSupported(),
  recordingSupported: typeof window !== 'undefined' && audioRecorder.isSupported(),

  // TTS Actions
  speak: async (text, options = {}) => {
    const { speechRate, selectedVoice } = get();

    set({ isSpeaking: true, currentText: text });

    try {
      await speechSynthesis.speak(text, {
        rate: speechRate,
        voice: selectedVoice ?? undefined,
        ...options,
        onEnd: () => {
          set({ isSpeaking: false, currentText: null });
          options.onEnd?.();
        },
        onError: (error) => {
          set({ isSpeaking: false, currentText: null });
          options.onError?.(error);
        },
      });
    } catch (error) {
      set({ isSpeaking: false, currentText: null });
      throw error;
    }
  },

  speakPhoneme: async (phoneme) => {
    const { speechRate, selectedVoice } = get();
    set({ isSpeaking: true, currentText: phoneme });

    try {
      await speechSynthesis.speakPhoneme(phoneme, {
        rate: Math.max(0.5, speechRate * 0.7),
        voice: selectedVoice ?? undefined,
      });
    } finally {
      set({ isSpeaking: false, currentText: null });
    }
  },

  speakWord: async (word) => {
    const { speechRate, selectedVoice } = get();
    set({ isSpeaking: true, currentText: word });

    try {
      await speechSynthesis.speakWord(word, {
        rate: speechRate * 0.85,
        voice: selectedVoice ?? undefined,
      });
    } finally {
      set({ isSpeaking: false, currentText: null });
    }
  },

  stopSpeaking: () => {
    speechSynthesis.stop();
    set({ isSpeaking: false, currentText: null });
  },

  setSpeechRate: (rate) => {
    set({ speechRate: rate });
  },

  setVoice: (voice) => {
    set({ selectedVoice: voice });
  },

  loadVoices: () => {
    const voices = speechSynthesis.getEnglishVoices();
    const defaultVoice = speechSynthesis.getDefaultVoice();
    set({
      availableVoices: voices,
      selectedVoice: defaultVoice,
    });
  },

  // Recording Actions
  startRecording: async (maxDuration = 10000) => {
    set({ isRecording: true, recordingDuration: 0, recordingVolume: 0 });

    // Track duration
    const startTime = Date.now();
    const durationInterval = setInterval(() => {
      if (get().isRecording) {
        set({ recordingDuration: Date.now() - startTime });
      } else {
        clearInterval(durationInterval);
      }
    }, 100);

    // Track volume
    audioRecorder.onVolumeChange((volume) => {
      set({ recordingVolume: volume });
    });

    return new Promise<void>((resolve, reject) => {
      audioRecorder.start(
        (result) => {
          clearInterval(durationInterval);
          set({
            isRecording: false,
            currentRecording: result,
            recordingVolume: 0,
          });
          resolve();
        },
        (error) => {
          clearInterval(durationInterval);
          set({ isRecording: false, recordingVolume: 0 });
          reject(new Error(error));
        },
        { maxDuration }
      );
    });
  },

  stopRecording: async () => {
    if (get().isRecording) {
      await audioRecorder.stop();
    }
    return get().currentRecording;
  },

  cancelRecording: () => {
    audioRecorder.cancel();
    set({ isRecording: false, recordingVolume: 0 });
  },

  playRecording: () => {
    const { currentRecording } = get();
    if (currentRecording) {
      const audio = new Audio(currentRecording.url);
      audio.play();
    }
  },

  clearRecording: () => {
    const { currentRecording } = get();
    if (currentRecording) {
      URL.revokeObjectURL(currentRecording.url);
    }
    set({ currentRecording: null, recordingDuration: 0 });
  },

  // Recognition Actions
  startListening: () => {
    set({
      isListening: true,
      transcript: '',
      confidence: 0,
      recognitionResult: null,
    });

    speechRecognition.start(
      (result) => {
        set({
          transcript: result.transcript,
          confidence: result.confidence,
          recognitionResult: result,
          isListening: !result.isFinal,
        });
      },
      (error) => {
        console.error('Recognition error:', error);
        set({ isListening: false });
      }
    );
  },

  stopListening: () => {
    speechRecognition.stop();
    set({ isListening: false });
  },

  evaluatePronunciation: (expected) => {
    const { transcript } = get();
    if (!transcript) return null;

    const score = speechRecognition.evaluatePronunciation(expected, transcript);
    set({ lastPronunciationScore: score });
    return score;
  },

  clearRecognition: () => {
    set({
      transcript: '',
      confidence: 0,
      recognitionResult: null,
      lastPronunciationScore: null,
    });
  },

  // Combined listen and evaluate
  listenAndEvaluate: (expected, onResult) => {
    set({
      isListening: true,
      transcript: '',
      confidence: 0,
      recognitionResult: null,
    });

    speechRecognition.start(
      (result) => {
        set({
          transcript: result.transcript,
          confidence: result.confidence,
          recognitionResult: result,
        });

        if (result.isFinal) {
          set({ isListening: false });
          const score = speechRecognition.evaluatePronunciation(expected, result.transcript);
          set({ lastPronunciationScore: score });
          onResult(score);
        }
      },
      (error) => {
        console.error('Recognition error:', error);
        set({ isListening: false });
      },
      {
        continuous: false,
        interimResults: true,
      }
    );
  },
}));
