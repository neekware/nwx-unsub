/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { Injectable, OnDestroy } from '@angular/core';

import { isFunction } from './unsub.utils';
import { Subject, Subscription } from 'rxjs';

/**
 * An injectable service class that handles auto cancellation of subscriptions
 */
@Injectable()
export class UnsubService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  subscriptions: Subscription[] = [];

  /**
   * Registers all subscriptions that need auto cancellation on destroy
   */
  autoUnsubscribe(subscription: Subscription | Subscription[]) {
    if (Array.isArray(subscription)) {
      this.subscriptions = [...this.subscriptions, ...subscription];
    } else {
      this.subscriptions.push(subscription);
    }
  }

  /**
   * Handles auto cancellation of all subscriptions on destroy
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.subscriptions.forEach(subscription => {
      if (
        subscription &&
        subscription.unsubscribe &&
        isFunction(subscription.unsubscribe)
      ) {
        subscription.unsubscribe();
      }
    });
  }
}
