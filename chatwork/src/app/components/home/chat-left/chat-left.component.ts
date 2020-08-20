import { Component, OnInit, Input } from '@angular/core';

/* importing interfaces starts */
import { Common } from 'src/app/commons/common';
import { takeUntil, first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { Subject } from 'rxjs';
import { ListUsers } from 'src/app/commons/interfaces/list-users';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-chat-left',
  templateUrl: './chat-left.component.html',
  styleUrls: ['./chat-left.component.css'],
})
export class ChatLeftComponent implements OnInit {
  public nameusers: string;
  public emailUsers: string;
  public phone: string;
  public avatar: string;
  public address: string;
  public website: string;
  public about: string;
  public selectedUserId: string = null;

  destroy$: Subject<boolean> = new Subject<boolean>();
  chatLists: ListUsers[] = [];
  imageUrl;
  avatarUsers: string[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getChatLeft();
  }

  getChatLeft() {
    this.apiService
      .sendGetRequest(Common.API.userList)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: CustomeResponse) => {
        this.chatLists = this.chatLists.concat(dataResponse.data);
        // this.getAvatarUsers();
      });
  }

  // getAvatarUsers() {
  //   this.chatLists.forEach((obj: ListUsers) => {
  //     if (!obj.social_id) {
  //       this.getAvatar(obj.avatar);
  //     }
  //   });
  // }

  // getAvatar(image) {
  //   const bodyData = { filename: image };
  //   this.apiService
  //     .sendPostRequestGetFile(Common.API.getAvatar, bodyData)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data) => {
  //       //Show image preview
  //       var reader = new FileReader();
  //       reader.readAsDataURL(data);
  //       reader.onloadend = () => {
  //         this.imageUrl = reader.result;
  //         this.avatarUsers = this.avatarUsers.concat(this.imageUrl);
  //       };
  //     });
  // }

  ProfileUsers() {
    const dataBody = {
      id: this.selectedUserId,
    };
    //get Profile
    this.apiService
      .sendPostRequestAuth(Common.API.usersProfile, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: CustomeResponse) => {
        this.nameusers = dataResponse.data.name;
        this.emailUsers = dataResponse.data.email;
        this.phone = dataResponse.data.phone;
        this.avatar = dataResponse.data.avatar;
        this.address = dataResponse.data.address;
        this.website = dataResponse.data.website;
        this.about = dataResponse.data.about;
      });
  }

  isUserSelected(userId: string): boolean {
    if (!this.selectedUserId) {
      return false;
    }
    return this.selectedUserId === userId ? true : false;
  }

  selectedUser(user: ListUsers): void {
    // alert("da chon");
    this.selectedUserId = user._id;
    // this.dataShareService.changeSelectedUser(user);
  }
}
