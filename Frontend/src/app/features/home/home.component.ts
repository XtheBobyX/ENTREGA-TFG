import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../core/services/post/post.service';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../shared/post/post.component';
import { Post } from '../../core/models/post.model';
import { AuthService } from '../../core/auth/services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { UploadImagesComponent } from '../../shared/upload-images/upload-images.component';
import { SurveyComponent } from '../../shared/survey/survey.component';
import { PostSocketService } from '../../core/services/post/post-socket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PostComponent,
    PickerComponent,
    UploadImagesComponent,
    SurveyComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild(UploadImagesComponent)
  uploadImagesComponent!: UploadImagesComponent;
  imgSrc: string = 'assets/placeholder.png';
  posts: Post[] = [];
  contenido: string = '';
  listaPrevisualizacionImagenes: string[] = [];
  encuesta: any = null;
  listadoHashtags: string[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private postSocket: PostSocketService
  ) {}

  ngOnInit(): void {
    const username = this.authService.obtenerUsuarioUsernameToken();
    if (username === null) return;
    this.obtenerPosts();

    this.authService
      .obtenerDatosUsuarioByUsernameBD(username)
      .subscribe((data: any) => {
        const usuario = data.usuario;
        this.imgSrc = usuario.url_imagen_perfil || 'assets/placeholder.png';
      });

    this.authService.obtenerDatosUsuarioToken().subscribe((data: any) => {
      this.imgSrc = data.url_imagen_perfil || this.imgSrc;
    });

    this.postSocket.recibirPost().subscribe((nuevoPost: any) => {
      const post = nuevoPost;
      console.log(post);
      this.posts.unshift(post);
    });
  }

  private obtenerPosts(): void {
    this.postService.getPosts().subscribe(
      (data: any) => {
        this.posts = data.reverse();
      },
      (error) => {
        console.error('Error al obtener los posts:', error);
      }
    );
  }
  puedePublicar(): boolean {
    return (
      this.contenido.trim() !== '' ||
      this.listaPrevisualizacionImagenes.length > 0 ||
      !!this.encuesta
    );
  }

  private emojiListenerAgregado = false;

  toggleEmoji() {
    const emojiPicker = document.querySelector('.emoji-picker') as HTMLElement;

    if (!emojiPicker) return;

    const estaEscondido = emojiPicker.classList.toggle('hidden');

    if (!estaEscondido) {
      this.emojiListenerAgregado = true;

      if (!this.emojiListenerAgregado) return;

      // Espera un poco para no cerrar el picker con el mismo click que lo abrió
      setTimeout(() => {
        const handleClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement;

          const haClickeadoFuera =
            !emojiPicker.contains(target) &&
            !target.classList.contains('emoji-button');

          if (haClickeadoFuera) {
            emojiPicker.classList.add('hidden');
            this.emojiListenerAgregado = false;

            // Eliminar el listener después de usarlo
            document.body.removeEventListener('click', handleClick);
          }
        };

        document.body.addEventListener('click', handleClick);
      }, 200);
    } else {
      console.log('Emoji picker cerrado');
      this.emojiListenerAgregado = false;
    }
  }
  getImagenHeightClass(index: number): string {
    const len = this.listaPrevisualizacionImagenes.length;
    if (len === 1) return 'h-[495px]';
    if (len === 2) return 'h-[297px]';
    if (len === 3 && index === 0) return 'h-[253px]';
    if (len === 4 && index !== 0) return 'h-[143px] sm:h-[253px]';
    return '';
  }

  //Método para publicar un post
  publicarPost() {
    const userId = this.authService.obtenerUsuarioIdToken();
    if (
      !userId &&
      (this.contenido.trim() === '' ||
        this.listaPrevisualizacionImagenes.length === 0)
    ) {
      alert('El contenido no puede estar vacío');
      return;
    }
    // Extraer hashtags del contenido
    this.listadoHashtags = this.extractHashtags(this.contenido);

    const postData = {
      contenido: this.contenido,
      id_usuario: userId,
      fechaPublicacion: new Date().toISOString(),
      avatar_imagen: this.imgSrc,
      is_report: false,
      imagenes: this.listaPrevisualizacionImagenes,
      encuesta: this.encuesta,
      hashtags: this.listadoHashtags,
    };

    const imageData = {
      id_usuario: userId,
      tipo_archivo: '',
      url_archivo: '',
    };

    // this.postService.createPost(postData, imageData).subscribe(
    this.postService.createPost(postData).subscribe(
      (data) => {
        this.postSocket.enviarPost(data);
        this.contenido = '';
        this.listaPrevisualizacionImagenes = [];
        this.listadoHashtags = [];
        this.uploadImagesComponent.reiniciarLongitudListaImagenes();
        this.encuesta = null;
      },
      (error) => {
        console.error('Error al crear el post:', error);
      }
    );
  }

  extractHashtags(text: any) {
    return text.match(/#\w+/g) || [];
  }

  addEmoji($event: any) {
    const emoji = $event.emoji.native;
    this.contenido += emoji;
  }

  obtenerImagenes(array: string[]) {
    this.listaPrevisualizacionImagenes = array;
  }

  eliminarImagen(index: number) {
    this.listaPrevisualizacionImagenes.splice(index, 1);
  }

  obtenerEncuesta(encuestaData: any) {
    this.encuesta = encuestaData;
  }

  eliminarEncuesta() {
    this.encuesta = null;
  }
}

export default HomeComponent;
