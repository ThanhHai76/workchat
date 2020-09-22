import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListUsers } from 'src/app/commons/interfaces/list-users';
import { UserModel } from 'src/app/commons/models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public profileSubject : BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);
  private ListUserSubject : BehaviorSubject<ListUsers> = new BehaviorSubject<ListUsers>(null);
  public userIdSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');
  public aboutSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');
  public avatarSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');
  private userSubject = new BehaviorSubject(null);

  profile$ : Observable<UserModel> = this.profileSubject.asObservable()
  listUser$: Observable<ListUsers> = this.ListUserSubject.asObservable();
  userId$: Observable<string> = this.userIdSubject.asObservable();
  about$ : Observable<string> = this.aboutSubject.asObservable()
  avatar$ : Observable<string> = this.avatarSubject.asObservable()
  selectedUser$: Observable<ListUsers> = this.userSubject.asObservable();

  constructor() { }

  setUserId(userId: string){
    this.userIdSubject.next(userId);
  }

  setAbout(about: string){
    this.aboutSubject.next(about);
  }

  setAvatar(avatar: string){
    this.avatarSubject.next(avatar);
  }

  changeSelectedUser(selectUser: ListUsers) {
		this.userSubject.next(selectUser);
  }
  
  setProfile(profile: UserModel) {
    this.profileSubject.next(profile);
  }

  setListUser(list: ListUsers){
    this.ListUserSubject.next(list);
  }

}
