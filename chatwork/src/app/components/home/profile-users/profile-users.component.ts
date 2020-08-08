import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileResponse } from 'src/app/commons/interfaces/profile-response';
import { ApiService } from 'src/app/services/api/api.service';
import { Common } from 'src/app/commons/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile-users',
  templateUrl: './profile-users.component.html',
  styleUrls: ['./profile-users.component.css'],
})
export class ProfileUsersComponent implements OnInit {
  @Input() selectedUserId: string;

  @Input() nameusers: string;
  @Input() email: string;
  @Input() phone: string;
  @Input() avatar: string;
  @Input() address: string;
  @Input() website: string;
  @Input() about: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {

  }

}
