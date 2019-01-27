# @nwx/unsub

**A simple subscription clean library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# How to install

    npm i @nwx/unsub |OR| yarn add @nwx/unsub

# How to use

**UnsubService** is a great way to let another `ephemeral` service to handle the canceling of subscriptions. It works with classes of type `Component`, `Directive` & `Pipe`.

**@Unsubscribable()** is a great way to enhance a class to better handle the canceling of subscriptions. It works with classes of type `Component`, `Directive`, `Pipe` & `Injectable`.

**Note:** Do not use `@Unsubscribable()` with `Injectable` services that set the `providedIn` option.

**Auto Canceling Subscription via UnsubService**

```typescript
// in your component
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubService } from '@nwx/unsub';

@Component({
  selector: 'home',
  // an ephemeral service instance per component instance
  providers: [UnsubService],
  templateUrl: './home.component.html'
})
// OnDestroy is not required, unless other non-subscription clean up is required
export class HomeComponent {
  customSub$: Subscription;

  constructor(private unsub: UnsubService) {
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));
    // register for automatic cleanup
    this.unsub.autoUnsubscribe(this.customSub$);

    // automatically gets cleaned up by UnsubService's OnDestroy
    interval(3000)
      .pipe(takeUntil(this.unsub.destroy$))
      .subscribe(num => console.log(`takeUntil - ${num}`));
  }
}
```

**Auto Canceling Subscription Decorator**

```typescript
// in your component
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
@Unsubscribable()
// OnDestroy is not required, unless other non-subscription clean up is required
export class HomeComponent {
  customSub$: Subscription;

  constructor() {
    // must keep a reference to our subscription for automatic cleanup
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));
  }
}
```

# Advanced Usage

**Auto Canceling Subscription Decorator (w/ takeUntil)**

```typescript
// in your component
import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
@Unsubscribable({
  // property used by takeUntil() - use destroy$ or any custom name
  takeUntilInputName: 'destory$',
})
// OnDestroy is not required, unless other non-subscription clean up is required
export class HomeComponent {
  // This is used in takeUntil() - @Unsubscribable will manage it internally
  destroy$ = new Subject<boolean>();

  constructor() {
    // decorated class will trigger an auto clean up
    interval(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(num => console.log(`takeUntil - ${num}`));
  }
}
```

**Auto Canceling Subscription Decorator (w/ Includes)**

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
  // specific subscription names to be auto canceled, everything else is ignored
  includes: ['customSub$']
})
export class HomeComponent {
  // this is not our subscription, so we don't include it for auto clean up
  @Input() notOurSub$: Subscription;

  // this is our subscription and we include it for auto clean up
  customSub$: Subscription;

  constructor() {
    // decorated class auto clean this up
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));
  }
}
```

**Auto Cancelling Subscription Decorator (w/ Excludes)**

```typescript
// in your component
import { Component, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Unsubscribable } from '@nwx/unsub';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
@Unsubscribable({
  // subscription names not to be auto canceled, every other subscription will be clean up
  excludes: ['notOurSub$']
})
export class HomeComponent {
  // this is not our subscription, so we exclude it from auto clean up
  @Input() notOurSub$: Subscription;

  // this is our subscription and it will be automatically cleaned up
  customSub$: Subscription;

  constructor() {
    this.customSub$ = interval(1000).subscribe(num => console.log(`customSub$ - ${num}`));
  }
}
```

# Running the tests

To run the tests against the current environment:

    npm run ci:all

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
