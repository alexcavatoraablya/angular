/** Спроба проходження тесту. Зберігається в localStorage. */
export class TestAttemptEntity {
  id = 0;

  testId = 0;

  startedAt: Date = new Date();

  finishedAt: Date = new Date();

  /** Набрані бали */
  score = 0;

  /** Максимум балів у тесті */
  maxScore = 0;

  /** Завершено через вичерпання часу */
  timedOut = false;

  /** questionId -> id обраних варіантів */
  answers: Record<number, number[]> = {};
}
