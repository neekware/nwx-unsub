/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { TestBed, inject } from '@angular/core/testing';

import { Subscription } from 'rxjs';

import { UnsubService } from '../src/unsub.service';

const mockSub1 = {
  unsubscribe: () => {
    console.log('Sub1 cancelled');
  }
};

describe('UnsubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsubService]
    });
  });

  it(
    'should be created',
    inject([UnsubService], (service: UnsubService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'should have required props and methods',
    inject([UnsubService], (service: UnsubService) => {
      expect(service.destroy$).toBeDefined();
      expect(service.subscriptions).toBeDefined();
      expect(service.autoUnsubscribe).toBeDefined();
      expect(service.autoUnsubscribe).toBeDefined();
      expect(service.ngOnDestroy).toBeDefined();
    })
  );

  it(
    'should have functional autoUnsubscribe',
    inject([UnsubService], (service: UnsubService) => {
      const sub$ = mockSub1;
      service.autoUnsubscribe(<Subscription>sub$);
      expect(service.subscriptions.length).toBe(1);
    })
  );

  it(
    'should complete destroy$ onDestroy',
    inject([UnsubService], (service: UnsubService) => {
      const completeSpy = spyOn(service.destroy$, 'complete');
      service.ngOnDestroy();
      expect(completeSpy).toHaveBeenCalled();
    })
  );

  it(
    'should have cancelled sub$ onDestroy',
    inject([UnsubService], (service: UnsubService) => {
      const sub$ = mockSub1;
      service.autoUnsubscribe(<Subscription>sub$);
      const logSpy = spyOn(console, 'log');
      service.ngOnDestroy();
      expect(logSpy).toHaveBeenCalled();
    })
  );

});
