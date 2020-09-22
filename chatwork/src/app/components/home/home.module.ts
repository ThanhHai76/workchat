import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';
import { ChatLeftComponent } from './chat-left/chat-left.component';
import { ChatboxRightComponent } from './chatbox-right/chatbox-right.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NgxPopper } from 'angular-popper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NewchatComponent } from './newchat/newchat.component';
import { ProfileUsersComponent } from './profile-users/profile-users.component';
import { SettingComponent } from './setting/setting.component';
import { CallBoxComponent } from './call-box/call-box.component';
import { ChatGroupComponent } from './chat-group/chat-group.component';
import { FriendsComponent } from './friends/friends.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    EmojiModule,
    NgxPopper,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    Ng2SearchPipeModule
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    ChatLeftComponent,
    ChatboxRightComponent,
    ProfileComponent,
    EditProfileComponent,
    NewchatComponent,
    ProfileUsersComponent,
    SettingComponent,
    CallBoxComponent,
    ChatGroupComponent,
    FriendsComponent,
    FavoritesComponent
  ]
})
export class HomeModule { }
