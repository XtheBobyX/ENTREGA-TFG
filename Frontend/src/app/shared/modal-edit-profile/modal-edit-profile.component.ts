import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit-profile.component.html',
  styleUrl: './modal-edit-profile.component.css',
})
export class ModalEditProfileComponent {
  username = '';
  id = '';
  datosRellenados: any = {
    portada: '',
    avatar: '',
    nombreCompleto: '',
    biografia: '',
  };

  constructor(
    private _userService: UserService,
    private _authService: AuthService
  ) {}
  ngOnInit(): void {
    // Obtener el username actual
    this._authService.obtenerDatosUsuarioToken().subscribe((data: any) => {
      this.username = data.username;
      this.id = data.id;
    });
    //
    this._userService
      .getUserByUsername(this.username)
      .subscribe((response: any) => {
        const usuario = response.usuario;

        this.datosRellenados = {
          portada: usuario.portada || 'assets/portada.jpg',
          avatar: usuario.url_imagen_perfil || 'assets/placeholder.png',
          nombreCompleto: usuario.nombre_completo || usuario.username,
          biografia: usuario.biografia,
        };
      });
    this.datosRellenados = {};
  }

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  guardarPerfil() {
    // Recoger todos los datos
    const datos = {
      nombre_completo: this.datosRellenados.nombreCompleto,
      url_imagen_perfil: this.datosRellenados.avatar,
      portada: this.datosRellenados.portada,
      biografia: this.datosRellenados.biografia,
    };
    // Recoger el id
    if (!this.id) {
      console.error('ID de usuario no encontrado.');
      return;
    }

    //
    this._userService.updateUser(this.id, datos).subscribe(
      (response) => {
        console.log('Perfil actualizado correctamente', response);
        this.isOpen = false;
        this.close();
        // Actualizar
        this._authService.actualizarDatos();
        //
        window.location.reload();
      },
      (error) => {
        console.error('Error al actualizar perfil', error);
      }
    );
  }

  cambiarPortada(event: any) {
    // Obtener el archivo seleccionado
    const file = event.target.files[0];

    if (file) {
      // Crear una URL temporal para el archivo
      const urlTemporal = URL.createObjectURL(file);

      // Asignar la URL temporal a la 'portada'
      this.datosRellenados.portada = urlTemporal;
    }
  }

  reiniciarPortada() {
    this.datosRellenados.portada = 'assets/portada.jpg';
  }

  cambiarAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Crear una URL temporal para el archivo
      const urlTemporal = URL.createObjectURL(file);

      // Asignar la URL temporal a la 'portada'
      this.datosRellenados.avatar = urlTemporal;
    }
  }
}
