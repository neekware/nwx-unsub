/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

/**
 * Checks if an object is a function
 */
export const isFunction = (object: any): boolean => {
  return typeof object === 'function' || false;
};
