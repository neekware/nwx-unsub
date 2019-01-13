import { Component, OnDestroy } from '@angular/core';

import { UnsubService, Unsubscribable } from 'pkgs/unsub';
import { interval, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  providers: [UnsubService],
  templateUrl: './home.component.html'
})
@Unsubscribable({
  takeUntilSubscription: 'destroy$'
})
export class HomeComponent implements OnDestroy {
  title = 'Neekware';
  customSub$ = null;
  customSub2$ = null;
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private unsub: UnsubService) {
    console.log(`HomeComponent: loaded ...`);
    this.title = '@nwx/unsub';

    this.customSub$ = interval(3000)
      .pipe(tap(num => console.log(`customSub$ - ${num}`)))
      .subscribe();

    this.customSub2$ = interval(3000)
      .pipe(tap(num => console.log(`customSub2$ - ${num}`)))
      .subscribe();

    interval(3000)
      .pipe(takeUntil(this.destroy$), tap(num => console.log(`takeUntil - ${num}`)))
      .subscribe();

    interval(3000)
      .pipe(takeUntil(this.destroy$), tap(num => console.log(`takeUntil2 - ${num}`)))
      .subscribe();

    // this.unsub.watch([this.customSub$]);
  }

  ngOnDestroy() {
    console.log('HomeComponent ngOnDestroy called.');
  }
}
