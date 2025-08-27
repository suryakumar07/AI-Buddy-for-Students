
export interface BilingualContent {
  english: string;
  tamil: string;
}

export interface Flashcard {
  question: BilingualContent;
  answer: BilingualContent;
}

export interface MultipleChoiceQuestion {
  question: BilingualContent;
  options: BilingualContent[];
  correctAnswer: BilingualContent;
}

export interface ShortAnswerQuestion {
  question: BilingualContent;
}

export interface LongAnswerQuestion {
  question: BilingualContent;
}

export interface PracticeQuestions {
  multipleChoice: MultipleChoiceQuestion[];
  shortAnswer: ShortAnswerQuestion[];
  longAnswer: LongAnswerQuestion[];
}

export interface StudyGuideResponse {
  simpleExplanation: BilingualContent;
  flashcards: Flashcard[];
  practiceQuestions: PracticeQuestions;
  quickRevision: BilingualContent;
}

export type ChatMode = 'exam' | 'chat';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
