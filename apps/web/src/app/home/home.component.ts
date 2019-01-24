import { Component, OnDestroy } from '@angular/core';

import { interval, Subject, Subscription } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { UnsubService, Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'app-home',
  providers: [UnsubService],
  templateUrl: './home.component.html'
})
@Unsubscribable({
  takeUntilInputName: 'destroy$'
})
export class HomeComponent implements OnDestroy {
  title = 'Neekware';
  customSub$: Subscription;
  customSub2$: Subscription;
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private unsub: UnsubService) {
    console.log(`HomeComponent: loaded ...`);
    this.title = '@nwx/unsub';

    this.customSub$ = interval(2000)
      .pipe(tap(num => console.log(`HomeComponent - customSub$ - ${num}`)))
      .subscribe();

    this.customSub2$ = interval(2000)
      .pipe(tap(num => console.log(`HomeComponent - customSub2$ - ${num}`)))
      .subscribe();

    interval(2000)
      .pipe(takeUntil(this.destroy$), tap(num => console.log(`HomeComponent - takeUntil - ${num}`)))
      .subscribe();

    interval(2000)
      .pipe(takeUntil(this.destroy$), tap(num => console.log(`HomeComponent - takeUntil2 - ${num}`)))
      .subscribe();
  }

  ngOnDestroy() {
    console.log('HomeComponent ngOnDestroy ...');
  }
}
