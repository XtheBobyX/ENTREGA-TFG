import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';

// Importar el interceptor JWT
 import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),{
    provide: HTTP_INTERCEPTORS,
    useFactory: jwtInterceptor,
    multi: true,
  }]
};
