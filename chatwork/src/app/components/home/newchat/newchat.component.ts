import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from 'src/app/commons/models/UserModel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.css']
})
export class NewchatComponent implements OnInit {
  searchText;
  user: UserModel;
  @Input() profileUsers: UserModel;
  @Input() chatLists;
  @Input() selectedUserId: string;

  @Output() OnSelectedUser = new EventEmitter();
  @Output() OnProfileUsers = new EventEmitter();
  @Output() OnIsUserSelected = new EventEmitter();
  constructor(
    private authService:AuthService,
    private socketService:SocketService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getProfile();
    if(!this.user){
      this.dataService.profile$.subscribe((profile)=>{
        this.user = profile;
      })
    }
  }

  CreateGroup(groupname:string, description:string){
    this.socketService.newGroup(this.user.name, groupname, description);
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
