import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';
import { ChatHttpService } from '../../core/services/chat/chat-http.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  listadoUsuarios: any[] = [];
  @Output() usuario = new EventEmitter<any>();

  idUsuarioLogueado: any = 0;

  constructor(
    private chatHttp: ChatHttpService,
    private authService: AuthService
  ) {
    if (authService.obtenerUsuarioIdToken() != null) {
      this.idUsuarioLogueado = authService.obtenerUsuarioIdToken();
    }
  }

  ngOnInit(): void {
    this.chatHttp
      .getConversaciones(this.idUsuarioLogueado)
      .subscribe((usuarios: any) => {
        const mensajes = usuarios?.mensajes || [];
        const idsAgreagados = new Set();

        mensajes.forEach((mensaje: any) => {
          const posiblesUsuarios = [mensaje.receptor, mensaje.remitente];

          posiblesUsuarios.forEach((usuario) => {
            if (
              usuario.id_usuario != this.idUsuarioLogueado &&
              !idsAgreagados.has(usuario.id_usuario)
            ) {
              this.listadoUsuarios.push(usuario);
              idsAgreagados.add(usuario.id_usuario);
            }
          });
        });
      });
  }

  abrirChat(usuario: any) {
    this.usuario.emit(usuario);
  }
}
