import {Injectable} from '@angular/core';
import {EventInfoForm} from '../types/eventForm';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class FormDataService {
  private formDataSubject: BehaviorSubject<EventInfoForm | null> = new BehaviorSubject<EventInfoForm | null>(null);
  public formData$: Observable<EventInfoForm | null> = this.formDataSubject.asObservable();

  private eventCostSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public eventCost$: Observable<number | null> = this.eventCostSubject.asObservable();

  private additionalServicesCostSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public additionalServicesCost$: Observable<number> = this.additionalServicesCostSubject.asObservable();

  public updateFormData(data: EventInfoForm): void {
    this.formDataSubject.next(data);
  }

  public updateEventCost(cost: number | null): void {
    this.eventCostSubject.next(cost);
  }

  public updateAdditionalServicesCost(cost: number): void {
    this.additionalServicesCostSubject.next(cost);
  }
}
