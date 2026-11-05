import { Service } from '@angular/core';
import { AnswerOptionEntity,
  QuestionEntity,
  TestAttemptEntity,
  TestEntity } from '@/features/tests/models';

type SeqName = 'test' | 'question' | 'option' | 'attempt';

@Service()
export class TestStorageService {
  private readonly testsKey = 'testhub.tests';
  private readonly attemptsKey = 'testhub.attempts';
  private readonly seqKey = 'testhub.seq';

  // ---------- Тести ----------

  getAll(): TestEntity[] {
    return this.read<unknown[]>(this.testsKey, [])
      .map((raw) => this.reviveTest(raw))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getById(id: number): TestEntity | undefined {
    return this.getAll().find((t) => t.id === id);
  }

  /** Створює тест: призначає id, зв'язки та порядок. */
  create(test: TestEntity): TestEntity {
    test.id = this.nextId('test');
    test.createdAt = new Date();

    test.questions.forEach((q, qi) => {
      q.id = this.nextId('question');
      q.testId = test.id;
      q.orderIndex = qi;
      q.answerOptions.forEach((o, oi) => {
        o.id = this.nextId('option');
        o.questionId = q.id;
        o.orderIndex = oi;
      });
    });

    const all = this.read<unknown[]>(this.testsKey, []);
    all.push(test);
    this.write(this.testsKey, all);
    return test;
  }

  delete(id: number): void {
    const tests = this.read<TestEntity[]>(this.testsKey, []).filter((t) => t.id !== id);
    this.write(this.testsKey, tests);

    const attempts = this.read<TestAttemptEntity[]>(this.attemptsKey, []).filter(
      (a) => a.testId !== id,
    );
    this.write(this.attemptsKey, attempts);
  }

  // ---------- Спроби ----------

  getAttempts(testId?: number): TestAttemptEntity[] {
    return this.read<unknown[]>(this.attemptsKey, [])
      .map((raw) => this.reviveAttempt(raw))
      .filter((a) => testId === undefined || a.testId === testId)
      .sort((a, b) => b.finishedAt.getTime() - a.finishedAt.getTime());
  }

  saveAttempt(attempt: TestAttemptEntity): TestAttemptEntity {
    attempt.id = this.nextId('attempt');
    const all = this.read<unknown[]>(this.attemptsKey, []);
    all.push(attempt);
    this.write(this.attemptsKey, all);
    return attempt;
  }

  // ---------- Перевірка ----------

  /** Питання зараховується, якщо обрано рівно всі правильні варіанти. */
  isQuestionCorrect(question: QuestionEntity, selected: number[] = []): boolean {
    const correct = question.answerOptions.filter((o) => o.isCorrect).map((o) => o.id);
    return correct.length === selected.length && correct.every((id) => selected.includes(id));
  }

  evaluate(
    test: TestEntity,
    answers: Record<number, number[]>,
    startedAt: Date,
    timedOut = false,
  ): TestAttemptEntity {
    const attempt = new TestAttemptEntity();
    attempt.testId = test.id;
    attempt.startedAt = startedAt;
    attempt.finishedAt = new Date();
    attempt.timedOut = timedOut;
    attempt.answers = answers;
    attempt.maxScore = test.questions.reduce((sum, q) => sum + q.points, 0);
    attempt.score = test.questions.reduce(
      (sum, q) => sum + (this.isQuestionCorrect(q, answers[q.id]) ? q.points : 0),
      0,
    );
    return attempt;
  }

  // ---------- Внутрішнє ----------

  private nextId(name: SeqName): number {
    const seq = this.read<Record<SeqName, number>>(this.seqKey, {
      test: 0,
      question: 0,
      option: 0,
      attempt: 0,
    });
    seq[name] = (seq[name] ?? 0) + 1;
    this.write(this.seqKey, seq);
    return seq[name];
  }

  private reviveTest(raw: any): TestEntity {
    const test = Object.assign(new TestEntity(), raw) as TestEntity;
    test.createdAt = new Date(raw.createdAt);
    test.questions = ((raw.questions ?? []) as any[])
      .map((rq) => {
        const q = Object.assign(new QuestionEntity(), rq) as QuestionEntity;
        q.answerOptions = ((rq.answerOptions ?? []) as any[])
          .map((ro) => Object.assign(new AnswerOptionEntity(), ro) as AnswerOptionEntity)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        return q;
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
    return test;
  }

  private reviveAttempt(raw: any): TestAttemptEntity {
    const attempt = Object.assign(new TestAttemptEntity(), raw) as TestAttemptEntity;
    attempt.startedAt = new Date(raw.startedAt);
    attempt.finishedAt = new Date(raw.finishedAt);
    return attempt;
  }

  private read<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Не вдалося зберегти в localStorage', e);
    }
  }
}
 
