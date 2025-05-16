import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../enviroments/environments';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private appUrl: string;
  // private apiUrl: string;

  private socket: Socket;
  public messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  constructor() {
    this.appUrl = environment.endpoint;
    this.socket = io(this.appUrl);
  }

  enviarMensaje(mensaje: any) {
    return this.socket.emit('mensajeEnviado', mensaje);
  }

  recibirMensaje() {
    this.socket.off('mensajeRecibido');
    return new Observable((observer) => {
      this.socket.on('mensajeRecibido', (data) => {
        observer.next(data);
      });
    });
  }
  private salaActual: string | null = null;

  unirseSala(remitenteId: number,receptorId: number) {
    const nuevaSala = this.generarSala(remitenteId,receptorId);
    // Salir de la sala
    if (this.salaActual) {
      this.socket.emit('salir', this.salaActual);
    }

    this.socket.emit('unirseSala', nuevaSala);
    this.salaActual = nuevaSala;
  }

  private generarSala(id1: number, id2: number): string {
    // Siempre genera el mismo nombre (2_5 y 5_2 sera la misma sala siempre)
  const idsOrdenados = [id1, id2].sort((a, b) => a - b);
  return `sala_${idsOrdenados[0]}_${idsOrdenados[1]}`;
}
}
