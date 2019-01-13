/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { UnsubModule } from '../src/unsub.module';

describe('UnsubModule', () => {
  let unsubModule: UnsubModule;

  beforeEach(() => {
    unsubModule = new UnsubModule();
  });

  it('should create an instance', () => {
    expect(unsubModule).toBeTruthy();
  });
});
