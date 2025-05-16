import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export default class WelcomePageComponent {
  constructor(private router: Router) {}

  login() {
     this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
 }
}
