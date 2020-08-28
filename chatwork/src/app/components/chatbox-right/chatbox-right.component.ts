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
import { Users } from 'src/app/commons/interfaces/users';
import { Message } from 'src/app/commons/interfaces/message';
import { MessagesResponse } from 'src/app/commons/interfaces/messages-response';

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    shortNames: ['parrot'],
    keywords: ['party'],
    imageUrl: './assets/images/parrot.gif',
  },
  {
    name: 'Octocat',
    shortNames: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
  },
  {
    name: 'Squirrel',
    shortNames: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/shipit.png',
  },
];


@Component({
  selector: 'app-chatbox-right',
  templateUrl: './chatbox-right.component.html',
  styleUrls: ['./chatbox-right.component.css']
})
export class ChatboxRightComponent implements OnInit {
  public messageLoading = true;
  @Input() username: string;
  @Input() userId: string;
  public selectedUser: Users = null;
  public messages: Message[] = [];
  today: number = Date.now();

  destroy$: Subject<boolean> = new Subject<boolean>();
  darkMode: undefined | boolean = !!(
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-color-scheme: dark)').matches
  );
  CUSTOM_EMOJIS = CUSTOM_EMOJIS;

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

  //   public messageForm: FormGroup;
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
    this.dataService.selectedUser.subscribe((selectedUser: Users) => {
      if (selectedUser !== null) {
        this.selectedUser = selectedUser;
        this.getMessages(this.selectedUser.id);
      }
    });
  }

  getMessages(receiverId: string) {
    this.messageLoading = true;
    // this.apiService
    //.sendPostRequest(Common.API.getMsg,{ senderId: this.userId,username:this.username, receiverId: receiverId })
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
          this.selectedUser.id === socketResponse.senderId
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
    } else if (this.selectedUser.id === '') {
      alert(`Select a user to chat.`);
    } else {
      this.sendAndUpdateMessages({
        senderId: this.userId,
        username: this.username,
        message: message.trim(),
        receiverId: this.selectedUser.id,
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
    console.log(this.messageEmoji)
    const { messageEmoji } = this;
    console.log(messageEmoji);
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
  
  onFocus() {
    console.log('focus');
    this.showEmojiPicker = false;
  }
  onBlur() {
    console.log('onblur')
  }
}
