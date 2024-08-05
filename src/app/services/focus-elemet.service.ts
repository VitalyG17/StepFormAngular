import {ElementRef, Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class FocusElementService {
  public focusedElementSubject$: BehaviorSubject<ElementRef | null> = new BehaviorSubject<ElementRef | null>(null);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.addEventListener('focusin', this.handleFocusIn.bind(this));
    this.document.addEventListener('focusout', this.handleFocusOut.bind(this));
  }

  private handleFocusIn(event: FocusEvent): void {
    this.focusedElementSubject$.next(event.target ? new ElementRef(event.target) : null);
  }

  private handleFocusOut(): void {
    if (this.focusedElementSubject$.value) {
      this.focusedElementSubject$.next(null);
    }
  }
}
