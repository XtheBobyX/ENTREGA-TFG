import { Component } from '@angular/core';
import { MenuSideComponent } from '../../layouts/menu-side/menu-side.component';
import { TopFollowersComponent } from '../../layouts/top-followers/top-followers.component';
import { TendenciesComponent } from '../../layouts/tendencies/tendencies.component';
import { PostComponent } from '../../shared/post/post.component';
import { CommonModule } from '@angular/common';
import { PostService } from '../../core/services/post/post.service';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-saved-post',
  standalone: true,
  imports: [
    PostComponent,
    CommonModule,
  ],
  templateUrl: './saved-post.component.html',
  styleUrl: './saved-post.component.css',
})
export default class SavedPostComponent {
  savedPost: any[] = [];

  constructor(
    private _postService: PostService,
    private _authService: AuthService
  ) {}
  ngOnInit(): void {
    this.obtenerSavedPosts();
  }

  obtenerSavedPosts() {
    const id = this.obtenerIdUsuario();
    if (id != null) {
      this._postService
        .getSavedPosts(this.obtenerIdUsuario())
        .subscribe((data: any) => {
          for (let i = 0; i < data.length; i++) {
            this.savedPost.push(data[i].post);
          }
        });
    }
  }
  obtenerIdUsuario() {
    const id = this._authService.obtenerUsuarioIdToken();
    if (id != null) return id;
    return 0;
  }
}
