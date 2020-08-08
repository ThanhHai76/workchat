import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

/* Importing services starts*/
import { ChatService } from './../../../services/chat/chat.service';
import { SocketService } from './../../../services/socket/socket.service';
import { DataShareService } from './../../../services/utils/data-share.service';

/* importing interfaces starts */
import { User } from './../../../commons/interfaces/user';
import { ChatListResponse } from './../../../commons/interfaces/chat-list-response';
import { Common } from 'src/app/commons/common';
import { takeUntil, first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { Subject } from 'rxjs';
import { ProfileResponse } from 'src/app/commons/interfaces/profile-response';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit{
  @Input() username: string;
  @Input() userId: string;

  public nameusers: string;
  public email: string;
  public phone: string;
  public avatar: string;
  public address: string;
  public website: string;
  public about: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  selectedUserId: string = null;
  chatListUsers: User[] = [];

  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private apiService: ApiService,
    private dataShareService: DataShareService
  ) {
  }

  ngOnInit() {
    this.apiService
      .sendGetRequest(Common.API.profile)
      .pipe(takeUntil(this.destroy$)) 
      .subscribe((dataResponse: CustomeResponse) => {
        this.userId = dataResponse.id;

        this.getChatList();
      });
  }

  getChatList(){
    this.socketService
    .getChatList(this.userId)
    .subscribe((chatListResponse: ChatListResponse) => {
      this.renderChatList(chatListResponse);
    });
  }

  renderChatList(chatListResponse: ChatListResponse): void {
    // alert(chatListResponse.error);
    if (!chatListResponse.error) {
      if (chatListResponse.singleUser) {
        if (this.chatListUsers.length > 0) {
          this.chatListUsers = this.chatListUsers.filter((obj: User) => {//Phương thức filter() dùng để tạo một mảng mới với tất cả các phần tử thỏa điều kiện của một hàm test
            return obj.id !== chatListResponse.chatList[0].id;            // return true và giữ nguyên mảng cũ không bị ảnh hưởng.
          });
        }

        /* Adding new online user into chat list array */
        this.chatListUsers = this.chatListUsers.concat(
          chatListResponse.chatList
        );
      } else if (chatListResponse.userDisconnected) {
        const loggedOutUser = this.chatListUsers.findIndex(
          (obj: User) => obj.id === chatListResponse.userid
        );
        if (loggedOutUser >= 0) {
          this.chatListUsers[loggedOutUser].status = 'invisible';
        }
      } else {
        /* Updating entire chatlist if user logs in. */
        this.chatListUsers = chatListResponse.chatList;
      }
    } else {
      alert(`Unable to load Chat list, Redirecting to Login.`);
    }
  }

  isUserSelected(userId: string): boolean {
    if (!this.selectedUserId) {
      return false;
    }
    return this.selectedUserId === userId ? true : false;
  }
  
  selectedUser(user: User): void {
    // alert("da chon");
    this.selectedUserId = user.id;
    this.dataShareService.changeSelectedUser(user);
  }

  ProfileUsers(){
    const dataBody = {
      id: this.selectedUserId,
    };
    //get Profile
    this.apiService
      .sendPostRequest(Common.API.usersProfile, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: ProfileResponse) => {
        this.nameusers = dataResponse.name;
        this.email = dataResponse.email;
        this.phone = dataResponse.phone;
        // this.avatar = dataResponse.avatar;
        this.address = dataResponse.address;
        this.website = dataResponse.website;
        this.about = dataResponse.about;
      });
  }


}
