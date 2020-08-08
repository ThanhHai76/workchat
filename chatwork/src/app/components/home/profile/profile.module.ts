import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EditComponent } from './edit/edit.component';


@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule, ReactiveFormsModule],
  declarations: [ProfileComponent, EditComponent],
  exports: [ProfileComponent],
})
export class ProfileModule {}
