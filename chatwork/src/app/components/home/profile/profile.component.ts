import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { ApiService } from 'src/app/services/api/api.service';
import { Common } from './../../../commons/common';
import { takeUntil, first } from 'rxjs/operators';
import { CustomeResponse } from './../../../commons/interfaces/custome-response';
import { AuthService } from './../../../services/auth/auth.service';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ApiStatus } from 'src/app/commons/enum/api-status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit,OnDestroy  {
  @Input() username: string;
  @Input() userId: string;
  @Input() email: string; 
  @Input() gender: string;
  @Input() phone: string;
  @Input() address: string;

  public name: string;
  public avatar: string;
  public add: string;
  public number: string;
  public website: string;
  

  isTab: boolean;
  errorMsg: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  updateForm: FormGroup

  constructor(
    private apiService : ApiService,
  ) { }

  ngOnInit() {
    this.initupdateForm();
    
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  off(){
    document.getElementById("overlay").style.display = "none";
    document.getElementById("profile").style.display = "none";
  }

  public changeAction() {
    this.isTab = !this.isTab;
    if(this.isTab){
      document.getElementById("media").style.display = "none";
      document.getElementById("about").style.display = "block";
    } else{
      document.getElementById("media").style.display = "block";
      document.getElementById("about").style.display = "none";
    }
  }

  public Update() {
    alert(this.updateForm.get(Common.KEYS.name).value);
    const dataBody = {
      // name: this.updateForm.get('name').value,
      // avatar: this.updateForm.get('avatar').value,
      // address: this.updateForm.get('address').value,
      // phone: this.updateForm.get('phone').value,
      // website: this.updateForm.get('website').value

      // name: this.name,
      // avatar: this.avatar,
      // address: this.add,
      // phone: this.number,
      // website: this.website

      name: "hai",
      avatar: "h",
      address: "HN",
      phone: "0383071238",
      website: "thesea"
    };

    // Call login API
    // this.apiService
    //   .sendPostRequest(Common.API.update, dataBody)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: CustomeResponse) => {
    //     if (data.status === ApiStatus.SUCCESS) {
    //       // Save token and redirect to Home

    //       alert(data.message);
    //     } else {
    //       // Show error message
    //       this.errorMsg = data.message;
    //     }
    //   });

  }

  private initupdateForm() {
    this.updateForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      avatar: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
    });
  }

}
