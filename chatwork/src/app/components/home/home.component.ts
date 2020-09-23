import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
<<<<<<< HEAD
  profilemerge: string;
=======

  testmerge: string;
>>>>>>> test-merge
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
