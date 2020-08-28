import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

import { takeUntil, first } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiStatus } from 'src/app/commons/enum/api-status.enum';
import { Common } from 'src/app/commons/common';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { Router, NavigationEnd } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { User } from 'src/app/commons/model/user.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  AboutRefresh: string;
  about: string;
  avatar: string;
  @Input() userId: string;
  @Input() profile: User;

  @Output() OnCheckViewProfile = new EventEmitter();
  @Output() OnAboutContent = new EventEmitter();

  isTab: boolean;
  errorMsg: string;
  successMsg: string;
  successMsgAbout: string;
  successMsgSocial: string;

  images: File = null;
  ischecked: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  PersonalForm: FormGroup;
  AboutForm: FormGroup;
  SocialForm: FormGroup;
  userSocial: SocialUser;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.userSocial = this.authService.getProfile();
    // this.profile = this.dataService.getProfile();
    this.initPersonalForm();
    this.initAboutForm();
    this.initSocialForm();

    this.dataService.about$.subscribe((about) => (this.AboutRefresh = about));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      //Show image preview
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profile.avatar = event.target.result;
      };
      reader.readAsDataURL(this.images);
    }
  }

  SendFile() {
    const formData = new FormData();
    formData.append('file', this.images);

    this.apiService
      .sendPostRequestFile(Common.API.upload, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          // alert(data.message);
        }
      });
  }

  public UpdatePersonal() {
    //Normal users
    if (!this.userSocial) {
      var avatarValue: string;
      if (this.images) {
        avatarValue =
          Common.PATHS.domain + '/static/uploads/' + this.images.name;
          this.SendFile();
      } else {
        avatarValue = '';
      }
      const dataBody = {
        id: this.userId,
        name: this.PersonalForm.get('name').value,
        avatar: avatarValue,
        address: this.PersonalForm.get('address').value,
        phone: this.PersonalForm.get('phone').value,
        website: this.PersonalForm.get('website').value,
      };
      // Call update API
      this.apiService
        .sendPostRequestAuth(Common.API.update, dataBody)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: CustomeResponse) => {
          if (data.status === ApiStatus.SUCCESS) {
            this.router.navigate([Common.PATHS.home]);
            alert(data.message);
            this.successMsg = data.message;
          } else {
            // Show error message
            this.errorMsg = data.message;
          }
        });
    } else {
      //Social users
      const dataBody = {
        id: this.userId,
        address: this.PersonalForm.get('address').value,
        phone: this.PersonalForm.get('phone').value,
        website: this.PersonalForm.get('website').value,
      };
      this.apiService
        .sendPostRequestAuth(Common.API.updateSocialUser, dataBody)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: CustomeResponse) => {
          if (data.status === ApiStatus.SUCCESS) {
            this.router.navigate([Common.PATHS.home]);
            alert(data.message);
            this.successMsg = data.message;
          } else {
            // Show error message
            this.errorMsg = data.message;
          }
        });
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  public UpdateAbout() {
    const dataBody = {
      id: this.userId,
      about: this.AboutForm.get('about').value,
    };
    //Normal users
    if (!this.userSocial) {
      this.apiService
        .sendPostRequestAuth(Common.API.update, dataBody)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: CustomeResponse) => {
          if (data.status === ApiStatus.SUCCESS) {
            this.successMsgAbout = data.message;
            alert(data.message);
          } else {
            // Show error message
            this.errorMsg = data.message;
          }
        });
    } else {
      //Social Users
      this.apiService
        .sendPostRequestAuth(Common.API.updateSocialUser, dataBody)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: CustomeResponse) => {
          if (data.status === ApiStatus.SUCCESS) {
            this.successMsgAbout = data.message;
            alert(data.message);
          } else {
            // Show error message
            this.errorMsg = data.message;
          }
        });
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  public UpdateSocial() {
    const dataBody = {
      id: this.userId,
      facebook: this.SocialForm.get('facebook').value,
      youtube: this.SocialForm.get('youtube').value,
      google: this.SocialForm.get('google').value,
      twitter: this.SocialForm.get('twitter').value,
      instagram: this.SocialForm.get('instagram').value,
      linkedin: this.SocialForm.get('linkedin').value,
      globe: this.SocialForm.get('globe').value,
      whatsapp: this.SocialForm.get('whatsapp').value,
    };
      this.apiService
        .sendPostRequestAuth(Common.API.updateSocialLink, dataBody)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: CustomeResponse) => {
          if (data.status === ApiStatus.SUCCESS) {
            this.successMsgSocial = data.message;
            alert(data.message);
          } else {
            // Show error message
            this.errorMsg = data.message;
          }
        });
  }

  private initPersonalForm() {
    this.PersonalForm = new FormGroup({
      name: new FormControl('', [Validators.minLength(6)]),
      avatar: new FormControl('', [Validators.minLength(4)]),
      address: new FormControl('', [Validators.minLength(6)]),
      phone: new FormControl('', [
        Validators.compose([
          Validators.pattern('^((\\+84-?)|0)?[0-9]{9}$'),
          Validators.minLength(10),
        ]),
      ]),
      website: new FormControl('', [Validators.minLength(10)]),
    });
  }

  private initAboutForm() {
    this.AboutForm = new FormGroup({
      about: new FormControl('', [Validators.minLength(20)]),
      checkbox: new FormControl('', [Validators.required]),
    });
  }

  private initSocialForm() {
    this.SocialForm = new FormGroup({
      facebook: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      youtube: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      google: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      twitter: new FormControl('', [Validators.minLength(10)]),
      instagram: new FormControl('', [Validators.minLength(10)]),
      linkedin: new FormControl('', [Validators.minLength(10)]),
      globe: new FormControl('', [Validators.minLength(10)]),
      whatsapp: new FormControl('', [Validators.minLength(10)]),
    });
  }

  checkCheckBoxvalue(about: string) {
    let checkbox = this.AboutForm.get('checkbox').value;
    this.OnCheckViewProfile.emit(checkbox);
    if (checkbox === '') this.OnAboutContent.emit(this.AboutRefresh);
    else this.OnAboutContent.emit(about);
  }
  refresh() {
    this.about = this.AboutRefresh;
    this.OnAboutContent.emit(this.AboutRefresh);
  }

  public get PersonalFormControls() {
    return this.PersonalForm.controls;
  }
  public get AboutFormControls() {
    return this.AboutForm.controls;
  }
  public get SocialFormControls() {
    return this.SocialForm.controls;
  }
}
