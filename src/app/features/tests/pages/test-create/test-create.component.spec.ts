import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCreateComponent } from './test-create.component';

describe('TestCreateComponent', () => {
  let component: TestCreateComponent;
  let fixture: ComponentFixture<TestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
