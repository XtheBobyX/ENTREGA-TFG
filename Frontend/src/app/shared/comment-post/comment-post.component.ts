import { Component } from '@angular/core';
import { PostService } from '../../core/services/post/post.service';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { FormsModule } from '@angular/forms';
import { PostSocketService } from '../../core/services/post/post-socket.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-comment-post',
  standalone: true,
  imports: [PostComponent, CommonModule, CommentComponent, FormsModule],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
})
export default class CommentPostComponent {
  listadoPosts: any[] = [];
  listadoComentarios: any[] = [];

  avatar = 'assets/placeholder.png';
  contenidoComentario = '';

  usuarioActual: any = {};

  constructor(
    private _postService: PostService,
    private _authService: AuthService,
    private _postSocket: PostSocketService
  ) {}

  ngOnInit(): void {
    this._authService.obtenerDatosUsuarioToken().subscribe((data: any) => {
      const username = data.username;
      console.log(username);
      this._authService
        .obtenerDatosUsuarioByUsernameBD(username)
        .subscribe((usuario: any) => {
          this.avatar =
            usuario.usuario.url_imagen_perfil || 'assets/placeholder.png';
          this.usuarioActual = usuario;
        });
    });

    // Obtener el ID del post de la URL
    const url = window.location.href;
    const idPost = url.split('/').pop();
    // Realizar la llamada a la API para obtener el post
    this._postService.getPostByID(idPost).subscribe((data: any) => {
      this.listadoPosts = data;
    });
    // Realizar la llamada a la API para obtener los comentarios del post
    this._postService.verComentarios(idPost).subscribe((data: any) => {
      this.listadoComentarios = data.reverse();
      console.log(data);
    });

    this._postSocket.recibirComentario().subscribe((data) => {
      if (String(data.post_id) === String(idPost)) {
        this.listadoComentarios.unshift(data);
      }

      console.log(data);
    });
  }

  publicarComentario(comentario: string) {
    const url = window.location.href;
    const idPost = url.split('/').pop();
    const idUsuario = this._authService.obtenerUsuarioIdToken();

    if (!comentario) {
      alert('El comentario no puede estar vacío');
      return;
    }

    const nuevoComentario = comentario.trim();
    if (idUsuario == null) return;

    this._postService
      .comentarPost(idPost, idUsuario, nuevoComentario)
      .subscribe((data: any) => {
        this.listadoComentarios.reverse();
        this.contenidoComentario = '';
        console.log(this.usuarioActual.usuario.url_imagen_perfil);
        const comentarioConUsuario = {
          id_comentario: data.id_comentario,
          contenido: nuevoComentario,
          id_usuario: idUsuario,
          post_id: idPost,
          fecha: new Date(),
          usuario: {
            id_usuario: this.usuarioActual.usuario.id_usuario,
            nombre_completo:
              this.usuarioActual.usuario.nombre_completo ||
              this.usuarioActual.usuario.username,
            username: this.usuarioActual.usuario.username,
            url_imagen_perfil: this.usuarioActual.usuario.url_imagen_perfil,
          },
        };

        this._postSocket.enviarComentario(comentarioConUsuario);
      });
  }
}
