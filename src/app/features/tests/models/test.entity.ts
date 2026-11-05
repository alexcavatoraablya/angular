import type { QuestionEntity } from './question.entity';

/** Тест (аналог TestEntity). */
export class TestEntity {
  id = 0;

  /** Required, MaxLength(200) */
  title = '';

  /** MaxLength(1000) */
  description?: string;

  createdAt: Date = new Date();

  /** Ліміт часу в хвилинах, Range(1, 600), необов'язково */
  timeLimitMinutes?: number;

  questions: QuestionEntity[] = [];
}
