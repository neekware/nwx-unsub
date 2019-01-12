/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { Subject } from 'rxjs';
import { isFunction } from 'util';
import { UnsubscribableOptions } from './unsub.types';
import { DefaultUnsubscribableOptions } from './unsub.defaults';

export const Unsubscribable = <TFunction extends Function>(
  options: UnsubscribableOptions = DefaultUnsubscribableOptions
) => {
  return (target: TFunction) => {
    const ngOnDestroy = target.prototype.ngOnDestroy || undefined;
    if (!ngOnDestroy || !isFunction(ngOnDestroy)) {
      throw Error(
        `${target.name} must implement OnDestroy if decorated with @Unsubscribable`
      );
    }

    target.prototype['destroy$'] = new Subject();
    const onDestroy = target.prototype.ngOnDestroy;

    target.prototype.ngOnDestroy = () => {
      target.prototype['destroy$'].next();
      target.prototype['destroy$'].complete();
      if (options.includes.length > 0) {
        options.includes.forEach(prop => {
          const unsubscribe =
            (target.prototype[prop] || undefined).unsubscribe || undefined;
          if (!unsubscribe || !isFunction(unsubscribe)) {
            console.warn(`${target.name} has no unsubscribable property called ${prop}`);
          } else {
            unsubscribe();
          }
        });
      } else if (options.excludes.length > 0) {
        for (let prop in target.prototype) {
          if (target.prototype.hasOwnProperty(prop) && !options.excludes.includes(prop)) {
            const unsubscribe = target.prototype[prop].unsubscribe || undefined;
            if (unsubscribe || isFunction(unsubscribe)) {
              unsubscribe();
            }
          }
        }
      }
      onDestroy.apply(this);
    };
  };
};
