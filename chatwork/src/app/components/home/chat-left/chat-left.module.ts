import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatLeftComponent } from './chat-left.component';
import { NgxPopper } from 'angular-popper';
import { ProfileUsersModule } from '../profile-users/profile-users.module';
import { NewchatModule } from '../newchat/newchat.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxPopper,
    ProfileUsersModule,
    NewchatModule
  ],
  exports:[]
})
export class ChatLeftModule { }
