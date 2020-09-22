import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatgroupInfo } from 'src/app/commons/interfaces/chatgroup-info';
import { Message } from 'src/app/commons/interfaces/message';
import { MessageChatgroup } from 'src/app/commons/interfaces/message-chatgroup';
import { UserModel } from 'src/app/commons/models/UserModel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.css']
})
export class ChatGroupComponent implements OnInit {
  groupname: string;
  description: string;
  messageChat:MessageChatgroup[] = [];
  user: UserModel;

  darkMode: undefined | boolean = !!(
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-color-scheme: white)').matches
  );

  messageEmoji = '';
  showEmojiPicker2 = false;
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
    private socketService: SocketService,
    private authService: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getProfile();
    if(!this.user){
      this.dataService.profile$.subscribe((profile)=>{
        this.user = profile;
      })
    }
    this.Inform();
    this.ReceiveMsgChatGroup();
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker2);
        this.showEmojiPicker2 = !this.showEmojiPicker2;
  }

  addEmoji(event) {
    const { messageEmoji } = this;
    console.log(`${event.emoji.native}`)
    const text = `${messageEmoji}${event.emoji.native}`;

    this.messageEmoji = text;

  }

  Inform(){
    this.socketService.groupInform().subscribe((room : ChatgroupInfo)=>{
      this.groupname = room.groupname;
      this.description = room.description;
      alert('Welcome join to ' + this.groupname + ' group');
    });
    this.socketService.userJoinInform().subscribe((data)=>{
      alert(data);
    })
  }

  SendMsgToChatGroup(message:string){
    if (message === '' || message === undefined || message === null) {
      alert("Message can't be empty !");
    }else{
      this.socketService.chatGroupSend(this.user.name,this.user.avatar,message,Date.now());
      this.messageEmoji = '';
    }
  }

  ReceiveMsgChatGroup(){
    this.socketService.chatGroupReceive().subscribe((message:MessageChatgroup)=>{
      this.messageChat = this.messageChat.concat(message);
    })
  }

}
