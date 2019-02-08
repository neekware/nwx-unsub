import { Component, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubService } from '@nwx/unsub';
import { LazyService } from './lazy.service';

@Component({
  selector: 'app-lazy',
  providers: [UnsubService, LazyService],
  templateUrl: './lazy.component.html'
})
export class LazyComponent implements OnDestroy {
  title = 'Neekware Lazy';
  customSub$: Subscription;
  customSub2$: Subscription;
  step = 5000;

  constructor(private unsub: UnsubService, private lzy: LazyService) {
    console.log(`LazyComponent: loaded ...`);
    this.title = '@nwx/unsub';

    this.customSub$ = interval(this.step).subscribe(num =>
      console.log(`LazyComponent - customSub$ - ${num}`)
    );

    interval(this.step)
      .pipe(takeUntil(this.unsub.destroy$))
      .subscribe(num => console.log(`LazyComponent - takeUntil - ${num}`));

    this.customSub2$ = interval(this.step).subscribe(num =>
      console.log(`LazyComponent - customSub2$ - ${num}`)
    );

    this.unsub.autoUnsubscribe([this.customSub$, this.customSub2$]);
  }

  ngOnDestroy() {
    console.log(`LazyComponent: destroyed ...`);
  }
}
