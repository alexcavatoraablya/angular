import type { AnswerOptionEntity } from './answer-option.entity';
import type { TestEntity } from './test.entity';

/** Питання тесту (аналог QuestionEntity). */
export class QuestionEntity {
  id = 0;

  /** Required, MaxLength(1000) */
  text = '';

  /** Порядок питання в тесті */
  orderIndex = 0;

  /** Range(1, 100) */
  points = 1;

  /** FK -> Tests.Id */
  testId = 0;

  /** Навігаційна властивість (у localStorage не зберігається) */
  test?: TestEntity;

  answerOptions: AnswerOptionEntity[] = [];
}
