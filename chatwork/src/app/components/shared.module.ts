import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './home/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { ChatLeftComponent } from './home/chat-left/chat-left.component';
import { ChatLeftModule } from './home/chat-left/chat-left.module';
import { ProfileUsersComponent } from './home/profile-users/profile-users.component';
import { EditComponent } from './home/profile/edit/edit.component';
import { NewchatComponent } from './home/newchat/newchat.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileUsersComponent,
    ChatLeftComponent,
    ProfileComponent,
    EditComponent,
    NewchatComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    HomeComponent,
    ChatLeftComponent,
    ProfileUsersComponent,
    ProfileComponent,
    EditComponent,
    NewchatComponent
  ],
  providers: [Location]
})
export class SharedModule { }
