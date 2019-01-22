import { Component, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubService } from 'pkgs/unsub';

@Component({
  selector: 'app-lazy',
  providers: [UnsubService],
  templateUrl: './lazy.component.html'
})
export class LazyComponent implements OnDestroy {
  title = 'Neekware Lazy';
  customSub$: Subscription;
  customSub2$: Subscription;

  constructor(private unsub: UnsubService) {
    console.log(`LazyComponent: loaded ...`);
    this.title = '@nwx/unsub';

    this.customSub$ = interval(2000).subscribe(num => console.log(`LazyComponent - customSub$ - ${num}`));

    interval(2000)
      .pipe(takeUntil(this.unsub.destroy$))
      .subscribe(num => console.log(`LazyComponent - takeUntil - ${num}`));

    this.unsub.autoCancel([this.customSub$]);
  }

  ngOnDestroy() {
    console.log(`LazyComponent: destroyed ...`);
  }
}
