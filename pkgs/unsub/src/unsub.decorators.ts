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
      _options = { ...DefaultUnsubscribableOptions, ...options };

      constructor(...args: any[]) {
        super(arguments);
        this._validateOptions();
        this._validateOnDestroy();
      }

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
            `Class must implement "${
              this._options.takeUntilInputName
            }: Subject<boolean> = new Subject<boolean>();" when decorated with @Unsubscribable`
          );
        }
      }

      /**
       * Validates whether OnDestroy is implemented by super
       * @returns void
       */
      _validateOnDestroy(): void {
        if (!isFunction(super.ngOnDestroy)) {
          console.error(
            `Class must implement OnDestroy when decorated with @Unsubscribable`
          );
        }
      }

      /**
       * Cancels all subscriptions on destroy
       * @returns void
       */
      ngOnDestroy(): void {
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
