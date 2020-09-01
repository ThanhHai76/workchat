import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/commons/model/user.model';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.css']
})
export class NewchatComponent implements OnInit {
  @Input() profileUsers: User;
  @Input() chatLists;
  @Input() selectedUserId: string;

  @Output() OnSelectedUser = new EventEmitter();
  @Output() OnProfileUsers = new EventEmitter();
  @Output() OnIsUserSelected = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  selectedUserInNewChat(user){
    this.OnSelectedUser.emit(user);
  }
  ProfileUsersInNewChat(){
    this.OnProfileUsers.emit();
  }
  isUserSelectedInNewChat(userId:string){
    this.OnIsUserSelected.emit(userId);
  }
}
