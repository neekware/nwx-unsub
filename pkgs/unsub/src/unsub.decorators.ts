/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { OnDestroy } from '@angular/core';

import { isFunction } from './unsub.utils';
import { DefaultUnsubscribableOptions } from './unsub.defaults';

/**
 * Unsubscribable decorator - streamline canceling of subscriptions
 */
export function Unsubscribable(options = DefaultUnsubscribableOptions) {
  return function _Unsubscribable<T extends { new (...args: any[]): any }>(target: T) {
    options = { ...DefaultUnsubscribableOptions, ...options };
    target.name.length > 1 ? (options.className = target.name) : options.className;
    if (!isFunction(target.prototype['ngOnDestroy'])) {
      throw new Error(
        `${
          options.className
        } must implement OnDestroy when decorated with @Unsubscribable`
      );
    }
    return class extends target implements OnDestroy {
      _options = options;
      /**
       * Validates options
       * @returns void
       */
      _validateOptions(): void {
        if (
          this._options.takeUntilInputName &&
          !this.hasOwnProperty(this._options.takeUntilInputName)
        ) {
          console.error(
            `${this._options.className} must have "${
              this._options.takeUntilInputName
            }: Subject<boolean> = new Subject<boolean>();" when decorated with @Unsubscribable`
          );
        }
      }

      /**
       * Cancels all subscriptions on destroy
       * @returns void
       */
      ngOnDestroy(): void {
        this._validateOptions();
        this._processTakeUntils();
        if (this._options.includes.length > 0) {
          this._processIncludes();
        } else {
          this._processExcludes();
        }
        super.ngOnDestroy();
      }

      /**
       * Cancels all subscriptions that use takeUntil
       * @returns void
       */
      _processTakeUntils(): void {
        if (this.hasOwnProperty(this._options.takeUntilInputName)) {
          this[this._options.takeUntilInputName].next(true);
          this[this._options.takeUntilInputName].complete();
        }
      }

      /**
       * Cancels only the subscriptions that are explicitly includes
       * @returns void
       */
      _processIncludes(): void {
        this._options.includes.forEach(prop => {
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
      _processExcludes(): void {
        for (const prop in this) {
          if (
            this.hasOwnProperty(prop) &&
            prop !== this._options.takeUntilInputName &&
            this._options.excludes.indexOf(prop) <= -1
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
