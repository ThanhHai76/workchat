import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Users } from 'src/app/commons/interfaces/users';
import { User } from 'src/app/commons/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private profile: User;
  public aboutSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userIdSubject : BehaviorSubject <string> = new BehaviorSubject <string>('');
  private user = new BehaviorSubject(null);

  about$ : Observable<string> = this.aboutSubject.asObservable()
  userId$ : Observable<string> = this.userIdSubject.asObservable()
  selectedUser: Observable<Users> = this.user.asObservable();
  
  constructor() { }
  
  setAbout(about: string){
    this.aboutSubject.next(about);
  }

  setUserId(userId: string){
    this.userIdSubject.next(userId);
  }

  changeSelectedUser(message: Users) {
		this.user.next(message);
  }
  
  public setProfile(profile: User) {
    this.profile = profile;
  }

  public getProfile(): User {
    return this.profile;
  }

}
