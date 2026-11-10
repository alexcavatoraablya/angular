import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AnswerOptionEntity, QuestionEntity, TestEntity, TestSeed } from '@/features/tests/models';
import { TestStorageService } from './test-storage.service';

/** Початкові тести: якщо в localStorage тестів немає — завантажує їх із public/data/tests.json. */
@Service()
export class TestSeedService {
  static readonly url = 'data/tests.json';

  private readonly http = inject(HttpClient);
  private readonly storage = inject(TestStorageService);

  async seedIfEmpty(): Promise<void> {
    if (this.storage.hasTests()) return;
    try {
      const seeds = await firstValueFrom(this.http.get<TestSeed[]>(TestSeedService.url));
      seeds.forEach((seed) => this.storage.create(this.toEntity(seed)));
    } catch (e) {
      console.error('Не вдалося завантажити початкові тести', e);
    }
  }

  private toEntity(seed: TestSeed): TestEntity {
    const test = new TestEntity();
    test.title = seed.title;
    test.description = seed.description;
    test.timeLimitMinutes = seed.timeLimitMinutes;
    test.questions = seed.questions.map((qs) => {
      const q = new QuestionEntity();
      q.text = qs.text;
      q.points = qs.points;
      q.answerOptions = qs.answerOptions.map((os) => {
        const o = new AnswerOptionEntity();
        o.text = os.text;
        o.isCorrect = os.isCorrect;
        return o;
      });
      return q;
    });
    return test;
  }
}
