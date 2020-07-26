import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';

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
  public overlayDisplay = false;

  public userId: string = null;
  public username: string = null;
  public email: string = null;
  public gender: string = null;
  public phone: string = null;
  public address: string = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private authGuardService: AuthGuardService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // redirect to home if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.authGuardService.checkAuthOut();
    this.isLogin = true;
    this.initLoginForm();
    this.initSignUpForm();
    this.overlayDisplay = false;
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
      .sendPostRequestNoAuth(Common.API.login, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          // Save token and redirect to Home
          this.authService.setToken(data.token);
          // this.authService.setEmail(dataBody.email);
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
      .sendPostRequestNoAuth(Common.API.signup, dataSignup)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          // Save token and redirect to Home
          // this.authService.setToken(data.token);
          this.router.navigate([Common.PATHS.login]);
        } else {
          // Show error message
          this.errorMsg = data.message;
        }
      });
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
      password: new FormControl('', [Validators.required]),
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
        name: new FormControl('', [Validators.required]),
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

  public get formLoginControls() {
    return this.loginForm.controls;
  }

  public get formSignUpControls() {
    return this.signUpForm.controls;
  }
}
