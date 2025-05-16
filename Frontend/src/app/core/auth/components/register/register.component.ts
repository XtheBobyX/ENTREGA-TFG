import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Usuario } from '../../../models/usuario.model';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export default class RegisterComponent {
  username:string = '';
  email:string = '';
  password:string = '';
  confirmPassword:string = '';

  private _usuarioSevice: AuthService = inject(AuthService);
  private router = inject(Router);


  registrarse(){
    if(!this.camposValidos()) return;
    //
    const usuario: Usuario = {
      username: this.username,
      email: this.email,
      password: this.password
    }

    this._usuarioSevice.registro(usuario).subscribe({
      next: () => {
      alert('usuario registrado correctamente');
      this._usuarioSevice.login(usuario).subscribe({
        next: (token) => {
          localStorage.setItem('token',token)
          this.router.navigate(['/profile',this.username]);
          alert('Usuario iniciado correctamente');
        },error: (e:HttpErrorResponse) => {
          if(e.error.msg){
            alert(e.error.msg);
          } else {
            alert('Error inesperado loginZ');
          }
        }
      });
    },error: (e:HttpErrorResponse) => {
      if(e.error.msg){
        alert(e.error.msg);
      } else {
        alert('Error inesperado registroZ');
      }
    }});
  }

  camposValidos():boolean{
      //validaciones 
      if(this.username == '' || this.email == ''  || this.password == ''  || this.confirmPassword == '' ){
        console.log(this.username,this.email,this.password,this.confirmPassword);
        alert("Debes rellenar todos los campos"); //quizas cambie por otras alertas
        return false;
      }
  
      if(this.password != this.confirmPassword){
        alert("Las contraseñas deben ser iguales");
        return false;
      }
      return true;
    }
  }