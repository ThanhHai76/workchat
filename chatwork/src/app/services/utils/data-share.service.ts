import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from './../../commons/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

	private user = new BehaviorSubject(null);
	selectedUser: Observable<User> = this.user.asObservable();

	constructor() { }


	changeSelectedUser(message: User) {
		this.user.next(message);
	}

}
