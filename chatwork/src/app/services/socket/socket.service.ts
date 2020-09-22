import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/* importing interfaces starts */
import { Auth } from './../../commons/interfaces/auth';
import { Socket } from 'ngx-socket-io';
import { Message } from 'src/app/commons/interfaces/message';
import { MessageSocketEvent } from 'src/app/commons/interfaces/message-socket-event';
import { ListUsers } from 'src/app/commons/interfaces/list-users';
import { MessageChatgroup } from 'src/app/commons/interfaces/message-chatgroup';
import { ChatgroupInfo } from 'src/app/commons/interfaces/chatgroup-info';
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
    // console.log(userId);
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

  chatleftLogin() : Observable<ListUsers> {
    return new Observable((observer) => {
      this.socket.on('user-login', (data: ListUsers) => {
        observer.next(data);
      })
      return() => {
        this.socket.disconnect();
      }
    })
  }

  chatleftLogout() : Observable<ListUsers> {
    return new Observable((observer) => {
      this.socket.on('user-logout', (data: ListUsers) => {
        observer.next(data);
      });
      return() => {
        this.socket.disconnect();
      }
    })
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
      this.socket.on('add-message-response', (data: Message) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  newGroup(username, groupname, description){
    this.socket.emit('joinRoom', {username,groupname, description});
  }

  groupInform() : Observable<ChatgroupInfo> {
    return new Observable((observer)=>{
      this.socket.on('group-info',(data:ChatgroupInfo)=>{
        observer.next(data)
      })
    })
  }

  userJoinInform() : Observable<string> {
    return new Observable((observer)=>{
      this.socket.on('inform-user-join',(data:string)=>{
        observer.next(data);
      })
    })
  }

  chatGroupSend(username:string, avatar:string, message: string, sendtime:number){
    this.socket.emit('chat-group',{username,avatar, message, sendtime});
  }
  chatGroupReceive() : Observable<MessageChatgroup>{
    return new Observable((observer)=>{
      this.socket.on('server-chat',(data:MessageChatgroup)=>{
        observer.next(data);
      })
    })
  }
}
