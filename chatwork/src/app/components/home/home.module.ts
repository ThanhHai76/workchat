import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './profile/edit/edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatLeftModule } from './chat-left/chat-left.module';
import { ChatLeftComponent } from './chat-left/chat-left.component';
import { ProfileUsersComponent } from './profile-users/profile-users.component';
import { NewchatComponent } from './newchat/newchat.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    HomeComponent,
    ChatLeftComponent,
    ProfileUsersComponent,
    ProfileComponent,
    EditComponent,
    NewchatComponent
  ],
  exports:[
  ]
})
export class HomeModule {}
