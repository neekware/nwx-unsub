import { Component, OnDestroy } from '@angular/core';

import { Unsubscribable, UnsubService } from 'pkgs/unsub';
import { interval, Subscription, Subject } from 'rxjs';
import { tap, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  providers: [UnsubService],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  title = 'Neekware';
  customSub$ = null;
  constructor(private unsub: UnsubService) {
    console.log(`HomeComponent: loaded ...`);
    this.title = '@nwx/unsub';
    this.customSub$ = interval(1000)
      .pipe(tap(num => console.log(`customSub - ${num}`)))
      .subscribe();

    interval(1000)
      .pipe(this.unsub.untilDestroy(), tap(num => console.log(`takeUntil - ${num}`)))
      .subscribe();

    this.unsub.watch([this.customSub$]);
  }
}
