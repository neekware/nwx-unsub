# @nwx/unsub

**A simple subscription clean library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# How to install

    npm i @nwx/unsub |OR| yarn add @nwx/unsub

# How to use

**Auto Cancelling Subscription via unsubService**

```typescript
// in your component
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubService } from '@nwx/unsub';

@Component({
  selector: 'home',
  providers: [UnsubService], // one copy of the service per component
  templateUrl: './home.component.html'
})
export class HomeComponent { // no need to implement OnDestroy, unless needed for other clean ups
  customSub$: Subscription;

  constructor(private unsub: UnsubService) {
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));
    this.unsub.autoCancel(this.customSub$); // we want this to be automatically cleaned up

    interval(3000)
      .pipe(takeUntil(this.unsub.destroy$) // this will be automatically completed and cleaned up
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
  templateUrl: './home.component.html'
})
@Unsubscribable()
export class HomeComponent { // no need to implement OnDestroy, unless needed for other clean ups
  customSub$: Subscription;
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private unsub: UnsubService) {
    // decorated class will auto clean this up
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));

    interval(3000)
      .pipe(takeUntil(this.destroy$)) // decorated class will auto complete and clean this up
      .subscribe(num => console.log(`takeUntil - ${num}`));
  }
}
```

# Advanced Usage

**Auto Cancelling Subscription Decorator (w/ custom destroy subscription) **

```typescript
// in your component
import { Component, Input } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
@Unsubscribable({
  takeUntilInputName: 'customNameDestroy$', // property used by takeUntil() - default is destroy$
})
export class HomeComponent {
  constructor(private unsub: UnsubService) {
    interval(3000)
      .pipe(takeUntil(this.customNameDestroy$)) // decorated class will auto complete and clean this up
      .subscribe(num => console.log(`takeUntil - ${num}`));
  }
}
```

**Auto Cancelling Subscription Decorator (w/ Includes)**

```typescript
// in your component
import { Component, Input } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
@Unsubscribable({
  includes: ['customSub$'], // specific subscription names to be auto canceled
})
export class HomeComponent {
  @Input() notOurSub$: Subscription; // this will not be canceled by decorated class
  customSub$: Subscription;

  constructor(private unsub: UnsubService) {
    // decorated class auto clean this up
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));
  }
}
```

**Auto Cancelling Subscription Decorator (w/ Excludes)**

```typescript
// in your component
import { Component, Input } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
@Unsubscribable({
  excludes: ['notOurSub$'] // subscription names not to be auto canceled
})
export class HomeComponent {
  @Input() notOurSub$: Subscription; // this will not be canceled by decorated class, everything else will be auto canceled
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
