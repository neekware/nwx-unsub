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

    if (options.includes.length > 0) {
      options.includes.forEach(item => {
        const unsubscribe = (this[item] || undefined).unsubscribe || undefined;
        if (!unsubscribe || !isFunction(unsubscribe)) {
          console.warn(`${target.name} has no unsubscribable property called ${item}`);
        } else {
          unsubscribe();
        }
      });
    } else if (options.excludes.length > 0) {
      for (let prop in this) {
        if (this.hasOwnProperty(prop)) {
        }
      }
    }
  };
};

// export function Unsubscribable<TFunction extends Function>(target: TFunction) {

//   // save a reference to the original constructor
//   const originalConstructor = target;

//   function logClassName(func: TFunction) {
//       console.log("New: " + func.name);
//   }

//   // a utility function to generate instances of a class
//   function instanciate(constructor: any, ...args: any[]) {
//       return new constructor(...args);
//   }

//   // the new constructor behaviour
//   const newConstructor = function(...args: any[]) {
//       logClassName(originalConstructor);
//       return instanciate(originalConstructor, ...args);
//   };

//   // copy prototype so instanceof operator still works
//   newConstructor.prototype = originalConstructor.prototype;

//   // return new constructor (will override original)
//   return newConstructor as any;
// }
