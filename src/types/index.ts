// Category identifier type
export type CategoryId = 'agile' | 'corporate' | 'tech' | 'jessingo';

// Category definition
export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  words: string[];
}

// Individual bingo square
export interface BingoSquare {
  id: string;
  word: string;
  isFilled: boolean;
  isAutoFilled: boolean;
  isFreeSpace: boolean;
  filledAt: number | null;
  row: number;
  col: number;
}

// Bingo card structure (5x5 grid)
export interface BingoCard {
  squares: BingoSquare[][];
  words: string[];
}

// Game status states
export type GameStatus = 'idle' | 'setup' | 'playing' | 'won';

// Winning line type
export type WinningLineType = 'row' | 'column' | 'diagonal';

// Winning line information
export interface WinningLine {
  type: WinningLineType;
  index: number;
  squares: BingoSquare[];
}

// Complete game state
export interface GameState {
  status: GameStatus;
  category: CategoryId | null;
  card: BingoCard | null;
  isListening: boolean;
  startedAt: number | null;
  completedAt: number | null;
  winningLine: WinningLine | null;
  winningWord: string | null;
  filledCount: number;
}

// Speech recognition state
export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

// Toast notification type
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast notification
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

// Speech recognition event types (for Web Speech API)
export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

// Web Speech API interface declaration
export interface IWebSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: new () => IWebSpeechRecognition;
    webkitSpeechRecognition: new () => IWebSpeechRecognition;
  }
}
