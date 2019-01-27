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

const mockSub2 = {
  unsubscribe: () => {
    console.log('Sub2 cancelled');
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
      expect(service.ngOnDestroy).toBeDefined();
    })
  );

  it(
    'autoUnsubscribe() should accept subscriptions objects',
    inject([UnsubService], (service: UnsubService) => {
      const sub1$ = mockSub1 as Subscription;
      service.autoUnsubscribe(sub1$);
      expect(service.subscriptions.length).toBe(1);
    })
  );

  it(
    'autoUnsubscribe() should accept a list of subscriptions',
    inject([UnsubService], (service: UnsubService) => {
      const sub1$ = mockSub1 as Subscription;
      const sub2$ = mockSub2 as Subscription;
      service.autoUnsubscribe([sub1$, sub2$]);
      expect(service.subscriptions.length).toBe(2);
    })
  );

  it(
    'ngOnDestroy() should complete destroy$',
    inject([UnsubService], (service: UnsubService) => {
      const completeSpy = spyOn(service.destroy$, 'complete');
      service.ngOnDestroy();
      expect(completeSpy).toHaveBeenCalled();
    })
  );

  it(
    'ngOnDestroy() should have cancelled subscriptions',
    inject([UnsubService], (service: UnsubService) => {
      const sub1$ = mockSub1 as Subscription;
      service.autoUnsubscribe(sub1$);
      const sub2$ = mockSub1 as Subscription;
      service.autoUnsubscribe(sub2$);
      const logSpy = spyOn(console, 'log');
      service.ngOnDestroy();
      expect(logSpy).toHaveBeenCalled();
    })
  );

  it(
    'ngOnDestroy() should handle invalid subscriptions',
    inject([UnsubService], (service: UnsubService) => {
      const sub1$ = {} as Subscription;
      service.autoUnsubscribe([sub1$]);
      const logSpy = spyOn(console, 'log');
      service.ngOnDestroy();
      expect(logSpy).not.toHaveBeenCalled();
    })
  );
});
