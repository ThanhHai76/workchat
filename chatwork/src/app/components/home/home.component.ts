import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SocialAuthService,
  SocialUser,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

import { ApiService } from '../../services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Common } from '../../commons/common';
import { ApiStatus } from '../../commons/enum/api-status.enum';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Auth } from 'src/app/commons/interfaces/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  user: SocialUser;
  destroy$: Subject<boolean> = new Subject<boolean>();

  errorMsg: string;

  public username: string;
  public userId: string;
  public email: string;
  public phone: string;
  public avatar: string;
  public address: string;
  public website: string;
  public about: string;
  public facebook: string;
  public google: string;
  public youtube: string;
  
  mySubscription: any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private authSocialService: SocialAuthService,
    private socketService: SocketService,
  ) 
  {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {
    this.user = this.authService.getProfile();

    //get Profile
    this.apiService
      .sendGetRequest(Common.API.profile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: CustomeResponse) => {
        this.userId = dataResponse.data._id;
        this.username = dataResponse.data.name;
        this.email = dataResponse.data.email;
        this.phone = dataResponse.data.phone;
        this.avatar = dataResponse.data.avatar;
        this.address = dataResponse.data.address;
        this.website = dataResponse.data.website;
        this.about = dataResponse.data.about;
        this.facebook = dataResponse.data.social_link.facebook;
        this.google = dataResponse.data.social_link.google;
        this.youtube = dataResponse.data.social_link.youtube;
        
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
            this.authService.removeToken();
            this.router.navigate([Common.PATHS.login]);
            //remove socketId
            this.socketService
            .logout({ userId: this.userId })
            .subscribe((response: Auth) => {});
          }
        } else {
          console.error(data.status);
        }
      });
  }

}
