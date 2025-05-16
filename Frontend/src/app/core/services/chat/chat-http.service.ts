import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatHttpService {
  private appUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.appUrl = environment.endpoint;
    this.apiUrl = 'api/mensajes';
  }

  getConversaciones(idUsuario: any) {
    const url = `${this.appUrl}${this.apiUrl}/conversaciones/${idUsuario}`;
    return this.http.get(url);
  }
  getMensajes(usuario1: string, usuario2: string): Observable<any> {
    return this.http.post<any>(`${this.appUrl}${this.apiUrl}/mensajes`, {
      usuario1,
      usuario2,
    });
  }

  enviarMensaje(mensaje: any) {
    const url = `${this.appUrl}${this.apiUrl}/enviar`;
    return this.http.post(url, mensaje );
  }
}
