import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

import { takeUntil, first } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ApiStatus } from 'src/app/commons/enum/api-status.enum';
import { Common } from 'src/app/commons/common';
import { CustomeResponse } from 'src/app/commons/interfaces/custome-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  @Input() username: string;
  @Input() userId: string;
  @Input() email: string;
  @Input() about: string;
  @Input() phone: string;
  @Input() address: string;
  @Input() website: string;

  isTab: boolean;
  errorMsg: string;
  successMsg: string;
  successMsgAbout: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  PersonalForm: FormGroup;
  AboutForm: FormGroup;
  constructor(private apiService: ApiService,  private router: Router,) {}

  ngOnInit(): void {
    this.initPersonalForm();
    this.initAboutForm();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  public UpdatePersonal() {
    const dataBody = {
      id: this.userId,
      name: this.PersonalForm.get('name').value,
      avatar: this.PersonalForm.get('avatar').value,
      address: this.PersonalForm.get('address').value,
      phone: this.PersonalForm.get('phone').value,
      website: this.PersonalForm.get('website').value,
    };
    // Call update API
    this.apiService
      .sendPostRequest(Common.API.update, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          this.router.navigate([Common.PATHS.home]);
          alert(data.message);
          this.successMsg = data.message;
        } else {
          // Show error message
          this.errorMsg = data.message;
        }
      });

  }

  public UpdateAbout() {
    const dataBody = {
      id: this.userId,
      about: this.AboutForm.get('about').value,
    };

    this.apiService
      .sendPostRequest(Common.API.update, dataBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomeResponse) => {
        if (data.status === ApiStatus.SUCCESS) {
          this.successMsgAbout = data.message;
        } else {
          // Show error message
          this.errorMsg = data.message;
        }
      });
  }

  private initPersonalForm() {
    this.PersonalForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      avatar: new FormControl('', [Validators.required]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      phone: new FormControl('', [
        Validators.compose([
          Validators.pattern('^((\\+84-?)|0)?[0-9]{9}$'),
          Validators.minLength(10),
          Validators.required,
        ]),
      ]),
      website: new FormControl('', [Validators.required]),
    });
  }

  private initAboutForm() {
    this.AboutForm = new FormGroup({
      about: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  public get PersonalFormControls() {
    return this.PersonalForm.controls;
  }

  public get AboutFormControls() {
    return this.AboutForm.controls;
  }
}
