import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    // FormGroup,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ProfileComponent],
  exports: [
    ProfileComponent
	]
})
export class ProfileModule { }
