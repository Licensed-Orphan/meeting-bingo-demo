import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SpeechRecognitionState,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  IWebSpeechRecognition,
} from '../types';

/**
 * Get the SpeechRecognition constructor
 * Handles browser prefixes (standard and webkit)
 */
const getSpeechRecognition = (): (new () => IWebSpeechRecognition) | null => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

/**
 * Custom hook for Web Speech API integration
 * Provides speech recognition functionality with automatic restart and error handling
 *
 * @returns Speech recognition state and control functions
 */
export function useSpeechRecognition() {
  const SpeechRecognition = getSpeechRecognition();

  const [state, setState] = useState<SpeechRecognitionState>({
    isSupported: !!SpeechRecognition,
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  // Refs for mutable values that persist across renders
  const recognitionRef = useRef<IWebSpeechRecognition | null>(null);
  const onResultCallbackRef = useRef<((transcript: string) => void) | null>(null);
  const shouldBeListeningRef = useRef<boolean>(false);

  // Initialize the speech recognition instance
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    // Configure recognition settings
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Get results while still speaking
    recognition.lang = 'en-US';

    // Handle speech recognition results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      // Process results starting from the latest result index
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      // Update state with new transcript data
      setState((prev) => ({
        ...prev,
        transcript: prev.transcript + final,
        interimTranscript: interim,
      }));

      // Call the result callback with final transcript if provided
      if (final && onResultCallbackRef.current) {
        onResultCallbackRef.current(final);
      }
    };

    // Handle recognition errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't treat 'aborted' as an error - it's expected when stopping
      if (event.error === 'aborted') {
        return;
      }

      setState((prev) => ({
        ...prev,
        error: event.error,
        isListening: false,
      }));

      shouldBeListeningRef.current = false;
    };

    // Handle recognition end - auto-restart if still supposed to be listening
    recognition.onend = () => {
      if (shouldBeListeningRef.current) {
        // Small delay before restarting to prevent rapid restart loops
        setTimeout(() => {
          if (shouldBeListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Recognition might already be running or in a bad state
              console.warn('Failed to restart speech recognition:', e);
            }
          }
        }, 100);
      } else {
        setState((prev) => ({
          ...prev,
          isListening: false,
        }));
      }
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      shouldBeListeningRef.current = false;
      try {
        recognition.stop();
      } catch (e) {
        // Ignore errors during cleanup
      }
    };
  }, [SpeechRecognition]);

  /**
   * Start listening for speech
   * @param onResult - Optional callback called with each final transcript segment
   */
  const startListening = useCallback((onResult?: (transcript: string) => void) => {
    if (!recognitionRef.current) return;

    onResultCallbackRef.current = onResult || null;
    shouldBeListeningRef.current = true;

    setState((prev) => ({
      ...prev,
      isListening: true,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));

    try {
      recognitionRef.current.start();
    } catch (e) {
      // Recognition might already be running
      console.warn('Failed to start speech recognition:', e);
    }
  }, []);

  /**
   * Stop listening for speech
   */
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    shouldBeListeningRef.current = false;

    setState((prev) => ({
      ...prev,
      isListening: false,
    }));

    try {
      recognitionRef.current.stop();
    } catch (e) {
      // Recognition might not be running
      console.warn('Failed to stop speech recognition:', e);
    }

    onResultCallbackRef.current = null;
  }, []);

  /**
   * Reset the transcript without stopping recognition
   */
  const resetTranscript = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
    }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useSpeechRecognition;
