import { UserModel } from './../../../commons/models/UserModel';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocialUser, SocialAuthService } from 'angularx-social-login';

import { ApiService } from '../../../services/api/api.service';
import { AuthService } from '../../../services/auth/auth.service';

import { ApiStatus } from '../../../commons/enum/api-status.enum';
import { Common } from '../../../commons/common';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Auth } from 'src/app/commons/interfaces/auth';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: UserModel;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private authSocialService: SocialAuthService,
    private socketService: SocketService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.user = this.authService.getProfile();
    this.dataService.profile$.subscribe((profile) => {
      this.user = profile;
    });
    // if (this.user == null) {
      this.getProfile();
    // }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  /**
   * Get profile
   *
   * @memberof HeaderComponent
   */
  public getProfile() {
    // Call login API
    this.apiService
      .sendPostRequestAuth(Common.API.profile, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data.status === ApiStatus.SUCCESS) {
          this.authService.setProfile(data.user);
          this.dataService.setProfile(data.user);
          this.dataService.setUserId(this.user._id);
          this.dataService.setAbout(this.user.about);
          this.dataService.setAvatar(this.user.avatar);
          this.user = this.authService.getProfile();
          //socket connection
          this.establishSocketConnection();
        } else {
          console.error(data.status);
        }
      });
  }

  establishSocketConnection() {
    /* making socket connection by passing UserId. */
    this.socketService.connectSocket(this.user._id);
  }

  /**
   * Logout
   *
   * @memberof HeaderComponent
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
            this.socketService
              .logout(this.user._id)
              .subscribe((response: Auth) => {});
            this.authService.removeToken();
            this.router.navigate([Common.PATHS.login]);
          }
        } else {
          console.error(data.status);
        }
      });
  }
}
