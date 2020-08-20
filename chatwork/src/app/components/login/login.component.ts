import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
  GoogleLoginProvider,
} from 'angularx-social-login';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from './../../services/api/api.service';
import { AuthService } from './../../services/auth/auth.service';
import { AuthGuardService } from './../../services/auth/auth-guard.service';

import { Common } from './../../commons/common';
import { ApiStatus } from './../../commons/enum/api-status.enum';
import { CustomeResponse } from './../../commons/interfaces/custome-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLogin: boolean;
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
  ) {}

  ngOnInit() {
    this.authGuardService.checkAuthOut();
    this.isLogin = true;
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
   * changeAction
   * Event when change action login <-> sign up
   * @memberof LoginComponent
   */
  public changeAction() {
    this.isLogin = !this.isLogin;
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
      password: this.loginForm.get(Common.KEYS.password).value,
    };

    // Call login API
    this.apiService
      .sendPostRequest(Common.API.login, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          // Save token and redirect to Home
          this.authService.setToken(data.token);
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
        // stop here if form is invalid
        if (this.signUpForm.invalid) {
          return;
        }
        // Setting data body to request API
        const dataSignup = {
          name: this.signUpForm.get(Common.KEYS.name).value,
          email: this.signUpForm.get(Common.KEYS.email).value,
          password: this.signUpForm.get(Common.KEYS.password).value,
          confirm: this.signUpForm.get(Common.KEYS.confirm).value,
        };
        // Call signup API
        this.apiService
          .sendPostRequest(Common.API.signup, dataSignup)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: CustomeResponse) => {
            if (data.status === ApiStatus.SUCCESS) {
              this.router.navigate([Common.PATHS.login]);
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
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required,  Validators.minLength(8)]),
    });
  }

  /**
   * initSignForm
   * Init signUpForm FormGroup
   * @private
   * @memberof LoginComponent
   */
  private initSignUpForm() {
    this.signUpForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirm: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      { validators: this.checkPasswords }
    );
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
    this.authSocialService.authState.subscribe((user: SocialUser) => {
      if (user) {
        this.authService.setProfile(user);
        let url: string;
        if (user.provider === GoogleLoginProvider.PROVIDER_ID) {
          url = Common.API.googleLogin;
        } else {
          url = Common.API.facebookLogin;
        }
        this.apiService
          .sendPostRequest(url, { access_token: user.authToken })
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: CustomeResponse) => {
            if (data.status === ApiStatus.SUCCESS) {
              // Save token and redirect to Home
              this.authService.setToken(data.token);
              this.authService.isNotRefresh = true;
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
        // location.href = '/' + Common.PATHS.login;
      }
    });
  }

  public get formLoginControls() {
    return this.loginForm.controls;
  }

  public get formSignUpControls() {
    return this.signUpForm.controls;
  }
}
