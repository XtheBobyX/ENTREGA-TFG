import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../enviroments/environments';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private appUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.appUrl = environment.endpoint;
    this.apiUrl = 'api/usuarios';
  }

  registro(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.appUrl}${this.apiUrl}`, usuario);
  }

  login(usuario: Usuario): Observable<string> {
    return this.http.post<string>(
      `${this.appUrl}${this.apiUrl}/login`,
      usuario
    )
  }

   // Método para obtener el username del token JWT
   obtenerUsuarioUsernameToken(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      // Decodificar el token JWT
      const payload = this.decodeToken(token);
      // Retornar el id del usuario desde el payload del token
      return payload?.username || null;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }  // Método para obtener el userId del token JWT
   obtenerUsuarioIdToken(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      // Decodificar el token JWT
      const payload = this.decodeToken(token);
      // Retornar el id del usuario desde el payload del token
      return payload?.id || null;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }

  obtenerDatosUsuarioByUsernameBD(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.appUrl}${this.apiUrl}/${username}`);
  }
  
  // Método para decodificar el token JWT
  decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
    
    // Asegurarse de que la longitud sea válida para la decodificación Base64
    while (base64.length % 4) {
      base64 += '=';
    }

    const decodedPayload = atob(base64);
    return JSON.parse(decodedPayload);
  }

  obtenerDatosUsuarioToken(): Observable<any> { 
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }
    // Obtener datos del payload del token
    const payload = this.decodeToken(token);       
    const datosUsuario = {
      id: payload.id,
      username: payload.username,
      nombre_completo: payload.nombre_completo,
      url_imagen_perfil: payload.url_imagen_perfil || 'assets/placeholder.png',
    };
    return of(datosUsuario);
  }
  /**
   * Devuelve el token almacenado en el localStorage
   * @returns  {string | null} token
   * @description Si no hay token almacenado, devuelve null.
   */

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Almacena el token en el localStorage
   * @param token {string} token
   * @description Almacena el token en el localStorage.
   */

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  deleteToken(): void {
    localStorage.removeItem('token');
  }



  logout() {
   this.deleteToken();
    window.location.href = '/login';
  }

  actualizarDatos(){
    this.obtenerDatosUsuarioToken().subscribe((data:any) => {
      const username = data.username;
      this.obtenerDatosUsuarioByUsernameBD(username).subscribe((data) => {
        const nombreCompleto = data.nombre_completo || username;
        const avatarPerfil = data.url_imagen_perfil || 'assets/placeholder.png';
      });
    });
  }

}
