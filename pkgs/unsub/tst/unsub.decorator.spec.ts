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
  beforeEach(() => {});

  it('should implement OnDestroy', () => {
    @Unsubscribable()
    class UnsubComponent {}

    const comp = new UnsubComponent();
    expect(typeof comp['ngOnDestroy']).toBe('function');
  });

  it('should call ngOnDestroy', () => {
    @Unsubscribable()
    class UnsubComponent {}

    const comp = new UnsubComponent();
    const destroySpy = spyOn(<any>comp, 'ngOnDestroy');
    comp['ngOnDestroy']();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should call ngOnDestroy of super if exists', () => {
    @Unsubscribable()
    class UnsubComponent implements OnDestroy {
      ngOnDestroy() {
        console.log('ngOnDestroy of super called');
      }
    }

    const comp = new UnsubComponent();
    const logSpy = spyOn(console, 'log');
    comp['ngOnDestroy']();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should throw on missing destroy$', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent {}

    const comp = new UnsubComponent();
    expect(() => comp['validateOptions']()).toThrow();
  });

  it('should not throw for existing destroy$', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent {
      destroy$: Subject<boolean> = new Subject<boolean>();
    }

    const comp = new UnsubComponent();
    expect(() => comp['validateOptions']()).not.toThrow();
  });

  it('should throw for invalid takeUntilInputName', () => {
    @Unsubscribable({
      takeUntilInputName: 'cleanup$'
    })
    class UnsubComponent {
      destroy$: Subject<boolean> = new Subject<boolean>();
    }

    const comp = new UnsubComponent();
    expect(() => comp['validateOptions']()).toThrow();
  });

  it('should process destroy$ on ngOnDestroy', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent {
      destroy$: Subject<boolean> = new Subject<boolean>();
    }

    const comp = new UnsubComponent();
    const processTakeUntilsSpy = spyOn(<any>comp, 'processTakeUntils');
    comp['ngOnDestroy']();
    expect(processTakeUntilsSpy).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    @Unsubscribable({
      takeUntilInputName: 'destroy$'
    })
    class UnsubComponent {
      destroy$: Subject<boolean> = new Subject<boolean>();
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
    class UnsubComponent {}

    const comp = new UnsubComponent();
    const logSpy = spyOn(console, 'warn');
    comp['ngOnDestroy']();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should process includes option', () => {
    @Unsubscribable({
      includes: ['sub1$']
    })
    class UnsubComponent {
      sub1$ = mockSub1;
    }

    const comp = new UnsubComponent();
    const processIncludesSpy = spyOn(<any>comp, 'processIncludes');
    comp['ngOnDestroy']();
    expect(processIncludesSpy).toHaveBeenCalled();
  });

  it('should cancel included subscriptions', () => {
    @Unsubscribable({
      includes: ['sub1$']
    })
    class UnsubComponent {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
    }

    const comp = new UnsubComponent();
    const logSpy = spyOn(console, 'log');
    comp['ngOnDestroy']();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should process excluded option', () => {
    @Unsubscribable({
      excludes: ['sub2$']
    })
    class UnsubComponent {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
    }

    const comp = new UnsubComponent();
    const processExcludesSpy = spyOn(<any>comp, 'processExcludes');
    comp['ngOnDestroy']();
    expect(processExcludesSpy).toHaveBeenCalled();
  });

  it('should cancel non-excluded subscriptions', () => {
    @Unsubscribable({
      excludes: ['sub2$']
    })
    class UnsubComponent {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
    }

    const comp = new UnsubComponent();
    const logSpy = spyOn(console, 'log');
    comp['ngOnDestroy']();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should not cancel excluded subscriptions', () => {
    @Unsubscribable({
      excludes: ['sub2$']
    })
    class UnsubComponent {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
    }

    const comp = new UnsubComponent();
    const logSpy = spyOn(console, 'warn');
    comp['ngOnDestroy']();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
