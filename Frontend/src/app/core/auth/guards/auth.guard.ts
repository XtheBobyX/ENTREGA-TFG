import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token !== null && (state.url === '/login' || state.url === '/register' || state.url === '/welcome' || state.url === '/')) {
    console.log('Token encontrado, redirigiendo a /home');
    router.navigate(['/home']);
    return false;
  }
  
  if(token == null && ( state.url != '/login' && state.url != '/register')){
    console.log('Token no encontrado, redirigiendo a /login');
    if (state.url !== '/login' ) {
      router.navigate(['/login']);
    }
    return false;
  }
  return true;
};
