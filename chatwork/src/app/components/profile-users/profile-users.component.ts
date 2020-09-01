import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { Common } from 'src/app/commons/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/commons/model/user.model';

@Component({
  selector: 'app-profile-users',
  templateUrl: './profile-users.component.html',
  styleUrls: ['./profile-users.component.css'],
})
export class ProfileUsersComponent implements OnInit {
  @Input() selectedUserId: string;
  @Input() profileUsers: User;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {

  }

}
