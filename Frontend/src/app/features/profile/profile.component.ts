import { Component } from '@angular/core';
import { TopFollowersComponent } from '../../layouts/top-followers/top-followers.component';
import { TendenciesComponent } from '../../layouts/tendencies/tendencies.component';
import { MenuSideComponent } from '../../layouts/menu-side/menu-side.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// Modelos
import { Usuario } from '../../core/models/usuario.model';
// Servicios
import { UserService } from '../../core/services/user.service';
import { PostService } from '../../core/services/post/post.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { PostComponent } from '../../shared/post/post.component';
//
import { RouterModule } from '@angular/router';
import { ModalEditProfileComponent } from '../../shared/modal-edit-profile/modal-edit-profile.component';
import { Location } from '@angular/common';
import { FollowerService } from '../../core/services/follower-services.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    PostComponent,
    RouterModule,
    PostComponent,
    ModalEditProfileComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  datosUsuario: Usuario = {
    id: '',
    username: '',
    nombre_completo: '',
    url_imagen_perfil: '',
    biografia: '',
    portada: '',
    fecha_creacion: '',
  };

  datosPerfil: any = {
    posts: [],
    numeroPublicaciones: 0,
    fechaUnirse: '',
    numeroSeguidores: 0,
    numeroSeguidos: 0,
  };

  datosUsuarioLogueado: Usuario = {
    id: '',
    username: '',
    nombre_completo: '',
    url_imagen_perfil: '',
    biografia: '',
    portada: '',
    fecha_creacion: '',
  };

  esPropietarioPerfil: boolean = false;

  modalAbierto = false;
  haveFollow: boolean = false;

  editarPerfil() {
    this.modalAbierto = true;
  }
  constructor(
    private route: ActivatedRoute,
    private _userService: UserService,
    private _postService: PostService,
    private _authService: AuthService,
    private _followerService: FollowerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Obtener id usuario (logueado)
    this._authService.obtenerDatosUsuarioToken().subscribe((data: any) => {
      this.datosUsuarioLogueado.id = data.id;
      this.datosUsuarioLogueado.username = data.username;

      // Obtener el username de la URL
      this.route.paramMap.subscribe((params) => {
        const username = params.get('username');
        if (username != null) {
          this.datosUsuario.username = username;

          // Obtener datos del perfil
          this._userService
            .getUserByUsername(this.datosUsuario.username)
            .subscribe((response: any) => {
              const usuario = response.usuario;
              const fechaUnirse = this.formatearFecha(usuario.created_at);

              this.datosUsuario = {
                id: usuario.id_usuario,
                username: usuario.username,
                nombre_completo: usuario.nombre_completo || usuario.username,
                url_imagen_perfil:
                  usuario.url_imagen_perfil || 'assets/placeholder.png',
                biografia: usuario.biografia,
                portada: usuario.portada || 'assets/portada.jpg',
                fecha_creacion: fechaUnirse,
              };


              this.comprobarIfPropietario();
              this.verificarFollow();

              // Obtener numero de seguidores y seguidos
              this._followerService
                .getSeguidores(this.datosUsuario.id)
                .subscribe((data: any) => {
                  this.datosPerfil.numeroSeguidores = data.numSeguidores;
                });

              this._followerService
                .getSeguidos(this.datosUsuario.id)
                .subscribe((data: any) => {
                  this.datosPerfil.numeroSeguidos = data.numSeguido;
                });
            });

          // Obtener posts del perfil
          this._postService
            .getPostByUsername(this.datosUsuario.username)
            .subscribe((response: any) => {
              this.datosPerfil.posts = response.reverse();
              this.datosPerfil.numeroPublicaciones =
                this.datosPerfil.posts.length;
            });
        }
      });
    });
  }

  comprobarIfPropietario(): void {
    this.esPropietarioPerfil =
      Number(this.datosUsuario.id) === Number(this.datosUsuarioLogueado.id);
  }

  formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  goBack() {
    this.location.back();
  }

  toggleFollow(
    userIdSeguido: string | undefined,
    userIdSeguidor: string | undefined
  ) {
    if (userIdSeguido == undefined || userIdSeguidor == undefined) return;

    this.haveFollow = !this.haveFollow;

    this._followerService
      .toggleFollow(userIdSeguido, userIdSeguidor)
      .subscribe((data: any) => {
        this.haveFollow = data.followed;
        console.log(data);
      });
  }

  verificarFollow() {
    const idPerfil = this.datosUsuario.id;
    const idLogueado = this.datosUsuarioLogueado.id;

    if (!idPerfil || !idLogueado) return;

    this._followerService
      .verificarFollow(idLogueado, idPerfil)
      .subscribe((data: any) => {
        this.haveFollow = data.followed;
      });
  }
}
export default ProfileComponent;
