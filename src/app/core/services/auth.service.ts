import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '@/features/auth/models/login-request.model';
import { RegisterRequest } from '@/features/auth/models/register-request.model';
import { AuthResponse } from '@/features/auth/models/auth-response.model';
import { TokenStorageService } from './token-storage.service';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private baseUrl = `${environment.apiUrl}/account`;

  login(data: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, data)
      .pipe(tap((res) => this.tokenStorage.save(res.accessToken)));
  }

  register(data: RegisterRequest) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, data)
      .pipe(tap((res) => this.tokenStorage.save(res.accessToken)));
  }

  logout() {
    this.tokenStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.get();
  }
}
