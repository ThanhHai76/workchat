import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket/socket.service';

import { ApiService } from 'src/app/services/api/api.service';
import { Common } from './../../commons/common';
import { takeUntil, first } from 'rxjs/operators';
import { ApiStatus } from './../../commons/enum/api-status.enum';
import { CustomeResponse } from './../../commons/interfaces/custome-response';
import { AuthService } from './../../services/auth/auth.service';
import { Subject } from 'rxjs';
import { Auth } from 'src/app/commons/interfaces/auth';
import { ChatListResponse } from 'src/app/commons/interfaces/chat-list-response';
import { User } from 'src/app/commons/interfaces/user';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ProfileResponse } from 'src/app/commons/interfaces/profile-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  errorMsg: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  public userId: string = null;
  public username: string = null;
  public email: string = null;
  public gender: string = null;
  public phone: string = null;
  public address: string = null;
  public website: string = null;
  public about: string = null;

  selectedUserId: string = null;
  chatListUsers: User[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService,
    private chatService: ChatService,

  ) {}

  ngOnInit() {
    //get Profile
    this.apiService
      .sendGetRequest(Common.API.profile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: ProfileResponse) => {
        this.userId = dataResponse.id;
        this.username = dataResponse.name;
        this.email = dataResponse.email;
        this.phone = dataResponse.phone;
        this.address = dataResponse.address;
        this.website = dataResponse.website;
        this.about = dataResponse.about;
        //socket connection
        this.establishSocketConnection();
      });
      
  }
 
  establishSocketConnection() {
    try {
      /* making socket connection by passing UserId. */
      this.socketService.connectSocket(this.userId);
    } catch (error) {
      alert('Something went wrong');
    }
  }

  logout() {
    
    this.socketService
    .logout({ userId: this.userId })
    .subscribe((response: Auth) => {});

    this.apiService
      .sendPostRequest(Common.API.logout + this.userId,{})
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        this.authService.removeToken();
        this.router.navigate([Common.PATHS.login]);
      });

  }

  // off() {
  //   document.getElementById('overlay').style.display = 'none';
  //   document.getElementById('profile').style.display = 'none';
  //   document.getElementById('overlay2').style.display = 'none';
  // }

  // profile() {
  //   document.getElementById('profile').style.display = 'block';
  //   document.getElementById('overlay').style.display = 'block';
  // }
}
