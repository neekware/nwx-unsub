import { Subscription } from 'rxjs';

import { UnsubManager } from '../src/unsub.manager';

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
  let unsubMgr: UnsubManager;

  beforeEach(() => {
    unsubMgr = new UnsubManager();
  });

  afterEach(() => {
    unsubMgr = null;
  });

  it('should be created', () => {
    expect(unsubMgr).toBeTruthy();
  });

  it('autoUnsubscribe() should accept subscriptions objects', () => {
    const sub1$ = mockSub1 as Subscription;
    unsubMgr.track = sub1$;
    expect(unsubMgr['trackedSubs'].length).toBe(1);
  });

  it('autoUnsubscribe() should accept a list of subscriptions', () => {
    const sub1$ = mockSub1 as Subscription;
    const sub2$ = mockSub2 as Subscription;
    unsubMgr.track = [sub1$, sub2$];
    expect(unsubMgr['trackedSubs'].length).toBe(2);
  });

  it('ngOnDestroy() should have cancelled subscriptions', () => {
    const sub1$ = mockSub1 as Subscription;
    unsubMgr.track = sub1$;
    const sub2$ = mockSub1 as Subscription;
    unsubMgr.track = sub2$;
    const logSpy = spyOn(console, 'log');
    unsubMgr.unsubscribe();
    expect(logSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy() should handle invalid subscriptions', () => {
    const sub1$ = {} as Subscription;
    unsubMgr.track = [sub1$];
    const logSpy = spyOn(console, 'log');
    unsubMgr.unsubscribe();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
