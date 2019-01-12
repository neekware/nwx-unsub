import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { UnsubModule } from 'pkgs/unsub';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UnsubModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
