import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChatLeftComponent } from './chat-left/chat-left.component';
import { NewchatComponent } from './newchat/newchat.component';
import { ProfileUsersComponent } from './profile-users/profile-users.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatboxRightComponent } from './chatbox-right/chatbox-right.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NgxPopper } from 'angular-popper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    EditProfileComponent,
    ChatLeftComponent,
    NewchatComponent,
    ProfileUsersComponent,
    ChatboxRightComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    EmojiModule,
    NgxPopper,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    EditProfileComponent,
    ChatLeftComponent,
    NewchatComponent,
    ProfileUsersComponent,
    ChatboxRightComponent,
  ],
})
export class SharedModule {}
