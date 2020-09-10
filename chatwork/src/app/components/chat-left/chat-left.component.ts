import { Component, OnInit, Input } from '@angular/core';

/* importing interfaces starts */
import { Common } from 'src/app/commons/common';
import { takeUntil, first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { Subject } from 'rxjs';
import { ListUsers } from 'src/app/commons/interfaces/list-users';
import { SocketService } from 'src/app/services/socket/socket.service';
import { DataService } from 'src/app/services/data/data.service';
import { User } from 'src/app/commons/model/user.model';

@Component({
  selector: 'app-chat-left',
  templateUrl: './chat-left.component.html',
  styleUrls: ['./chat-left.component.css'],
})
export class ChatLeftComponent implements OnInit {
  @Input() UserId: string;
  public profile: User;
  public profileUsers: ListUsers[] = [];
  public selectedUserId: string = null;

  destroy$: Subject<boolean> = new Subject<boolean>();
  imageUrl;

  chatLists: ListUsers[] = [];

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getChatLeft();
    this.chatleftLogin();
    this.chatleftLogout();
    this.dataService.profile$.subscribe((profile)=>{this.profile = profile})
  }

  getChatLeft() {
    this.apiService
      .sendGetRequest(Common.API.userList)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: CustomeResponse) => {
          this.chatLists = this.chatLists.concat(dataResponse.data);
      });
  }

  chatleftLogin(){
    this.socketService
    .chatleftLogin()
    .subscribe((response: ListUsers) => {
      this.chatLists = this.chatLists.filter((obj:ListUsers)=>{
        return obj._id !== response._id;
      });
      this.chatLists = this.chatLists.concat(response);
      console.log(this.chatLists);
    });
  } 
  
  chatleftLogout(){
    this.socketService
    .chatleftLogout()
    .subscribe((response: ListUsers) => {
      this.chatLists = this.chatLists.filter((obj:ListUsers)=>{
        return obj._id !== response._id;
      });
      this.chatLists = this.chatLists.concat(response);
    });
  } 

  ProfileUsers() {
    this.profileUsers = this.chatLists.filter((obj:ListUsers)=>{
      return obj._id === this.selectedUserId
    });
  }

  isUserSelected(userId: string): boolean {
    if (!this.selectedUserId) {
      return false;
    }
    return this.selectedUserId === userId ? true : false;
  }

  selectedUser(user: ListUsers): void {
    this.selectedUserId = user._id;
    this.dataService.changeSelectedUser(user);
  }
}
