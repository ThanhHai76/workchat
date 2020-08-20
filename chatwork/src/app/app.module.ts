import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { RoleGuardService } from './services/auth/role-guard.service';
import { ApiService } from './services/api/api.service';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

import { HomeModule } from './components/home/home.module';
// import { ProfileModule } from './components/profile/profile.module';
import { RegisterModule } from './components/register/register.module';
import { LoginModule } from './components/login/login.module';
import { ResetPasswordModule } from './components/reset-password/reset-password.module';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPopper } from 'angular-popper';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HomeModule,
    LoginModule,
    RegisterModule,
    // ProfileModule,
    // SharedModule,
    ResetPasswordModule,
    FontAwesomeModule,
    HttpClientModule,
    SocialLoginModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxPopper
  ],
  providers: [
    AuthGuardService,
    AuthService,
    RoleGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    ApiService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2965647346823367'),
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('159957289052-k9qaa2dp92avv931ae5vuo9va7upfelp.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
