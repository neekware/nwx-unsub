/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { TestBed, inject } from '@angular/core/testing';

import { UnsubService } from '../src/unsub.service';

describe('UnsubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [UnsubService]
    });
  });

  it(
    'should be created',
    inject([UnsubService], (service: UnsubService) => {
      expect(service).toBeTruthy();
    })
  );
});
