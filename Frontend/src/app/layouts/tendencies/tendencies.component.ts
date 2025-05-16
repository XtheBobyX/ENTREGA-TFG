import { Component } from '@angular/core';
import { PostService } from '../../core/services/post/post.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tendencies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tendencies.component.html',
  styleUrl: './tendencies.component.css'
})
export class TendenciesComponent {
constructor(private _postServices_:PostService) { }
  listadoTendencias: any[] = [];
ngOnInit(): void {
  
  this._postServices_.getTendencies().subscribe((data:any)=>{
    this.listadoTendencias = data;
  })
}

}
