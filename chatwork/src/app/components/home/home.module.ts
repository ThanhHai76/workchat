import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ProfileComponent } from './profile/profile.component';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HomeComponent,
    ChatListComponent,
    ConversationComponent,
    ProfileComponent,
    // FormsModule,
    // ReactiveFormsModule 
  ],
})
export class HomeModule { } 
