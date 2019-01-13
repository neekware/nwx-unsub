import { Component, OnDestroy } from '@angular/core';
import { Unsubscribable } from 'pkgs/unsub';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html'
})
@Unsubscribable()
export class LazyComponent implements OnDestroy {
  title = 'Neekware Lazy';
  constructor() {
    this.title = '@nwx/unsub (lazy)';
    console.log('LazyComponent loaded ...');
  }

  ngOnDestroy() {
    console.log(`LazyComponent: destroyed ...`);
  }
}
