import { Component } from '@angular/core';

import { UnsubService } from 'pkgs/unsub';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Neekware';
  options = {};
  constructor() {
    this.title = '@nwx/unsub';
  }
}
