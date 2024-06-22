import {Injectable} from '@angular/core';
import {EventInfoForm} from '../types/eventForm';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class FormDataService {
  private formDataSubject: BehaviorSubject<EventInfoForm | null> = new BehaviorSubject<EventInfoForm | null>(null);

  public formData$: Observable<EventInfoForm | null> = this.formDataSubject.asObservable();

  public updateFormData(formData: EventInfoForm): void {
    this.formDataSubject.next(formData);
  }
}
