import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/environments';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private appUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.appUrl = environment.endpoint;
    this.apiUrl = 'api/posts';
  }

  getPosts() {
    return this.http.get(`${this.appUrl}${this.apiUrl}`);
  }

  // Obtener post de un usuario por Username
  getPostByUsername(username: string) {
    const url = `${this.appUrl}${this.apiUrl}?username=${username}`;
    return this.http.get(url);
  }

  getPostByID(id: string | undefined) {
    return this.http.get<Post[]>(`${this.appUrl}${this.apiUrl}/${id}`);
  }

  createPost(post: any) {
    return this.http.post(`${this.appUrl}${this.apiUrl}`, post);
  }

  toggleLike(postId: number, userId: number) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/like`;
    return this.http.post(url, { userId });
  }

  getLikes(postId: number, userId: number) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/likes?userId=${userId}`;
    return this.http.get(url);
  }

  getPostGuardado(postId: number, userId: number) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/guardados?userId=${userId}`;
    return this.http.get(url);
  }

  getNumberComments(postId: number | string | undefined) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/numberComments`;
    return this.http.get(url);
  }
  getRepost(postId: number) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/reposts`;
    return this.http.get(url);
  }

  toggleGuardarPost(postId: number, userId: number) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/guardar`;
    return this.http.post(url, { userIdSeguidor: userId });
  }

  getSavedPosts(userId: number | undefined) {
    const url = `${this.appUrl}${this.apiUrl}/saved/${userId}`;
    return this.http.get(url);
  }

  comentarPost(
    postId: number | string | undefined,
    userId: number,
    comentario: string
  ) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/comment`;
    return this.http.post(url, { userId, comentario });
  }

  verComentarios(postId: any) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/comments`;
    return this.http.get(url);
  }

  guardarSeleccionEncuesta(
    postId: any,
    userId: number,
    seleccion: number,
    multiple: boolean
  ) {
    const url = `${this.appUrl}${this.apiUrl}/${postId}/encuesta/votar`;
    return this.http.post(url, { userId, seleccion, multiple });
  }

  obtenerEncuestaConVotos(encuestaId: number, userId: number) {
    const url = `${this.appUrl}${this.apiUrl}/encuestas/${encuestaId}?userId=${userId}`;
    return this.http.get(url);
  }

  getTendencies() {
    const url = `${this.appUrl}${this.apiUrl}/tendencias/actual`;
    return this.http.get(url);
  }
}
