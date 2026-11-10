/** Формат файлу public/data/tests.json (без id — їх призначає TestStorageService). */
export interface AnswerOptionSeed {
  text: string;
  isCorrect: boolean;
}

export interface QuestionSeed {
  text: string;
  points: number;
  answerOptions: AnswerOptionSeed[];
}

export interface TestSeed {
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  questions: QuestionSeed[];
}

