import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

/* importing interfaces starts */
import { MessageRequest } from './../../commons/interfaces/message-request';
import { MessagesResponse } from './../../commons/interfaces/messages-response';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { Common } from 'src/app/commons/common';
/* importing interfaces ends */

@Injectable({
  providedIn: 'root'
})
export class ChatService {

	constructor(
		private apiService: ApiService,
		private http: HttpClient,
		public router: Router
	) { }

	getMessages(params: MessageRequest): Observable<MessagesResponse> {
		return this.apiService.sendPostRequestAuth(Common.API.getMsg,JSON.stringify(params)).pipe(
			map(
				(response: MessagesResponse) => {
					return response;
				},
				(error) => {
					throw error;
				}
			)
		);
	}
}
