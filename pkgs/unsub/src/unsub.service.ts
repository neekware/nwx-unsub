import { Injectable, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { UnsubManager } from './unsub.manager';

/** An injectable service class that handles auto cancellation of subscriptions */
@Injectable()
export class UnsubService extends UnsubManager implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  /** Handles auto cancellation of all subscriptions on destroy */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.unsubscribe();
  }
}
