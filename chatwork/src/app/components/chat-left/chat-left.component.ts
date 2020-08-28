import { Component, OnInit, Input } from '@angular/core';

/* importing interfaces starts */
import { Common } from 'src/app/commons/common';
import { takeUntil, first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { Subject } from 'rxjs';
import { ListUsers } from 'src/app/commons/interfaces/list-users';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Users } from 'src/app/commons/interfaces/users';
import { DataService } from 'src/app/services/data/data.service';
import { ChatLeftResponse } from 'src/app/commons/interfaces/chat-left-response';

@Component({
  selector: 'app-chat-left',
  templateUrl: './chat-left.component.html',
  styleUrls: ['./chat-left.component.css'],
})
export class ChatLeftComponent implements OnInit {
  @Input() userId: string;
  public nameusers: string;
  public emailUsers: string;
  public phone: string;
  public avatar: string;
  public address: string;
  public website: string;
  public about: string;
  public selectedUserId: string = null;


  destroy$: Subject<boolean> = new Subject<boolean>();
  imageUrl;

  chatLists: ListUsers[] = [];
  chatListUsers: Users[] = [];

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // this.dataService.userId$.subscribe((userId) => (this.userId = userId));
    this.apiService
    .sendGetRequest(Common.API.profile)
    .pipe(takeUntil(this.destroy$))
    .subscribe((dataResponse: CustomeResponse) => {
      this.userId = dataResponse.data._id;
      this.getChatLeft();
    })
  }

  // getChatLeft() {
  //   this.apiService
  //     .sendGetRequest(Common.API.userList)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((dataResponse: CustomeResponse) => {
  //       this.chatLists = this.chatLists.concat(dataResponse.data);
  //       // this.getAvatarUsers();
  //     });
  // }

  getChatLeft(){
    this.socketService
    .getChatList(this.userId)
    .subscribe((ChatLeftResponse: ChatLeftResponse) => {
      this.renderChatLeft(ChatLeftResponse);
    });
  }

  renderChatLeft(ChatLeftResponse: ChatLeftResponse): void {
    if (!ChatLeftResponse.error) {
      if (ChatLeftResponse.singleUser) {
        if (this.chatListUsers.length > 0) {
          this.chatListUsers = this.chatListUsers.filter((obj: Users) => {
            return obj.id !== ChatLeftResponse.chatList[0].id;            
          });
        }

        /* Adding new online user into chat list array */
        this.chatListUsers = this.chatListUsers.concat(
          ChatLeftResponse.chatList
        );
      } else if (ChatLeftResponse.userDisconnected) {
        const loggedOutUser = this.chatListUsers.findIndex(
          (obj: Users) => obj.id === ChatLeftResponse.userid
        );
        if (loggedOutUser >= 0) {
          this.chatListUsers[loggedOutUser].status = 'invisible';
        }
      } else {
        /* Updating entire chatlist if user logs in. */
        this.chatListUsers = ChatLeftResponse.chatList;
      }
    } else {
      alert(`Unable to load Chat list, Redirecting to Login.`);
    }
  }

  ProfileUsers() {
    const dataBody = {
      id: this.selectedUserId,
    };
    //get Profile
    this.apiService
      .sendPostRequestAuth(Common.API.usersProfile, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: CustomeResponse) => {
        this.nameusers = dataResponse.data.name;
        this.emailUsers = dataResponse.data.email;
        this.phone = dataResponse.data.phone;
        this.avatar = dataResponse.data.avatar;
        this.address = dataResponse.data.address;
        this.website = dataResponse.data.website;
        this.about = dataResponse.data.about;
      });
  }

  isUserSelected(userId: string): boolean {
    if (!this.selectedUserId) {
      return false;
    }
    return this.selectedUserId === userId ? true : false;
  }

  selectedUser(user: Users): void {
    // alert("da chon");
    this.selectedUserId = user.id;
    this.dataService.changeSelectedUser(user);
  }
}
