import { Component,Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
    @Input() comment: any = {
      id_comentario: 0,
      contenido: '',
      id_usuario: 0,
      post_id: 0,
    };
    usuario: any = {
      username: '',
      nombre_completo: '',
      id_usuario: 0,
      url_imagen_perfil: 'assets/placeholder.png'
    };

    constructor(){}

    ngOnInit(): void {
      // Datos del usuario
      this.usuario.id_usuario = this.comment.usuario.id_usuario;
      this.usuario.nombre_completo = this.comment.usuario.nombre_completo;
      this.usuario.url_imagen_perfil = this.comment.usuario.url_imagen_perfil || 'assets/placeholder.png';
      this.usuario.username = this.comment.usuario.username;
      // Datos del comentario
      this.comment.id_comentario = this.comment.id_comentario;
      this.comment.contenido = this.comment.contenido;
      this.comment.post_id = this.comment.post_id;
      this.comment.id_usuario = this.comment.id_usuario;
    }

  


}
