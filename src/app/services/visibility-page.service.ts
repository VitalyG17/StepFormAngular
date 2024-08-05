import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class VisibilityPageService {
  public focusSubject$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.initFocusListener();
  }

  private initFocusListener(): void {
    window.addEventListener('focus', this.onFocus.bind(this));
    window.addEventListener('blur', this.onBlur.bind(this));
  }

  private onFocus(): void {
    this.focusSubject$.next(true);
  }

  private onBlur(): void {
    this.focusSubject$.next(false);
  }
}
