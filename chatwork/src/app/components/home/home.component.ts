import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocialAuthService, SocialUser } from 'angularx-social-login';

import { ApiService } from '../../services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Common } from '../../commons/common';
import { ApiStatus } from '../../commons/enum/api-status.enum';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Auth } from 'src/app/commons/interfaces/auth';
import { DataService } from 'src/app/services/data/data.service';
import { User } from 'src/app/commons/model/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  profile: User;
  user: SocialUser;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public userId: string;
  public username: string;
  public about: string;
  public avatar: string;

  errorMsg: string;
  mySubscription: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private authSocialService: SocialAuthService,
    private socketService: SocketService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // this.user = this.authService.getProfile();
    this.dataService.profile$.subscribe((profile) => (this.profile = profile));
    this.getProfile();
  }

  public getProfile() {
    this.apiService
      .sendGetRequest(Common.API.profile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: CustomeResponse) => {
        this.profile = dataResponse.data;
        this.userId = dataResponse.data._id;
        this.username = dataResponse.data.name;
        this.about = dataResponse.data.about;
        this.avatar = dataResponse.data.avatar;

        this.dataService.setUserId(this.userId);
        this.dataService.setProfile(this.profile);
        this.dataService.setAbout(this.about);
        this.dataService.setAvatar(this.avatar);

        //socket connection
        this.establishSocketConnection();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  establishSocketConnection() {
    try {
      /* making socket connection by passing UserId. */
      this.socketService.connectSocket(this.userId);
    } catch (error) {
      alert('Something went wrong');
    }
  }

  /**
   * Logout
   *
   * @memberof HomeComponent
   */
  public logout() {
    // Call login API
    this.apiService
      .sendPostRequestAuth(Common.API.logout, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data.status === ApiStatus.SUCCESS) {
          if (this.authService.isNotRefresh) {
            this.authSocialService.signOut();
          } else {
            //remove socketId
            this.dataService.userId$.subscribe((userId) => {
              this.socketService
                .logout(userId)
                .subscribe((response: Auth) => {});
            });
            this.authService.removeToken();
            setTimeout(()=>{
              this.router.navigate([Common.PATHS.login]);
            },200)
          }
        } else {
          console.error(data.status);
        }
      });
  }
}
