import { Component, OnInit, Input, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  @Input() username: string;
  @Input() userId: string;
  @Input() email: string; 
  @Input() about: string;
  @Input() phone: string;
  @Input() address: string; 
  @Input() website: string;

  isTab: boolean;


  constructor(
  ) { }

  ngOnInit() {
    
  }

  public changeAction() {
    this.isTab = !this.isTab;
    if(this.isTab){
      document.getElementById("media").style.display = "block";
      document.getElementById("about").style.display = "none";
    } else{
      document.getElementById("media").style.display = "none";
      document.getElementById("about").style.display = "block";
    }
  }

}
