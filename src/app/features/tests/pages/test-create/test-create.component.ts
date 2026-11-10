import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnswerOptionEntity, QuestionEntity, TestEntity } from '../../models';
import { TestStorageService } from '@/core/services/test-storage.service';

/** Хоча б один правильний варіант. */
function atLeastOneCorrect(control: AbstractControl): ValidationErrors | null {
  const options = (control.value ?? []) as { isCorrect: boolean }[];
  return options.some((o) => o.isCorrect) ? null : { noCorrect: true };
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-test-create',
  styleUrl: './test-create.component.css',
  templateUrl: './test-create.component.html',
})
export class TestCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly storage = inject(TestStorageService);
  private readonly router = inject(Router);

  readonly submitted = signal(false);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    timeLimitMinutes: this.fb.control<number | null>(null, [
      Validators.min(1),
      Validators.max(600),
    ]),
    questions: this.fb.array<FormGroup>([], [Validators.minLength(1)]),
  });

  constructor() {
    this.addQuestion();
  }

  get questions(): FormArray<FormGroup> {
    return this.form.controls.questions;
  }

  optionsOf(question: FormGroup): FormArray<FormGroup> {
    return question.get('options') as FormArray<FormGroup>;
  }

  controlOf(group: AbstractControl, name: string): AbstractControl {
    return group.get(name)!;
  }

  invalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  addQuestion(): void {
    this.questions.push(
      this.fb.group({
        text: ['', [Validators.required, Validators.maxLength(1000)]],
        points: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
        options: this.fb.array<FormGroup>(
          [this.newOption(), this.newOption()],
          [Validators.minLength(2), atLeastOneCorrect],
        ),
      }) as FormGroup,
    );
  }

  removeQuestion(index: number): void {
    if (this.questions.length > 1) this.questions.removeAt(index);
  }

  addOption(question: FormGroup): void {
    this.optionsOf(question).push(this.newOption());
  }

  removeOption(question: FormGroup, index: number): void {
    const options = this.optionsOf(question);
    if (options.length > 2) options.removeAt(index);
  }

  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const test = new TestEntity();
    test.title = value.title!.trim();
    test.description = value.description?.trim() || undefined;
    test.timeLimitMinutes = value.timeLimitMinutes ?? undefined;

    test.questions = value.questions.map((qv: any) => {
      const q = new QuestionEntity();
      q.text = String(qv.text).trim();
      q.points = Number(qv.points);
      q.answerOptions = qv.options.map((ov: any) => {
        const o = new AnswerOptionEntity();
        o.text = String(ov.text).trim();
        o.isCorrect = !!ov.isCorrect;
        return o;
      });
      return q;
    });

    this.storage.create(test);
    this.router.navigate(['/tests']);
  }

  private newOption(): FormGroup {
    return this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]],
      isCorrect: [false],
    }) as FormGroup;
  }
}

