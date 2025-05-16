import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full',
  },
  // {path: '**',redirectTo:'404',pathMatch:'full'},
  {
    path: 'welcome',
    loadComponent: () =>
      import('./core/auth/components/welcome-page/welcome-page.component'),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/components/login/login.component'),
    canActivate: [authGuard],
  },
  {
    path: 'register',
        loadComponent: () => import('./core/auth/components/register/register.component'),
        canActivate: [authGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component'),
    canActivate: [authGuard],
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('./features/profile/profile.component'),
    canActivate: [authGuard],
  },
  {
    path: 'saved',
    loadComponent: () => import('./features/saved-post/saved-post.component'),
    canActivate: [authGuard],
  },
  {
    path: 'comment/:postId',
    loadComponent: () => import('./shared/comment-post/comment-post.component'),
    canActivate: [authGuard],
  },
  {
    path: 'mensajes',
    loadComponent: () => import('./features/chat/chat.component'),
    canActivate: [authGuard],
  }
];
