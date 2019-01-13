/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { Injectable, OnDestroy } from '@angular/core';

import { Subject, MonoTypeOperatorFunction, Subscription } from 'rxjs';
import { UnsubModule } from './unsub.module';
import { takeUntil, subscribeOn } from 'rxjs/operators';
import { isFunction } from 'util';

/**
 * An injectable class that handles the unsubscribing service
 */
@Injectable()
export class UnsubService implements OnDestroy {
  destroy$: Subject<Boolean> = new Subject<Boolean>();
  subscriptions: Subscription[] = [];

  constructor() {}

  /**
   * registers subscription functions for auto cancelation
   */
  watch(subscriptions: Subscription | Subscription[]) {
    if (Array.isArray(subscriptions)) {
      this.subscriptions = [...this.subscriptions, ...subscriptions];
    } else {
      this.subscriptions.push(subscriptions);
    }
  }

  /**
   * @returns an operator function consumable to .pipe()
   */
  untilDestroy() {
    return takeUntil(this.destroy$);
  }

  /**
   * cancels all subscriptions on destroy
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
