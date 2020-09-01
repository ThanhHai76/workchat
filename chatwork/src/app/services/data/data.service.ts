import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/commons/model/user.model';
import { ListUsers } from 'src/app/commons/interfaces/list-users';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public profileSubject : BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public aboutSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');
  public avatarSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');
  private userSubject = new BehaviorSubject(null);

  profile$ : Observable<User> = this.profileSubject.asObservable()
  about$ : Observable<string> = this.aboutSubject.asObservable()
  avatar$ : Observable<string> = this.avatarSubject.asObservable()
  selectedUser$: Observable<ListUsers> = this.userSubject.asObservable();
  
  constructor() { }

  setAbout(about: string){
    this.aboutSubject.next(about);
  }

  setAvatar(avatar: string){
    this.avatarSubject.next(avatar);
  }

  changeSelectedUser(selectUser: ListUsers) {
		this.userSubject.next(selectUser);
  }
  
  public setProfile(profile: User) {
    this.profileSubject.next(profile);
  }

}
