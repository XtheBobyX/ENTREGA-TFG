import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { MenuSideComponent } from './layouts/menu-side/menu-side.component';
import { TopFollowersComponent } from './layouts/top-followers/top-followers.component';
import { TendenciesComponent } from './layouts/tendencies/tendencies.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,MenuSideComponent,TopFollowersComponent,TendenciesComponent,CommonModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: jwtInterceptor,
      multi: true,
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';

  constructor(public router: Router){}
  // cambiarModoOscuro(){
  //   document.documentElement.classList.toggle("dark");
  // }
}
