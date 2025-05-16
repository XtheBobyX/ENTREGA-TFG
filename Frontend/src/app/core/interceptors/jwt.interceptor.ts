import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  //Obtener el token del localStorage
  const token = localStorage.getItem('token');

  if(token) {
    // Clonar la petición y agregar el token al header Authorization
    // Se utiliza el método clone() para crear una copia de la petición original y agregarle el token al header Authorization.
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Se envía la petición clonada al siguiente interceptor o al servidor.
    console.log('Solicitud con token:', cloned); // Muestra la solicitud modificada

    return next(cloned);
  }
  // Si no hay token, se envía la petición original al siguiente interceptor o al servidor.
  return next(req);
};

