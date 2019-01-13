import { Component, OnDestroy } from '@angular/core';
import { UnsubService } from 'pkgs/unsub';

@Component({
  selector: 'app-lazy',
  providers: [UnsubService],
  templateUrl: './lazy.component.html'
})
export class LazyComponent implements OnDestroy {
  title = 'Neekware Lazy';
  constructor(private unsub: UnsubService) {
    this.title = '@nwx/unsub (lazy)';
    console.log('LazyComponent loaded ...');
  }

  ngOnDestroy() {
    console.log(`LazyComponent: destroyed ...`);
  }
}
