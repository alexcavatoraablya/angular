import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestAttemptEntity, TestEntity } from "../../models";
import { TestStorageService } from '@/core/services/test-storage.service';

interface TestListItem {
  test: TestEntity;
  totalPoints: number;
  best?: TestAttemptEntity;
}

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-test-list',
  styleUrl: './test-list.component.css',
  templateUrl: './test-list.component.html',
})
export class TestListComponent {
  private readonly storage = inject(TestStorageService);

  readonly items = signal<TestListItem[]>([]);

  constructor() {
    this.load();
  }

  remove(test: TestEntity): void {
    if (!confirm(`Видалити тест «${test.title}»?`)) return;
    this.storage.delete(test.id);
    this.load();
  }

  private load(): void {
    const attempts = this.storage.getAttempts();
    this.items.set(
      this.storage.getAll().map((test) => ({
        test,
        totalPoints: test.questions.reduce((s, q) => s + q.points, 0),
        best: attempts.filter((a) => a.testId === test.id).sort((a, b) => b.score - a.score)[0],
      })),
    );
  }
}

