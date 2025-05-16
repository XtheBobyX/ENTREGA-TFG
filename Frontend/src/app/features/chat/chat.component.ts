import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatListComponent } from '../../shared/chat-list/chat-list.component';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { ChatHttpService } from '../../core/services/chat/chat-http.service';
import { BuscadorComponent } from '../../shared/buscador/buscador.component';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatListComponent, CommonModule, FormsModule, BuscadorComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export default class ChatComponent {
  @Input() receptorId!: any;
  remitenteId!: any;
  mensajes: any[] = [];
  listadoUsuarios: any[] = [];
  nuevoMensaje: string = '';

  usuario: Usuario = {
    nombre_completo: '',
    username: '',
    url_imagen_perfil: '',
    id: '',
  };

  resultadosRecibidos: any[] = [];

  @Output() usuarioZ = new EventEmitter<any[]>();

  isOpenChat = false;

  abrirChat(usuarioZ: any) {
    this.isOpenChat = true;
    this.usuarioZ.emit(usuarioZ);
    this.mostrarUsuarioData(usuarioZ);
    this.close();
  }

  constructor(
    private chatService: ChatService,
    private chathttp: ChatHttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.isOpenChat);
    this.remitenteId = this.authService.obtenerUsuarioIdToken();
    this.cargarMensajes();

    this.chatService.recibirMensaje().subscribe((nuevoMensaje: any) => {
      const mensajeTransformado = {
        ...nuevoMensaje,
        id_remitente: nuevoMensaje.remitenteId,
        id_receptor: nuevoMensaje.receptorId,
      };
      this.mensajes.push(mensajeTransformado);
      console.log(this.mensajes);
    });
  }

  cargarMensajes() {
    this.chathttp
      .getMensajes(this.remitenteId, this.receptorId)
      .subscribe((res: any) => {
        this.mensajes = res;
      });
  }

  enviar() {
    if (!this.nuevoMensaje.trim()) return;
    //
    const mensaje = {
      remitenteId: this.remitenteId,
      receptorId: this.receptorId,
      contenido: this.nuevoMensaje,
    };
    //
    console.log(mensaje);
    //
    this.chathttp.enviarMensaje(mensaje).subscribe(
      (respuesta) => {
        console.log('Mensaje enviado con exito', respuesta);
      },
      (error) => {
        console.log('HAY UN PUTO ERROR', error);
      }
    );
    this.chatService.enviarMensaje(mensaje);
    this.nuevoMensaje = '';
  }

  mostrarUsuarioData(usuario: any) {
    console.log(usuario);
    this.isOpenChat = true;
    //
    this.receptorId = usuario.id_usuario;
    console.log(
      '🧪 Llamando a unirseSala con:',
      this.remitenteId,
      this.receptorId
    );
    this.chatService.unirseSala(this.remitenteId, this.receptorId);
    this.chathttp
      .getMensajes(this.remitenteId, this.receptorId)
      .subscribe((data) => {
        this.mensajes = data;
      });
    // Rellenar datos
    this.usuario.nombre_completo = usuario.nombre_completo;
    this.usuario.username = usuario.username;
    this.usuario.url_imagen_perfil = usuario.url_imagen_perfil;
    this.usuario.id = usuario.id_usuario;
  }

  isVisible = false;

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  manejarResultados(resultados: any[]): void {
    this.resultadosRecibidos = resultados;
    console.log(this.resultadosRecibidos);
  }

  trackByMensaje(index: number, mensaje: any): number {
    return mensaje.id ?? index;
  }
}
