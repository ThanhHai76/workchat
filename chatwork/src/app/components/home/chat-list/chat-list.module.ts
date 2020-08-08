import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatListComponent } from './chat-list.component';
import { NgxPopper } from 'angular-popper';
import { ProfileUsersModule } from '../profile-users/profile-users.module';

@NgModule({
	imports: [
		CommonModule,
		NgxPopper,
		ProfileUsersModule
	],
	declarations: [ChatListComponent],
	exports: [
		ChatListComponent 
	]
})
export class ChatListModule { }
