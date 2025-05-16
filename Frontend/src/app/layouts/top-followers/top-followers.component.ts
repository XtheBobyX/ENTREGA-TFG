import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FollowerService } from '../../core/services/follower-services.service';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-top-followers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-followers.component.html',
  styleUrl: './top-followers.component.css',
})

export class TopFollowersComponent {
  listadoUsuariosPopulares: any[] = [];
  haveFollow: boolean = false;
  idUsuarioLogueado: string = '';


  constructor(
    private _followerService: FollowerService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._authService.obtenerDatosUsuarioToken().subscribe((data: any) => {
      this.idUsuarioLogueado = data.id;
      //
      this._followerService.topSeguidores().subscribe((data: any) => {
        for (let i = 0; i < data.top.length; i++) {
          const usuario = data.top[i].usuarioSeguido;
          // Verificar si el propietario
          const esPropietario = Number(usuario.id_usuario) === Number(this.idUsuarioLogueado);
          // 
          this._followerService
            .verificarFollow(this.idUsuarioLogueado, usuario.id_usuario)
            .subscribe((followData: any) => {
              this.listadoUsuariosPopulares.push({
                id: usuario.id_usuario,
                avatar: usuario.url_imagen_perfil || 'assets/placeholder.png',
                full_name: usuario.nombre_completo || usuario.username,
                username: usuario.username,
                isFollowed: followData.followed,
                esPropietario: esPropietario
              });
            });
        }
      });
      //
    });
  }

  toggleFollow(
    userIdSeguido: string | undefined,
    userIdSeguidor: string | undefined
  ) {
    if (userIdSeguido == undefined || userIdSeguidor == undefined) return;

    this.haveFollow = !this.haveFollow;

    this._followerService
      .toggleFollow(userIdSeguidor, userIdSeguido)
      .subscribe((data: any) => {
        this.haveFollow = data.followed;
      });
  }


}
