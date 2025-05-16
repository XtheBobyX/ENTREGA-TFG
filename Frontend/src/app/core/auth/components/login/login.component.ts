import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private _userService: AuthService,private router: Router) {

  }
  login() {
    // validaciones 
    if (this.username == '' || this.password == '') {
      alert('Los datos no pueden estar vacio');
      return
    }
    //
    const usuario: Usuario = {
      username: this.username,
      password: this.password,
    }

    this._userService.login(usuario).subscribe({
      next: (token) => {
        console.log(token, 'Token recibido loginZ');
        localStorage.setItem('token',token)
        this.router.navigate(['/home']);
        alert('Usuario iniciado correctamente');
      },error: (e:HttpErrorResponse) => {
        if(e.error.msg){
          alert(e.error.msg);
        } else {
          alert('Error inesperado loginZ');
        }
      }
    })
  }
}
