/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { TestBed, inject } from '@angular/core/testing';

import { UnsubModule } from '../src/unsub.module';
import { UnsubService } from '../src/unsub.service';

describe('UnsubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnsubModule]
    });
  });

  it(
    'should be created',
    inject([UnsubService], (service: UnsubService) => {
      expect(service).toBeTruthy();
    })
  );
});
