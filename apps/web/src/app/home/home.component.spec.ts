import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { Observable, of as observableOf } from 'rxjs';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [HomeComponent]
    }).compileComponents();
  });

  it('should create the @nwx/unsub', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const home = fixture.debugElement.componentInstance;
    expect(home).toBeTruthy();
  });

  it(`should have as title '@nwx/unsub'`, () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const home = fixture.debugElement.componentInstance;
    expect(home.title).toEqual('@nwx/unsub');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to @nwx/unsub! (eager)'
    );
  });
});
