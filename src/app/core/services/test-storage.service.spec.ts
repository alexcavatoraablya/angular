import { TestBed } from '@angular/core/testing';
import { TestStorageService } from './test-storage.service';

describe('TestStorageService', () => {
  let service: TestStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
