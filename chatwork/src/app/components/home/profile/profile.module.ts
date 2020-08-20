import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ProfileComponent, EditComponent
  ], 
  exports:[
    ProfileComponent
  ]
})
export class ProfileModule { }
