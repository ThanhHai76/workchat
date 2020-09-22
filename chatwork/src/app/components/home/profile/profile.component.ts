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
import { DataService } from 'src/app/services/data/data.service';
import { UserModel } from 'src/app/commons/models/UserModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile:UserModel;
  public viewAbout: boolean = true;
  imageUrl;

  errorMsg: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.profile = this.authService.getProfile();
    this.dataService.profile$.subscribe((profile) => {
      this.profile = profile;
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
    this.profile.about = about;
  }

}
