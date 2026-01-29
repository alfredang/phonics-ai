/**
 * Audio Recording utilities
 * Uses MediaRecorder API for voice recording
 */

export interface RecordingOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  maxDuration?: number; // in milliseconds
}

export interface RecordingResult {
  blob: Blob;
  url: string;
  duration: number;
}

type RecordingCallback = (result: RecordingResult) => void;
type ErrorCallback = (error: string) => void;
type VolumeCallback = (volume: number) => void;

class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isRecording: boolean = false;
  private startTime: number = 0;
  private animationFrameId: number | null = null;
  private volumeCallback: VolumeCallback | null = null;

  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'MediaRecorder' in window &&
      'getUserMedia' in navigator.mediaDevices
    );
  }

  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop immediately, we just wanted permission
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  async start(
    onComplete: RecordingCallback,
    onError?: ErrorCallback,
    options?: RecordingOptions
  ): Promise<void> {
    if (this.isRecording) {
      await this.stop();
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine MIME type
      const mimeType =
        options?.mimeType ||
        (MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/ogg');

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: options?.audioBitsPerSecond ?? 128000,
      });

      this.audioChunks = [];
      this.startTime = Date.now();

      // Set up audio analysis for volume visualization
      this.setupAudioAnalysis();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const duration = Date.now() - this.startTime;
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);

        this.cleanup();

        onComplete({
          blob,
          url,
          duration,
        });
      };

      this.mediaRecorder.onerror = () => {
        this.cleanup();
        onError?.('Recording error occurred');
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;

      // Auto-stop after max duration
      if (options?.maxDuration) {
        setTimeout(() => {
          if (this.isRecording) {
            this.stop();
          }
        }, options.maxDuration);
      }
    } catch (error) {
      this.cleanup();
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        onError?.('Microphone access was denied. Please allow microphone access.');
      } else {
        onError?.('Failed to start recording. Please check your microphone.');
      }
    }
  }

  private setupAudioAnalysis() {
    if (!this.stream) return;

    try {
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      source.connect(this.analyser);

      // Start volume monitoring
      this.monitorVolume();
    } catch (error) {
      console.error('Audio analysis setup failed:', error);
    }
  }

  private monitorVolume() {
    if (!this.analyser || !this.isRecording) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate average volume (0-1)
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const volume = average / 255;

    this.volumeCallback?.(volume);

    this.animationFrameId = requestAnimationFrame(() => this.monitorVolume());
  }

  onVolumeChange(callback: VolumeCallback) {
    this.volumeCallback = callback;
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.addEventListener('stop', () => resolve(), { once: true });
        this.mediaRecorder.stop();
      } else {
        resolve();
      }
    });
  }

  cancel() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.audioChunks = [];
    }
    this.cleanup();
  }

  private cleanup() {
    this.isRecording = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.volumeCallback = null;
  }

  isActive(): boolean {
    return this.isRecording;
  }

  getDuration(): number {
    if (!this.isRecording) return 0;
    return Date.now() - this.startTime;
  }

  // Get the analyser node for external visualization
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }
}

// Singleton instance
export const audioRecorder = new AudioRecorderService();

// Utility to play back a recording
export function playRecording(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  audio.play();
  return audio;
}

// Utility to download a recording
export function downloadRecording(url: string, filename: string = 'recording.webm') {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
