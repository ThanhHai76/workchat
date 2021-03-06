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
import { RegisterModule } from './components/register/register.module';
import { LoginModule } from './components/login/login.module';
import { ResetPasswordModule } from './components/reset-password/reset-password.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
    ResetPasswordModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuardService,
    AuthService,
    RoleGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
