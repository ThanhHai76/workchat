import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/* importing interfaces starts */
import { Auth } from './../../commons/interfaces/auth';
import { Socket } from 'ngx-socket-io';
import { ChatLeftResponse } from 'src/app/commons/interfaces/chat-left-response';
import { Message } from 'src/app/commons/interfaces/message';
import { MessageSocketEvent } from 'src/app/commons/interfaces/message-socket-event';
/* importing interfaces ends */

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  constructor( private socket : Socket) {}
  /*
   * Method to connect the users to socket
   */
  connectSocket(userId: string): void {
    this.socket.emit('connection',{userId: userId})
  }

  /*
   * Method to emit the logout event.
   */
  logout(userId: string): Observable<Auth> {
    this.socket.emit('logout', {userId: userId});
    this.socket.emit('disconnect', {userId: userId});
    return new Observable((observer) => {
      this.socket.on('logout-response', (data: Auth) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
 /*
   * Method to receive chat-list-response event.
   */
  getChatList(userId: string): Observable<ChatLeftResponse> {
    this.socket.emit('chat-left',  { userId: userId });

    return new Observable((observer) => {
      this.socket.on('chat-left-response', (data: ChatLeftResponse) => {
        observer.next(data);//Observer got a next value
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

    /*
   * Method to emit the add-messages event.
   */
  sendMessage(message: MessageSocketEvent): void {
    this.socket.emit('add-message', message);
  }

  /*
   * Method to receive add-message-response event.
   */
  receiveMessages(): Observable<Message> {
    return new Observable((observer) => {
      this.socket.on('add-message-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }
}
