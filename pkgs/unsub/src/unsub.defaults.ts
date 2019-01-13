/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { UnsubscribableOptions } from './unsub.types';

export const DefaultUnsubscribableOptions: UnsubscribableOptions = {
  takeUntilSubscription: 'destroy$',
  includes: [],
  excludes: []
};
