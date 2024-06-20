import {Injectable} from '@angular/core';
import {EventInfoForm} from '../types/eventForm';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private formDataSubject: BehaviorSubject<EventInfoForm | null> = new BehaviorSubject<EventInfoForm | null>(null);

  public formData$: Observable<EventInfoForm | null> = this.formDataSubject.asObservable();

  public updateFormData(formData: EventInfoForm): void {
    this.formDataSubject.next(formData);
    localStorage.setItem('formData', JSON.stringify(formData));
  }

  public loadFormData(): void {
    const savedData: string | null = localStorage.getItem('formData');
    if (savedData) {
      this.formDataSubject.next(JSON.parse(savedData));
    }
  }

  public clearFormData(): void {
    this.formDataSubject.next(null);
    localStorage.removeItem('formData');
  }
}
