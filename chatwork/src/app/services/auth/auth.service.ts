// Angular modules
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';

// Commons
import { Common } from './../../commons/common';
import { UserModel } from '../../commons/models/UserModel';

@Injectable()
export class AuthService {

  private profile: UserModel;
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
    sessionStorage.setItem(Common.KEYS.token, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(Common.KEYS.token);
  }

  public removeToken() {
    sessionStorage.removeItem(Common.KEYS.token);
    sessionStorage.removeItem(Common.KEYS.profile);
    localStorage.removeItem(Common.KEYS.refreshToken);
  }

  public setProfile(profile: UserModel) {
    sessionStorage.setItem(Common.KEYS.profile, JSON.stringify(profile));
    this.profile = profile;
  }

  public getProfile(): UserModel {
    if (!this.profile && sessionStorage.getItem(Common.KEYS.profile) != null) {
      this.profile = JSON.parse(sessionStorage.getItem(Common.KEYS.profile));
    }
    return this.profile;
  }

  public setRefreshToken(token: string) {
    localStorage.setItem(Common.KEYS.refreshToken, token);
  }

  public getRefreshToken(): string {
    return localStorage.getItem(Common.KEYS.refreshToken);
  }

  public removeRefreshToken() {
    localStorage.removeItem(Common.KEYS.refreshToken);
  }
}
