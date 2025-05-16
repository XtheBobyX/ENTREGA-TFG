import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-side',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-side.component.html',
  styleUrl: './menu-side.component.css',
})
export class MenuSideComponent {
  idUsuario: number = 0;
  username: string = '';
  nombreCompleto: string = '';
  avatarSrc: string = 'assets/placeholder.png';

  constructor(private authService: AuthService) {
    const username = this.authService.obtenerUsuarioUsernameToken();
    if(username == null)return;
    this.authService
      .obtenerDatosUsuarioByUsernameBD(username)
      .subscribe((data:any) => {
        const usuario = data.usuario;
        this.username = usuario.username;
        this.nombreCompleto = usuario.nombre_completo || this.username;
        this.avatarSrc = usuario.url_imagen_perfil ||'assets/placeholder.png' ;
      });
  }

    ngAfterViewInit(): void {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');

    if (toggle && menu && overlay) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
      });

      overlay.addEventListener('click', () => {
        menu.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        console.log('Esconder');
      });
    }
  }


  logout() {
    document.querySelector('.logout')?.classList.toggle('hidden');
  }

  cerrarSesion() {
    this.authService.logout();
  }



}
