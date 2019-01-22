/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { OnDestroy } from '@angular/core';

import { isFunction } from 'util';
import { UnsubscribableOptions } from './unsub.types';
import { DefaultUnsubscribableOptions } from './unsub.defaults';

/**
 * Unsubscribable decorator - streamline canceling of subscriptions
 */
export const Unsubscribable = (options = DefaultUnsubscribableOptions) => {
  options = { ...DefaultUnsubscribableOptions, ...options };
  return <T extends { new (...args: any[]): any }>(target: T) => {
    return class extends target implements OnDestroy {
      /**
       * Validate the provided options
       * Ensure the subject property name matches the `takeUntilInputName` provided.
       */
      validateOptions() {
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
       * Cancel all subscriptions on destroy
       */
      ngOnDestroy() {
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
       * Cancel all subscriptions that use takeUntil
       */
      processTakeUntils() {
        if (this.hasOwnProperty(options.takeUntilInputName)) {
          this[options.takeUntilInputName].next(true);
          this[options.takeUntilInputName].complete();
        }
      }

      /**
       * Cancel all subscriptions that are explicitly specified
       */
      processIncludes() {
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
       * Cancel all subscriptions except those that are explicitly specified
       */
      processExcludes() {
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
