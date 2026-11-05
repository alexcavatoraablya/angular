import type { QuestionEntity } from './question.entity';

/** Варіант відповіді на питання (аналог AnswerOptionEntity). */
export class AnswerOptionEntity {
  id = 0;

  /** Required, MaxLength(500) */
  text = '';

  isCorrect = false;

  /** Порядок варіанта в питанні */
  orderIndex = 0;

  /** FK -> Questions.Id */
  questionId = 0;

  /** Навігаційна властивість (у localStorage не зберігається) */
  question?: QuestionEntity;
}
