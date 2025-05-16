import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/environments';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class PostSocketService {
  private appUrl: string;
  private socket: Socket;
  public posts: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private userService: UserService) {
    this.appUrl = environment.endpoint;
    this.socket = io(this.appUrl);
  }

  enviarPost(data: any) {
    return this.socket.emit('postEnviado', data);
  }

  recibirPost(): Observable<any> {
    console.log('Si recibe los mensajes');

    return new Observable((observer) => {
      const listener = (data: any) => {
        console.log(data);
        observer.next(data);
      };

      this.socket.on('postRecibido', listener);

      return () => {
        this.socket.off('postRecibido', listener);
      };
    });
  }

  enviarToggleLike(data: any) {
    return this.socket.emit('toggleLikeEnviado', data);
  }

  recibirToggleLike(): Observable<any> {
    return new Observable((observer) => {
      const listener = (data: any) => {
        observer.next(data);
      };
      this.socket.on('toggleLikeRecibido', listener);
      return () => {
        this.socket.off('toggleLikeRecibido', listener);
      };
    });
  }

  enviarComentario(data: any) {
    return this.socket.emit('comentarioEnviado', data);
  }

  recibirComentario(): Observable<any> {
    return new Observable((observer) => {
      const listener = (data: any) => {
        observer.next(data);
      };
      this.socket.on('comentarioRecibido', listener);
      return () => {
        this.socket.off('comentarioRecibido', listener);
      };
    });
  }
}
