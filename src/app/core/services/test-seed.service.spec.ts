import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestSeedService } from './test-seed.service';
import { TestStorageService } from './test-storage.service';
import { TestEntity, TestSeed } from '@/features/tests/models';

const SEED: TestSeed[] = [
  {
    title: 'Тест 1',
    questions: [
      {
        text: 'Питання',
        points: 2,
        answerOptions: [
          { text: 'Так', isCorrect: true },
          { text: 'Ні', isCorrect: false },
        ],
      },
    ],
  },
];

describe('TestSeedService', () => {
  let service: TestSeedService;
  let storage: TestStorageService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TestSeedService);
    storage = TestBed.inject(TestStorageService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('завантажує тести з JSON, якщо localStorage порожній', async () => {
    const done = service.seedIfEmpty();
    http.expectOne(TestSeedService.url).flush(SEED);
    await done;

    const tests = storage.getAll();
    expect(tests.length).toBe(1);
    const q = tests[0].questions[0];
    expect(q.testId).toBe(tests[0].id);
    expect(q.answerOptions.every((o) => o.questionId === q.id)).toBe(true);
  });

  it('не робить запит, якщо тести вже є', async () => {
    const existing = new TestEntity();
    existing.title = 'Вже є';
    storage.create(existing);

    await service.seedIfEmpty();

    http.expectNone(TestSeedService.url);
    expect(storage.getAll().length).toBe(1);
  });

  it('не падає при помилці завантаження', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const done = service.seedIfEmpty();
    http.expectOne(TestSeedService.url).flush(null, { status: 404, statusText: 'Not Found' });
    await done;

    expect(storage.hasTests()).toBe(false);
  });
});

