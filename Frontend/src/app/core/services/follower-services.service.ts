import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environments';

@Injectable({
  providedIn: 'root',
})
export class FollowerService {
  private appUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.appUrl = environment.endpoint;
    this.apiUrl = 'api/toggle-follow';
  }

  toggleFollow(userIdSeguido: string, userIdSeguidor: string) {
    const url = `${this.appUrl}${this.apiUrl}/${userIdSeguido}`;
    return this.http.post(url,{userIdSeguidor});
  }

  verificarFollow(idSeguidor: string, idSeguido: string) {
    return this.http.get(`${this.appUrl}${this.apiUrl}/follow-status/${idSeguidor}/${idSeguido}`);
  }

  getSeguidores(id:string | undefined){
    const url = `${this.appUrl}${this.apiUrl}/numSeguidores/${id}`;
    return this.http.get(url);

  }

  getSeguidos(id:string | undefined){
    const url = `${this.appUrl}${this.apiUrl}/numSeguidos/${id}`;
    return this.http.get(url);
  }

  topSeguidores(){
    const url = `${this.appUrl}${this.apiUrl}/topSeguidores`;
    return this.http.get(url);
  }
  
}
