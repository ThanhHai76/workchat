import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUsersComponent } from './profile-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProfileUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    ProfileUsersComponent
  ]
})
export class ProfileUsersModule { }
