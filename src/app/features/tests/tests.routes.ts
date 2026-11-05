import { Routes } from '@angular/router';

export const TESTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/test-list/test-list.component').then((m) => m.TestListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/test-create/test-create.component').then((m) => m.TestCreateComponent),
  },
  {
    path: ':id/take',
    loadComponent: () => import('./pages/test-take/test-take.component').then((m) => m.TestTakeComponent),
  },
];

