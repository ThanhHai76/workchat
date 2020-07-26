import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

/* importing interfaces starts */
import { AuthRequest } from './../../commons/interfaces/auth-request';
import { Auth } from './../../commons/interfaces/auth';
import { UserSessionCheck } from './../../commons/interfaces/user-session-check';
import { MessageRequest } from './../../commons/interfaces/message-request';
import { MessagesResponse } from './../../commons/interfaces/messages-response';
import { map } from 'rxjs/operators';
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
		private http: HttpClient,
		public router: Router
	) { }


	login(params: AuthRequest): Observable<Auth> {
		return this.http.post(`${this.BASE_URL}login`, JSON.stringify(params), this.httpOptions).pipe(
			map(
				(response: Auth) => {
					return response;
				},
				(error) => {
					throw error;
				}
			)
		);
	}

	register(params: AuthRequest): Observable<Auth> {
		return this.http.post(`${this.BASE_URL}register`, JSON.stringify(params), this.httpOptions).pipe(
			map(
				(response: Auth) => {
					return response;
				},
				(error) => {
					throw error;
				}
			)
		);
	}

	userSessionCheck(): Observable<boolean> {
		const userId = localStorage.getItem('userid');
		return new Observable(observer => {
			if (userId !== null && userId !== undefined) {
				this.http.post(`${this.BASE_URL}userSessionCheck`, JSON.stringify({ userId: userId }), this.httpOptions)
				.subscribe(
					(response: UserSessionCheck) => {
						if (response.error) {
							this.router.navigate(['/']);
							return false;
						}
						localStorage.setItem('username', response.username);
						observer.next(true);
					}, (error) => {
						this.router.navigate(['/']);
						observer.next(false);
					});
			} else {
				this.router.navigate(['/']);
				observer.next(false);
			}
		});
	}

	getMessages(params: MessageRequest): Observable<MessagesResponse> {
		return this.http.post(`${this.BASE_URL}getMessages`, JSON.stringify(params), this.httpOptions).pipe(
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
