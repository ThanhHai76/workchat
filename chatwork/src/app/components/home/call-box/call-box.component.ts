import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/commons/models/UserModel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-call-box',
  templateUrl: './call-box.component.html',
  styleUrls: ['./call-box.component.css']
})
export class CallBoxComponent implements OnInit {
  user: UserModel;
  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getProfile();
  }

}
