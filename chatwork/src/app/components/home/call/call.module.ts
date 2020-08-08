import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallComponent } from './call.component';



@NgModule({
  declarations: [CallComponent],
  imports: [
    CommonModule
  ],
  exports:[
    CallComponent
  ]
})
export class CallModule { }
