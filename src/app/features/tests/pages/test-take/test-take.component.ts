import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AnswerOptionEntity,
  QuestionEntity,
  TestAttemptEntity,
  TestEntity,
} from '../../models';
import { TestStorageService } from '@/core/services/test-storage.service';

@Component({
  imports: [],
  selector: 'app-test-take',
  styleUrl: './test-take.component.css',
  templateUrl: './test-take.component.html',
})
export class TestTakeComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly storage = inject(TestStorageService);

  readonly test = signal<TestEntity | null>(null);
  readonly notFound = signal(false);
  readonly answers = signal<Record<number, number[]>>({});
  readonly result = signal<TestAttemptEntity | null>(null);
  readonly remaining = signal<number | null>(null);

  readonly answeredCount = computed(
    () => Object.values(this.answers()).filter((a) => a.length > 0).length,
  );

  readonly percent = computed(() => {
    const r = this.result();
    return r && r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0;
  });

  readonly timeLabel = computed(() => {
    const s = this.remaining();
    if (s === null) return '';
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  });

  private startedAt = new Date();
  private timerId?: ReturnType<typeof setInterval>;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const test = this.storage.getById(id);
    if (!test) {
      this.notFound.set(true);
      return;
    }
    this.test.set(test);
    this.start();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  isMultiple(q: QuestionEntity): boolean {
    return q.answerOptions.filter((o) => o.isCorrect).length > 1;
  }

  isSelected(q: QuestionEntity, o: AnswerOptionEntity): boolean {
    return (this.answers()[q.id] ?? []).includes(o.id);
  }

  isCorrect(q: QuestionEntity): boolean {
    return this.storage.isQuestionCorrect(q, this.answers()[q.id]);
  }

  select(q: QuestionEntity, o: AnswerOptionEntity): void {
    if (this.result()) return;
    const current = this.answers()[q.id] ?? [];
    let next: number[];
    if (this.isMultiple(q)) {
      next = current.includes(o.id) ? current.filter((id) => id !== o.id) : [...current, o.id];
    } else {
      next = [o.id];
    }
    this.answers.update((a) => ({ ...a, [q.id]: next }));
  }

  optionClass(q: QuestionEntity, o: AnswerOptionEntity): string {
    if (!this.result()) return 'border-gray-200 hover:bg-gray-50';
    const selected = this.isSelected(q, o);
    if (o.isCorrect) return 'border-emerald-400 bg-emerald-50';
    if (selected) return 'border-red-400 bg-red-50';
    return 'border-gray-200 opacity-70';
  }

  submit(timedOut = false): void {
    const test = this.test();
    if (!test || this.result()) return;
    this.stopTimer();
    const attempt = this.storage.evaluate(test, this.answers(), this.startedAt, timedOut);
    this.storage.saveAttempt(attempt);
    this.result.set(attempt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  restart(): void {
    this.answers.set({});
    this.result.set(null);
    this.start();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private start(): void {
    this.startedAt = new Date();
    this.stopTimer();

    const limit = this.test()?.timeLimitMinutes;
    if (!limit) {
      this.remaining.set(null);
      return;
    }

    this.remaining.set(limit * 60);
    this.timerId = setInterval(() => {
      const left = (this.remaining() ?? 0) - 1;
      this.remaining.set(Math.max(left, 0));
      if (left <= 0) this.submit(true);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
}
