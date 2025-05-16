import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css'
})
export class SurveyComponent {
  @Output() encuestaCreada = new EventEmitter<any>();

  mostrarModal: boolean = false;

  tituloEncuesta: string = '';
  opciones: string[] = [''];
  isChecked = false;

  crearSurvey(){
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.tituloEncuesta = '';
    this.opciones = ['', '', '', ''];
  }
  agregarOpcion() {
    this.opciones.push('');
  }

  eliminarOpcion(index: number) {
    this.opciones.splice(index, 1);
  }

   crearEncuesta() {
    const encuesta = {
      titulo: this.tituloEncuesta.trim(),
      multiple_opciones: this.isChecked,
      opciones: this.opciones.map(op => op.trim()).filter(op => op !== '')
    };

    if (!encuesta.titulo || encuesta.opciones.length < 2) {
      alert('Por favor ingresa un título y al menos dos opciones válidas.');
      return;
    }

    this.encuestaCreada.emit(encuesta); 
    console.log('Encuesta creada:', encuesta);

    // Aquí puedes enviar `encuesta` a un backend o servicio

    this.cerrarModal();
    this.resetFormulario();
  }

  resetFormulario() {
    this.tituloEncuesta = '';
    this.opciones = [''];
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
