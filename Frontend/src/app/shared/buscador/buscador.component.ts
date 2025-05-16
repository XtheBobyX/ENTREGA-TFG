import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent {
  busqueda = new FormControl('');
  resultados: any[] = [];

  @Output() resultadosEmitter = new EventEmitter<any[]>();

  constructor(private usuarioService: UserService) {}

  ngOnInit(): void {
    this.busqueda.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((valor) =>
          this.usuarioService.buscarUsuarios(valor).pipe(
            catchError((err) => {
              console.error(err);
              return of([]);
            })
          )
        )
      )
      .subscribe((usuarios) => {
        this.resultados = usuarios;
        console.log(usuarios);
        this.resultadosEmitter.emit(this.resultados);
      });
  }

  
}
