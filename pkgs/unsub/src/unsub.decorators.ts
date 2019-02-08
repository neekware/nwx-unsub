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
export function Unsubscribable(options = DefaultUnsubscribableOptions) {
  return <T extends { new (...args: any[]): any }>(target: T) => {
    return class UnsubClass extends target implements OnDestroy {
      options = { ...DefaultUnsubscribableOptions, ...options };

      /**
       * Validates the options
       * @returns void
       */
      validateOptions(): void {
        if (
          this.options.takeUntilInputName &&
          !this.hasOwnProperty(this.options.takeUntilInputName)
        ) {
          throw Error(
            `${target.name} must implement "${
              this.options.takeUntilInputName
            } = new Subject<boolean>();" if decorated with @Unsubscribable`
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
        if (this.options.includes.length > 0) {
          this.processIncludes();
        } else {
          this.processExcludes();
        }
        super.ngOnDestroy();
      }

      /**
       * Cancels all subscriptions that use takeUntil
       * @returns void
       */
      processTakeUntils(): void {
        if (this.hasOwnProperty(this.options.takeUntilInputName)) {
          this[this.options.takeUntilInputName].next(true);
          this[this.options.takeUntilInputName].complete();
        }
      }

      /**
       * Cancels only the subscriptions that are explicitly includes
       * @returns void
       */
      processIncludes(): void {
        this.options.includes.forEach(prop => {
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
        for (const prop in this) {
          if (
            this.hasOwnProperty(prop) &&
            prop !== this.options.takeUntilInputName &&
            this.options.excludes.indexOf(prop) <= -1
          ) {
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
}
