import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private appUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.appUrl = environment.endpoint;
    this.apiUrl = 'api/usuarios';
  }

  // Obtener usuario por Username
  getUserByUsername(username: string) {
    const url = `${this.appUrl}${this.apiUrl}/${username}`;
    return this.http.get(url);
  }

  getUserById(id: any) {
    const url = `${this.appUrl}${this.apiUrl}/id/${id}`;
    return this.http.get(url);
  }

  // Actualizar usuario
  updateUser(id: string, datos: any) {
    // Actualizar base de datos
    const url = `${this.appUrl}${this.apiUrl}/${id}`;
    return this.http.put(url, datos);
  }

  //
  buscarUsuarios(busqueda: string | null) {
    let params = new HttpParams();
    if (busqueda) {
      params = params.set('query', busqueda);
    }
    return this.http.get<any[]>(`${this.appUrl}${this.apiUrl}/search`, {
      params,
    });
  }
}
