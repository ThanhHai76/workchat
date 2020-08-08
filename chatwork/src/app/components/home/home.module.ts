import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ProfileComponent } from './profile/profile.component';
import { FriendsComponent } from './friends/friends.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { CallComponent } from './call/call.component';
import { EditComponent } from './profile/edit/edit.component';
import { SettingComponent } from './setting/setting.component';
import { ProfileUsersComponent } from './profile-users/profile-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxPopper } from 'angular-popper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmojiModule,
    NgxPopper,
    PickerModule,
  ],
  declarations: [
    HomeComponent,
    ChatListComponent,
    ConversationComponent,
    ProfileComponent,
    FriendsComponent,
    FavoritesComponent,
    CallComponent,
    EditComponent, 
    SettingComponent,
    ProfileUsersComponent
  ],
})
export class HomeModule { } 
