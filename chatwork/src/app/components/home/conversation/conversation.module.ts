import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { ConversationComponent } from './conversation.component';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms'; 

import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { NgxPopper } from 'angular-popper';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		FormsModule,
		ReactiveFormsModule, 
		PickerModule,
		EmojiModule,
		NgxPopper,
		GhButtonModule
	],
	declarations: [ConversationComponent],
	exports: [
		ConversationComponent
	]
}) 
export class ConversationModule { }
