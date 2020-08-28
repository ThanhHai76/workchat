import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.css']
})
export class NewchatComponent implements OnInit {
  @Input() chatLists;

  @Input() selectedUserId: string;

  @Input() nameusers: string;
  @Input() email: string;
  @Input() phone: string;
  @Input() avatar: string;
  @Input() avatarUrl: string;
  @Input() address: string;
  @Input() website: string;
  @Input() about: string;

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
