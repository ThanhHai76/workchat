import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from './../../services/api/api.service';
import { AuthService } from './../../services/auth/auth.service';
import { AuthGuardService } from './../../services/auth/auth-guard.service';

import { Common } from './../../commons/common';
import { ApiStatus } from './../../commons/enum/api-status.enum';
import { CustomeResponse } from './../../commons/interfaces/custome-response';
import { UserModel } from 'src/app/commons/models/UserModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  loginForm: FormGroup;
  signUpForm: FormGroup;
  errorMsg: string;
  successMsg: string;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private authGuardService: AuthGuardService,
    private router: Router,
    private authSocialService: SocialAuthService
  ) { }

  ngOnInit() {
    this.refreshToken();
    this.authGuardService.checkAuthOut();
    this.initLoginForm();
    this.initSignUpForm();
    this.loginWithSocialNetwork();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  /**
   * login
   * Event when loginForm submit
   * @returns void
   * @memberof LoginComponent
   */
  public login() {
    // Check form validate
    if (this.loginForm.invalid) {
      return;
    }

    // Setting data body to request API
    const dataBody = {
      email: this.loginForm.get(Common.KEYS.email).value,
      password: this.loginForm.get(Common.KEYS.password).value
    };

    // Call login API
    this.apiService.sendPostRequest(Common.API.login, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          // Save token and redirect to Home
          this.authService.setToken(data.token);
          this.authService.setRefreshToken(data.refreshToken);
          this.router.navigate([Common.PATHS.home]);
        } else {
          // Show error message
          this.errorMsg = data.message;
        }
      });
  }

  /**
   * signUp
   * Event when signUpForm submit
   * @memberof LoginComponent
   */
  public signUp() {
    // Check form validate
    if (this.signUpForm.invalid) {
      return;
    }

    // Setting data body to request API
    const dataBody = {
      name: this.signUpForm.get(Common.KEYS.name).value,
      email: this.signUpForm.get(Common.KEYS.email).value,
      password: this.signUpForm.get(Common.KEYS.password).value
    };

    // Call login API
    this.apiService.sendPostRequest(Common.API.signup, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          // Show success message
          const element: HTMLElement = document.getElementById('loginTab') as HTMLElement;
          element.click();
          this.successMsg = data.message;
        } else {
          // Show error message
          this.errorMsg = data.message;
        }
      });
  }

  /**
   * signInWithFB
   *
   * @memberof LoginComponent
   */
  public signInWithFB(): void {
    this.authSocialService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  /**
   * signInWithGoogle
   *
   * @memberof LoginComponent
   */
  public signInWithGoogle(): void {
    this.authSocialService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  /**
   * initLoginForm
   * Init loginForm FormGroup
   * @private
   * @memberof LoginComponent
   */
  private initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  /**
   * initSignForm
   * Init signUpForm FormGroup
   * @private
   * @memberof LoginComponent
   */
  private initSignUpForm() {
    this.signUpForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirm: new FormControl(null)
    }, { validators: this.checkPasswords });
  }

  /**
   * checkPasswords
   * Validator confirm password
   * @private
   * @param {FormGroup} group
   * @returns
   * @memberof LoginComponent
   */
  private checkPasswords(group: FormGroup) {
    const pass = group.get(Common.KEYS.password).value;
    const confirmPass = group.get(Common.KEYS.confirm).value;
    return pass === confirmPass ? null : { notSame: true };
  }

  /**
   * loginWithSocialNetwork
   * Call API to save user data
   * @private
   * @memberof LoginComponent
   */
  private loginWithSocialNetwork() {
    this.authSocialService.authState.subscribe((user) => {
      if (user) {
        const userData = new UserModel(user);
        this.authService.setProfile(userData);
        let url: string;
        if (user.provider === GoogleLoginProvider.PROVIDER_ID) {
          url = Common.API.googleLogin;
        } else {
          url = Common.API.facebookLogin;
        }
        this.apiService.sendPostRequest(url, { access_token: user.authToken })
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: CustomeResponse) => {
            if (data.status === ApiStatus.SUCCESS) {
              // Save token and redirect to Home
              this.authService.setToken(data.token);
              this.authService.isNotRefresh = true;
              this.authService.setRefreshToken(data.refreshToken);
              this.router.navigate([Common.PATHS.home]);
            } else {
              // Show error message
              this.errorMsg = data.message;
            }
          });
      } else {
        this.authService.setProfile(null);
        this.authService.removeToken();
        this.router.navigate([Common.PATHS.login]);
      }
    });
  }

  /**
   * refreshToken
   * Refresh token
   * @private
   * @returns
   * @memberof LoginComponent
   */
  private refreshToken() {
    if (this.authService.getRefreshToken() == null) {
      return;
    }

    // Call login API
    this.apiService.sendPostRequest(Common.API.refreshToken, { refreshToken: this.authService.getRefreshToken() })
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          // Save token and redirect to Home
          this.authService.setToken(data.token);
          this.router.navigate([Common.PATHS.home]);
        }
      });
  }

  public get formLoginControls() { return this.loginForm.controls; }

  public get formSignUpControls() { return this.signUpForm.controls; }
}
