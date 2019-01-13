import { Component, OnDestroy } from '@angular/core';

import { Unsubscribable } from 'pkgs/unsub';
import { interval } from 'rxjs';
import { tap, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
@Unsubscribable({
  includes: ['customSub']
})
export class HomeComponent implements OnDestroy {
  title = 'Neekware';
  customSub$ = null;
  constructor() {
    console.log(`HomeComponent: loaded ...`);
    this.title = '@nwx/unsub';
    this.customSub$ = interval(1000)
      .pipe(tap(num => console.log(`customSub - ${num}`)))
      .subscribe();

    interval(1000)
      .pipe(takeUntil(this.destroy$), tap(num => console.log(`takeUntil - ${num}`)))
      .subscribe();
  }

  ngOnDestroy() {
    console.log(`HomeComponent: destroyed ...`);
  }
}
