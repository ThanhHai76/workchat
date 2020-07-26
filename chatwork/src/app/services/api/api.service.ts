import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { User } from './../../commons/interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequest(url: string) {
    return this.httpClient
      .get(url, { headers: this.authService.authHeaders() })
      .pipe(catchError(this.handleError));
  }

  public sendPostRequestNoAuth(url: string, requestData: any) {
    // console.log(this.authService.noAuthHeaders());
    return this.httpClient
      .post(url, requestData, { headers: this.authService.noAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  public sendPostRequest(url: string, requestData: any) {
    return this.httpClient
      .post(url, requestData, { headers: this.authService.authHeaders() }) 
      .pipe(catchError(this.handleError));
  }
}
