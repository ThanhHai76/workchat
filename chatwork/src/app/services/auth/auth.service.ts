// Angular modules
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';
// Commons
import { Common } from './../../commons/common';
import { ApiService } from '../api/api.service';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';

@Injectable()
export class AuthService {

  constructor(
    public jwtHelper: JwtHelperService
  ) {}

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

  public setToken(token: string) {
    localStorage.setItem(Common.KEYS.token, token);
  }

  public getToken(): string {
    return localStorage.getItem(Common.KEYS.token);
  }

  public removeToken() {
    localStorage.removeItem(Common.KEYS.token);
  }

  public getEmail(): string {
    return localStorage.getItem(Common.KEYS.email);
  }

  public setEmail(email: string) {
    localStorage.setItem(Common.KEYS.email, email);
  }

  public removeEmail(){
    localStorage.removeItem(Common.KEYS.email);
  }

}
