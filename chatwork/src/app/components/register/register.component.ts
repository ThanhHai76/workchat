import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from './../../services/api/api.service';
import { AuthService } from './../../services/auth/auth.service';
import { AuthGuardService } from './../../services/auth/auth-guard.service';

import { Common } from './../../commons/common';
import { ApiStatus } from './../../commons/enum/api-status.enum';
import { CustomeResponse } from './../../commons/interfaces/custome-response';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
