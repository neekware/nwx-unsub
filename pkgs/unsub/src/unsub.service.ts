/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { Injectable, OnDestroy } from '@angular/core';

import { isFunction } from 'util';
import { Subject, Subscription } from 'rxjs';

/**
 * An injectable service class that handles cancellation of subscriptions
 */
@Injectable()
export class UnsubService implements OnDestroy {
  destroy$: Subject<Boolean> = new Subject<Boolean>();
  subscriptions: Subscription[] = [];

  /**
   * Handles auto cancellation of given subscriptions
   */
  autoCancel(subscriptions: Subscription | Subscription[]) {
    if (Array.isArray(subscriptions)) {
      this.subscriptions = [...this.subscriptions, ...subscriptions];
    } else {
      this.subscriptions.push(subscriptions);
    }
  }

  /**
   * Handles automatically cancelling all subscriptions on destroy
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.subscriptions.forEach(subscription => {
      if (isFunction(subscription.unsubscribe)) {
        subscription.unsubscribe();
      }
    });
  }
}
