import { Service } from '@angular/core';

const TOKEN_KEY = 'access_token';

@Service()
export class TokenStorageService {
  save(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
