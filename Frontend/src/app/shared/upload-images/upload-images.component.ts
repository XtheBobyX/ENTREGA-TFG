import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.css',
})
export class UploadImagesComponent {
  // listaImagenes: string[] = [];
  @Output() listaImagenesEmitido = new EventEmitter<string[]>();
  listaImagenes: any = [];

  previsualizar(event: Event) {
    // Recoger el input donde se envia la imagen
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    // Recoger los archivos
    const archivos = Array.from(input.files);

    // Validar numero de imagenes
    const espacioDisponible = 4 - this.listaImagenes.length;

    if (espacioDisponible <= 0) {
      alert('Solo 4 imagenes');
      return;
    }

    const archivosPermitidos = archivos.slice(0, espacioDisponible);

    archivosPermitidos.forEach((archivo) => {
        // Crear URL temporal para previsualizar
        const urlTemporal = URL.createObjectURL(archivo);
        this.listaImagenes.push(urlTemporal);
   
      this.listaImagenesEmitido.emit(this.listaImagenes);
    });

    if (archivos.length > archivosPermitidos.length) {
      alert(
        `Solo se pueden subir hasta 4 imágenes. Se cargaron ${archivosPermitidos.length} imagen(es).`
      );
    }
    input.value = '';
  }

  reiniciarLongitudListaImagenes(){
    this.listaImagenes = [];
  }
}
