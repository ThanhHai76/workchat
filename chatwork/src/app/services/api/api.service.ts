import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Common } from 'src/app/commons/common';
import { ApiStatus } from 'src/app/commons/enum/api-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) { }

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
    if (error.status === ApiStatus.AUTH_FAIL) {
      localStorage.clear();
      location.href = '/' + Common.PATHS.login;
    }
    return throwError(errorMessage);
  }

  public sendGetRequest(url: string) {
    return this.httpClient
      .get(url, { headers: this.authService.authHeaders() })
      .pipe(catchError(this.handleError));
  }

  public sendPostRequest(url: string, requesData: any) {
    return this.httpClient.post(url, requesData, { headers: this.authService.noAuthHeaders() }).pipe(catchError(this.handleError));
  }

  public sendPostRequestAuth(url: string, requesData: any) {
    return this.httpClient.post(url, requesData, { headers: this.authService.authHeaders() }).pipe(catchError(this.handleError));
  }

  
  // public sendPostRequestGetFile(url: string, requesData: any) {
  //   return this.httpClient.post(url, requesData, {responseType : 'blob', headers: this.authService.authHeaders() }).pipe(catchError(this.handleError));
  // }

  public sendPostRequestFile(url: string, formData: any) {
    return this.httpClient.post(url, formData,  { headers: this.authService.authHeaderUploadFile() } ).pipe(catchError(this.handleError));
  }
}
