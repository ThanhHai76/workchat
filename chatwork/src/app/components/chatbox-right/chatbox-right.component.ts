import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/services/api/api.service';
import { Common } from 'src/app/commons/common';
/* importing interfaces ends */

import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { EmojiSearch } from '@ctrl/ngx-emoji-mart';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat/chat.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { DataService } from 'src/app/services/data/data.service';
import { Message } from 'src/app/commons/interfaces/message';
import { MessagesResponse } from 'src/app/commons/interfaces/messages-response';
import { User } from 'src/app/commons/model/user.model';
import { ListUsers } from 'src/app/commons/interfaces/list-users';


@Component({
  selector: 'app-chatbox-right',
  templateUrl: './chatbox-right.component.html',
  styleUrls: ['./chatbox-right.component.css']
})
export class ChatboxRightComponent implements OnInit {
  public messageLoading = true;
  public selectedUser: ListUsers = null;
  public messages: Message[] = [];
  @Input() profile: User;
  @Input() username: string;
  @Input() userId: string;
  today: number = Date.now();

  destroy$: Subject<boolean> = new Subject<boolean>();

  darkMode: undefined | boolean = !!(
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-color-scheme: white)').matches
  );

  messageEmoji = '';
  MsgForm : FormGroup;
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'twitter';

  @ViewChild('messageThread') private messageContainer: ElementRef;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private socketService: SocketService,
    private dataService: DataService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.listenForMessages();
    this.initMsgForm();
    this.dataService.selectedUser$.subscribe((selectedUser: ListUsers) => {
      if (selectedUser !== null) {
        this.selectedUser = selectedUser;
        this.getMessages(this.selectedUser._id);
      }
    });
  }

  getMessages(receiverId: string) {
    this.messageLoading = true;
    this.chatService
      .getMessages({
        senderId: this.userId,
        username: this.username,
        receiverId: receiverId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: MessagesResponse) => {
        this.messages = response.messages;
        this.messageLoading = false;
      });
  }

  listenForMessages(): void {
    this.socketService
      .receiveMessages()
      .subscribe((socketResponse: Message) => {
        if (
          this.selectedUser !== null &&
          this.selectedUser._id === socketResponse.senderId
        ) {
          this.messages = [...this.messages, socketResponse];
          this.scrollMessageContainer();
        }
      });
  }

  sendMessage(message) {
    if (message === '' || message === undefined || message === null) {
      alert(`Message can't be empty.`);
    } else if (this.userId === '') {
      this.router.navigate([Common.PATHS.home]);
<<<<<<< HEAD
    } else if (this.selectedUser._id === '') {
=======
    } else if (this.selectedUser.id === '') {
>>>>>>> b32b00f905671e0038824f5c97c6f7795dd1ceb2
      alert(`Select a user to chat.`);
    } else {
      this.sendAndUpdateMessages({
        senderId: this.userId,
        username: this.username,
        message: message.trim(),
<<<<<<< HEAD
        receiverId: this.selectedUser._id,
=======
        receiverId: this.selectedUser.id,
>>>>>>> b32b00f905671e0038824f5c97c6f7795dd1ceb2
        sendtime: this.today,
      });
      this.messageEmoji = "";
    }
  }

  sendAndUpdateMessages(message: Message) {
    try {
      this.socketService.sendMessage(message);
      this.messages = [...this.messages, message];
      this.scrollMessageContainer();
    } catch (error) {
      console.warn(error);
      alert(`Can't send your message`);
    }
  }

  scrollMessageContainer(): void {
    if (this.messageContainer !== undefined) {
      try {
        setTimeout(() => {
          this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  alignMessage(userId: string): boolean {
    return this.userId === userId ? false : true;
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
        this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    // console.log(this.messageEmoji)
    const { messageEmoji } = this;
    // console.log(messageEmoji);
    console.log(`${event.emoji.native}`)
    const text = `${messageEmoji}${event.emoji.native}`;

    this.messageEmoji = text;
    // this.showEmojiPicker = false;

  }

  private initMsgForm() {
    this.MsgForm = new FormGroup({
      message: new FormControl('', [
        Validators.required
      ]),
    });
  }
  
}
