/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

export interface UnsubscribableOptions {
  // name of subscription property consumed by takeUnit (e.g. destroy$)
  takeUntilSubscription?: string;
  // name of subscriptions automatically canceled on destroy
  includes?: string[];
  // name of subscriptions excluded from automatical canceling
  excludes?: string[];
}
