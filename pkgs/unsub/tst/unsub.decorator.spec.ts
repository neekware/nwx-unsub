/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Unsubscribable } from '../src/unsub.decorators';

const mockSub1 = {
  unsubscribe: () => {
    console.log('Sub1 cancelled');
  }
};

const mockSub2 = {
  unsubscribe: () => {
    console.warn('Sub2 cancelled');
  }
};

describe('@Unsubscribable', () => {
  beforeEach(() => {
    spyOn(console, 'error');
    spyOn(console, 'log');
    spyOn(console, 'warn');
  });

  it('should implement OnDestroy', () => {
    @Unsubscribable()
    class UnsubComponent implements OnDestroy {
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    expect(typeof comp['ngOnDestroy']).toBe('function');
  });

  it('should error on missing destroy$', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent implements OnDestroy {
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.error).toHaveBeenCalled();
  });

  it('should not error if destroy$ exists', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should error on invalid takeUntilInputName', () => {
    @Unsubscribable({
      takeUntilInputName: 'foobar$'
    })
    class UnsubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.error).toHaveBeenCalled();
  });

  it('should call ngOnDestroy of super', () => {
    @Unsubscribable()
    class UnsubComponent implements OnDestroy {
      ngOnDestroy() {
        console.log('ngOnDestroy of super called');
      }
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.log).toHaveBeenCalled();
  });

  it('should process destroy$ on ngOnDestroy', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    const processTakeUntilsSpy = spyOn(<any>comp, '_processTakeUntils');
    comp['ngOnDestroy']();
    expect(processTakeUntilsSpy).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    const completeSpy = spyOn(<any>comp.destroy$, 'complete');
    comp['ngOnDestroy']();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should warn on missing included subscriptions', () => {
    @Unsubscribable({
      includes: ['foobar$']
    })
    class UnsubComponent implements OnDestroy {
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.warn).toHaveBeenCalled();
  });

  it('should process includes option', () => {
    @Unsubscribable({
      includes: ['sub1$']
    })
    class UnsubComponent implements OnDestroy {
      sub1$ = mockSub1;
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    const processIncludesSpy = spyOn(<any>comp, '_processIncludes');
    comp['ngOnDestroy']();
    expect(processIncludesSpy).toHaveBeenCalled();
  });

  it('should cancel included subscriptions', () => {
    @Unsubscribable({
      includes: ['sub1$']
    })
    class UnsubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.log).toHaveBeenCalled();
  });

  it('should process excluded option', () => {
    @Unsubscribable({
      excludes: ['sub2$']
    })
    class UnsubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    const processExcludesSpy = spyOn(<any>comp, '_processExcludes');
    comp['ngOnDestroy']();
    expect(processExcludesSpy).toHaveBeenCalled();
  });

  it('should cancel non-excluded subscriptions', () => {
    @Unsubscribable({
      excludes: ['sub2$']
    })
    class UnsubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.log).toHaveBeenCalled();
  });

  it('should not cancel excluded subscriptions', () => {
    @Unsubscribable({
      excludes: ['sub2$']
    })
    class UnsubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new UnsubComponent();
    comp['ngOnDestroy']();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
