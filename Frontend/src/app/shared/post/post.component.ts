import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Usuario } from '../../core/models/usuario.model';
import { Multimedia } from '../../core/models/multimedia.model';
import { Encuesta } from '../../core/models/encuesta.model';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../core/services/post/post.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { PostSocketService } from '../../core/services/post/post-socket.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  menuAbierto: boolean = false;
  //
  seleccion: number | null = null;
  seleccionMultiple: number[] = [];

  // USUARIO
  usuario: Usuario = {
    username: '',
    nombre_completo: '',
    url_imagen_perfil: 'assets/placeholder.png',
  };
  // POSTS
  @Input() post: any = {
    post_id: 0,
    id_usuario: 0,
    contenido: '',
    is_repost: false,
    created_at: '',
    updated_at: '',
  };

  imagenes: Multimedia = {
    post_id: 0,
    id_usuario: 0,
    tipo_archivo: '',
    url_archivo: '',
  };

  encuesta: Encuesta = {
    id_encuesta: 0,
    post_id: 0,
    titulo: '',
    multiple_opciones: false,
  };

  opcionesEncuesta: any = [];

  listadoImagenes: any = [];

  tiempoPublicacion: string = '';

  datosPost: any = {
    numeroLikes: '',
    numeroComentarios: '',
    numeroRepost: '',
  };
  // Interacciones post
  haveLike: boolean = false;
  haveSave: boolean = false;

  constructor(
    private _postService: PostService,
    private _authService: AuthService,
    private _postSocket: PostSocketService
  ) {}
  ngOnInit(): void {
    // Si el post es el actual, actualiza likes

    this._postSocket.recibirToggleLike().subscribe((data) => {
      console.log(data);
      if (data && data.postId === this.post.post_id) {
        this.obtenerNumeroLikes(data.postId, this.obtenerIdUsuarioActual());
      }
    });
    //
    this._postSocket.recibirComentario().subscribe((data) => {
      console.log(data);
      if (data && data.post_id === this.post.post_id) {
        this.obtenerNumeroComentarios(data.post_id);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'] && this.post?.usuario) {
      this.usuario.username = this.post.usuario.username;
      this.usuario.nombre_completo =
        this.post.usuario.nombre_completo || this.post.usuario.username;
      this.usuario.url_imagen_perfil =
        this.post.usuario.url_imagen_perfil || 'assets/placeholder.png';

      // Multimedia
      if (Array.isArray(this.post.Multimedia)) {
        this.listadoImagenes = [...this.post.Multimedia];
      }

      // Encuesta
      if (Array.isArray(this.post.Encuesta) && this.post.Encuesta.length > 0) {
        const encuesta = this.post.Encuesta[0];
        this.encuesta.id_encuesta = encuesta.id_encuesta;
        this.encuesta.post_id = encuesta.post_id;
        this.encuesta.titulo = encuesta.titulo;
        this.encuesta.multiple_opciones = encuesta.multiple_opciones;
        this.opcionesEncuesta = [...encuesta.OpcionEncuesta];
      }

      // Interacciones
      const idUsuarioActual = this.obtenerIdUsuarioActual();
      this.obtenerNumeroLikes(this.post.post_id, idUsuarioActual);
      this.obtenerNumeroRepost(this.post.post_id);
      this.obtenerPostGuardado(this.post.post_id, idUsuarioActual);
      if (this.encuesta.id_encuesta)
        this.obtenerEncuestaVotos(this.encuesta.id_encuesta, idUsuarioActual);

      // Tiempo de publicación
      this.iniciarActualizacionTiempo();
    }
  }

  obtenerNumeroLikes(idPost: number, idUsuario: number) {
    this._postService.getLikes(idPost, idUsuario).subscribe((data: any) => {
      this.datosPost.numeroLikes = data.likes;
      this.haveLike = data.liked;
    });
  }
  obtenerNumeroComentarios(idPost: number) {
    this._postService.getNumberComments(idPost).subscribe((data: any) => {
      console.log(data);
      this.datosPost.numeroComentarios = data.comments;
    });
  }
  obtenerNumeroRepost(idPost: number) {
    this._postService.getRepost(idPost).subscribe((data: any) => {
      this.datosPost.numeroRepost = data.repost;
    });
  }

  obtenerPostGuardado(idPost: number, idUsuario: number) {
    this._postService
      .getPostGuardado(idPost, idUsuario)
      .subscribe((data: any) => {
        this.haveSave = data.saved;
      });
  }

  obtenerIdUsuarioActual() {
    const id = this._authService.obtenerUsuarioIdToken();
    if (id != null) return id;
    return 0;
  }

  obtenerEncuestaVotos(idEncuesta: any, userId: number) {
    this._postService
      .obtenerEncuestaConVotos(idEncuesta, userId)
      .subscribe((data: any) => {
        if (this.encuesta.multiple_opciones) {
          this.seleccionMultiple = data.votos_usuario;
        } else {
          this.seleccion = data.votos_usuario[0] || null;
        }
      });
  }

  iniciarActualizacionTiempo() {
    const actualizar = () => {
      this.tiempoPublicacion = this.calcularTiempoPublicacion(
        this.post.created_at
      );

      const fechaPost = new Date(this.post.created_at);
      const ahora = new Date();
      const diffSegundos = Math.floor(
        (ahora.getTime() - fechaPost.getTime()) / 1000
      );

      let intervalo: number;

      if (diffSegundos < 60) {
        intervalo = 10 * 1000; // cada 10 segundos
      } else if (diffSegundos < 3600) {
        intervalo = 60 * 1000; // cada 1 minuto
      } else if (diffSegundos < 86400) {
        intervalo = 5 * 60 * 1000; // cada 5 minutos
      } else {
        intervalo = 60 * 60 * 1000; // cada hora
      }

      setTimeout(actualizar, intervalo);
    };

    actualizar();
  }
  //Metodo para calcular el tiempo de publicación
  calcularTiempoPublicacion(fechaPublicacion: string): string {
    const fechaActual = new Date();
    const fechaPost = new Date(fechaPublicacion);
    const diferencia = Math.abs(fechaActual.getTime() - fechaPost.getTime());
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `· Hace ${dias} día${dias > 1 ? 's' : ''}`;
    } else if (horas > 0) {
      return `· Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (minutos > 0) {
      return `· Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    } else {
      return `· Hace ${segundos} segundos`;
    }
  }

  //
  cambiarEstadoRadio(opcion: any) {
    this.seleccion = opcion;
    const usuarioId = this.obtenerIdUsuarioActual();

    if (usuarioId) {
      this._postService
        .guardarSeleccionEncuesta(
          this.encuesta.id_encuesta,
          usuarioId,
          opcion,
          false
        )
        .subscribe(() => {
          console.log('Voto registrado en encuesta única');
        });
    }
  }

  cambiarEstadoCheckbox(opcion: any) {
    const index = this.seleccionMultiple.indexOf(opcion);
    const usuarioId = this.obtenerIdUsuarioActual();
    // Si la opción no está seleccionada, la agregamos; si ya está, la eliminamos
    if (index === -1) {
      this.seleccionMultiple.push(opcion);
    } else {
      this.seleccionMultiple.splice(index, 1);
    }
    // Guardar la selección en el servidor
    if (usuarioId) {
      this._postService
        .guardarSeleccionEncuesta(
          this.encuesta.id_encuesta,
          usuarioId,
          opcion,
          true
        )
        .subscribe(() => {
          console.log('Voto registrado en encuesta múltiple');
        });
    }
  }

  // Interaciones del post

  toggleLike(postId: number, userId: number | null) {
    if (userId == null) return;
    this.haveLike = !this.haveLike;

    if (userId != null) {
      this._postService.toggleLike(postId, userId).subscribe(() => {
        const dataPost = {
          postId: postId,
          userId: userId,
        };
        this._postSocket.enviarToggleLike(dataPost);
        this.obtenerNumeroLikes(postId, userId);
      });
    }
  }

  toggleGuardarPost() {
    const idUsuarioActual = this.obtenerIdUsuarioActual();
    this.haveSave = !this.haveSave;
    if (idUsuarioActual != null) {
      this._postService
        .toggleGuardarPost(this.post.post_id, idUsuarioActual)
        .subscribe(() => {
          this.obtenerPostGuardado(this.post.post_id, idUsuarioActual);
        });
    }
  }

  comentarPost(postId: number, userId: number | null) {
    alert('Comentario enviado');
    let comentario = 'PRUEBA DE COMENTARIO';
    if (userId == null) return;
    this._postService.comentarPost(postId, userId, comentario).subscribe(() => {
      this.obtenerNumeroComentarios(postId);
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
