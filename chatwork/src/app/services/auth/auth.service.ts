// Angular modules
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';

import { SocialUser } from 'angularx-social-login';

// Commons
import { Common } from './../../commons/common';

@Injectable()
export class AuthService {

  private profile: SocialUser;
  public isNotRefresh: boolean;
  constructor(public jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  public noAuthHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  public authHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'JWT ' + this.getToken());
    return headers;
  }

  public authHeaderUploadFile(){
    let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('Authorization', 'JWT ' + this.getToken());
    return headers;
  }


  public setToken(token: string) {
    localStorage.setItem(Common.KEYS.token, token);
  }

  public getToken(): string {
    return localStorage.getItem(Common.KEYS.token);
  }

  public removeToken() {
    localStorage.removeItem(Common.KEYS.token);
    localStorage.removeItem(Common.KEYS.profile);
  }

  public setProfile(profile: SocialUser) {
    localStorage.setItem(Common.KEYS.profile, JSON.stringify(profile));
    this.profile = profile;
  }

  public getProfile(): SocialUser {
    if (!this.profile) {
      this.profile = JSON.parse(localStorage.getItem(Common.KEYS.profile));
    }
    return this.profile;
  }
}
