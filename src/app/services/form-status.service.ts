import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class FormStatusService {
  private readonly formValidSubject: Subject<boolean> = new Subject<boolean>();
  public readonly formValid$: Observable<boolean> = this.formValidSubject.asObservable();

  public setFormValid(isValid: boolean): void {
    this.formValidSubject.next(isValid);
  }
}
