import { Injectable, OnDestroy } from '@angular/core';
import { Unsubscribable } from '@nwx/unsub';

@Injectable()
@Unsubscribable()
export class LazyService implements OnDestroy {
  constructor() {
    console.log('LazyService loaded ...');
  }

  ngOnDestroy() {
    console.log('LazyService destroyed ...');
  }
}
