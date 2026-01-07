import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Auth } from './services/auth';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login').then((mod) => mod.Login),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((mod) => mod.Dashboard),
    canActivate: [() => inject(Auth).isLoggedIn()],
  },
];
