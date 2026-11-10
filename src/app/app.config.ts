import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { TestSeedService } from '@/core/services/test-seed.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    // Перед стартом: якщо тестів у localStorage немає — підвантажити з tests.json
    provideAppInitializer(() => inject(TestSeedService).seedIfEmpty()),
  ],
};
