import { Component, OnDestroy } from '@angular/core';

import { Unsubscribable } from 'pkgs/unsub';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Unsubscribable()
export class AppComponent implements OnDestroy {
  title = 'Neekware';
  options = {};
  constructor() {
    this.title = '@nwx/unsub';
  }

  ngOnDestroy() {}
}
