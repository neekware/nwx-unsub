# @nwx/unsub

**A simple subscription clean library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# How to install

    npm i @nwx/unsub |OR| yarn add @nwx/unsub

# How to use

**Auto Cancelling Subscription Service**

```typescript
// in your component
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubService } from '@nwx/unsub';

@Component({
  selector: 'home',
  providers: [UnsubService],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  customSub$: Subscription;
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private unsub: UnsubService) {
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));
    this.unsub.autoCancel(this.customSub$);

    interval(3000)
      .pipe(takeUntil(this.unsub.untilDestroy()))
      .subscribe(num => console.log(`takeUntil - ${num}`));
  }
}
```

**Auto Cancelling Subscription Decorator**

```typescript
// in your component
import { Component } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'home',
  providers: [UnsubService],
  templateUrl: './home.component.html'
})
@Unsubscribable({
  takeUntilInputName: 'destroy$', // property used by takeUntil()
  includes: ['customSub$'], // subscription names to be auto canceled
  excludes: [] // subscription names not to be auto canceled
})
export class HomeComponent {
  customSub$: Subscription;
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private unsub: UnsubService) {
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));

    interval(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(num => console.log(`takeUntil - ${num}`));
  }
}
```

# Running the tests

To run the tests against the current environment:

    npm run ci

# License

Released under a ([MIT](LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://secure.travis-ci.org/neekware/nwx-unsub.png?branch=master
[status-link]: http://travis-ci.org/neekware/nwx-unsub?branch=master
[version-image]: https://img.shields.io/npm/v/@nwx/unsub.svg
[version-link]: https://www.npmjs.com/package/@nwx/unsub
[coverage-image]: https://coveralls.io/repos/neekware/nwx-unsub/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/nwx-unsub
[download-image]: https://img.shields.io/npm/dm/@nwx/unsub.svg
[download-link]: https://www.npmjs.com/package/@nwx/unsub

# Sponsors

[![Surge](https://www.surgeforward.com/wp-content/themes/understrap-master/images/logo.png)](https://github.com/surgeforward)
