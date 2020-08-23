import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { Common } from 'src/app/commons/common';
import { takeUntil, first, reduce } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { SocialUser } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input() username: string;
  @Input() userId: string;
  @Input() phone: string;
  @Input() avatar: string;
  @Input() socialAvatar: string;
  @Input() address: string;
  @Input() website: string;
  @Input() about: string;
  @Input() facebook: string;
  @Input() google: string;
  @Input() youtube: string;

  user: SocialUser;
  mySubscription: any;

  public image: Blob = null;
  public viewAbout: boolean = true;
  public AboutRefresh: string;
  imageUrl;

  errorMsg: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getProfile();
    this.apiService
      .sendGetRequest(Common.API.profile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: CustomeResponse) => {
        this.avatar = dataResponse.data.avatar;
        this.AboutRefresh = dataResponse.data.about;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  ViewProfile(checkbox: any) {
    if (checkbox === true) this.viewAbout = true;
    else this.viewAbout = false;
  }
  ViewAboutContent(about: string) {
    this.about = about;
  }

  // getAvatar() {
  //   const bodyData = { filename: this.avatar };
  //   this.apiService
  //     .sendPostRequestGetFile(Common.API.getAvatar, bodyData)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data) => {
  //       // console.log(data);

  //       //Show image
  //       var reader = new FileReader();
  //       reader.readAsDataURL(data);
  //       reader.onloadend = () => {
  //         this.imageUrl = reader.result;
  //         // console.log(this.imageUrl);
  //         this.sendAvatar.emit(this.imageUrl);
  //       };
  //     });
  // }
}
