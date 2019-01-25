/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { OnDestroy } from '@angular/core';

import { isFunction } from './unsub.utils';
import { UnsubscribableOptions } from './unsub.types';
import { DefaultUnsubscribableOptions } from './unsub.defaults';

/**
 * Unsubscribable decorator - streamline canceling of subscriptions
 */
export const Unsubscribable = (options = DefaultUnsubscribableOptions) => {
  options = { ...DefaultUnsubscribableOptions, ...options };
  return <T extends { new (...args: any[]): any }>(target: T) => {
    return class UnsubClass extends target implements OnDestroy {
      /**
       * Validates the options
       * @returns void
       */
      validateOptions(): void {
        if (
          options.takeUntilInputName &&
          !this.hasOwnProperty(options.takeUntilInputName)
        ) {
          throw Error(
            `${target.name} must implement "${
              options.takeUntilInputName
            } = Subject<Boolean> = new Subject<Boolean>();" if decorated with @Unsubscribable`
          );
        }
      }

      /**
       * Cancels all subscriptions on destroy
       * @returns void
       */
      ngOnDestroy(): void {
        this.validateOptions();
        this.processTakeUntils();
        if (options.includes.length > 0) {
          this.processIncludes();
        } else {
          this.processExcludes();
        }
        if (super.ngOnDestroy && isFunction(super.ngOnDestroy)) {
          super.ngOnDestroy();
        }
      }

      /**
       * Cancels all subscriptions that use takeUntil
       * @returns void
       */
      processTakeUntils(): void {
        if (this.hasOwnProperty(options.takeUntilInputName)) {
          this[options.takeUntilInputName].next(true);
          this[options.takeUntilInputName].complete();
        }
      }

      /**
       * Cancels only the subscriptions that are explicitly includes
       * @returns void
       */
      processIncludes(): void {
        options.includes.forEach(prop => {
          if (this.hasOwnProperty(prop)) {
            const subscription = this[prop];
            if (
              subscription &&
              subscription.unsubscribe &&
              isFunction(subscription.unsubscribe)
            ) {
              subscription.unsubscribe();
            }
          } else {
            console.warn(`${target.name} has no unsubscribable property called ${prop}`);
          }
        });
      }

      /**
       * Cancels all auto-detected subscriptions except those that are explicitly excluded
       * @returns void
       */
      processExcludes(): void {
        options.excludes.push(options.takeUntilInputName);
        for (const prop in this) {
          if (this.hasOwnProperty(prop) && options.excludes.indexOf(prop) <= -1) {
            const subscription = this[prop];
            if (
              subscription &&
              subscription.unsubscribe &&
              isFunction(subscription.unsubscribe)
            ) {
              subscription.unsubscribe();
            }
          }
        }
      }
    };
  };
};
