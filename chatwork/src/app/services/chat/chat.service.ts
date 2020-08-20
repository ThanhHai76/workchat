import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

/* importing interfaces starts */
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { Common } from 'src/app/commons/common';
/* importing interfaces ends */

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private BASE_URL = environment.apiUrl;
	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		})
	};

	constructor(
		private apiService: ApiService,
		private http: HttpClient,
		public router: Router
	) { }

	// getMessages(params: MessageRequest): Observable<MessagesResponse> {
	// 	return this.http.post(`${this.BASE_URL}api/getMessages`, JSON.stringify(params), this.httpOptions).pipe(
	// 		map(
	// 			(response: MessagesResponse) => {
	// 				return response;
	// 			},
	// 			(error) => {
	// 				throw error;
	// 			}
	// 		)
	// 	);
	// }

	// getMessages(params: MessageRequest): Observable<MessagesResponse> {
	// 	return this.apiService.sendPostRequest(Common.API.getMsg,JSON.stringify(params)).pipe(
	// 		map(
	// 			(response: MessagesResponse) => {
	// 				return response;
	// 			},
	// 			(error) => {
	// 				throw error;
	// 			}
	// 		)
	// 	);
	// }
}
