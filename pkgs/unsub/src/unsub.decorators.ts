/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { isFunction } from 'util';
import { UnsubscribableOptions } from './unsub.types';
import { DefaultUnsubscribableOptions } from './unsub.defaults';
import { OnDestroy } from '@angular/core';

export const Unsubscribable = (options?: UnsubscribableOptions) => {
  return <T extends { new (...args: any[]): any }>(target: T) => {
    options = { ...DefaultUnsubscribableOptions, ...options };
    return class extends target implements OnDestroy {
      constructor(...args) {
        super(args);
        if (!this.hasOwnProperty(options.takeUntilSubscription)) {
          throw Error(
            `${target.name} must implement "${
              options.takeUntilSubscription
            } = Subject<Boolean> = new Subject<Boolean>();" if decorated with @Unsubscribable`
          );
        }
      }

      ngOnDestroy() {
        this.processTakeUntils();
        if (options.includes.length > 0) {
          this.processIncludes();
        } else {
          this.processExcludes();
        }
        try {
          super.ngOnDestroy();
        } catch (e) {
          // ngOnDestroy is optional for super as wel do the clean up.
        }
      }

      private processTakeUntils() {
        if (this.hasOwnProperty(options.takeUntilSubscription)) {
          this.destroy$.next(true);
          this.destroy$.complete();
        }
      }

      private processIncludes() {
        options.includes.forEach(prop => {
          if (this.hasOwnProperty(prop)) {
            const subscription = this[prop];
            if (isFunction(subscription.unsubscribe)) {
              subscription.unsubscribe();
            }
          } else {
            console.warn(`${target.name} has no unsubscribable property called ${prop}`);
          }
        });
      }

      private processExcludes() {
        options.excludes.push(options.takeUntilSubscription);
        for (const prop in this) {
          if (this.hasOwnProperty(prop) && !options.excludes.includes(prop)) {
            const subscription = this[prop];
            if (isFunction(subscription.unsubscribe)) {
              subscription.unsubscribe();
            }
          }
        }
      }
    };
  };
};
