import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {EventInfoForm} from '../../types/eventForm';
import {FormDataService} from '../../services/form-data.service';

@Component({
  selector: 'app-summary-info',
  templateUrl: './summary-info.component.html',
  styleUrls: ['./summary-info.component.scss'],
})
export class SummaryInfoComponent implements OnInit, OnDestroy {
  private formStateSubscription: Subscription = new Subscription();
  public formState: EventInfoForm | null = null;
  protected totalPrice: number = 0;
  protected onePersonPrice: number = 5000;

  private formDataService: FormDataService = inject(FormDataService);

  public ngOnInit(): void {
    this.formDataService.loadFormData();
    this.formStateSubscription = this.formDataService.formData$.subscribe((state: EventInfoForm | null): void => {
      this.formState = state;
      this.updateTotalPrice();
      console.log(state);
    });
  }

  public ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
  }

  private updateTotalPrice(): void {
    this.formState
      ? (this.totalPrice = Number(this.formState.countGuests) * this.onePersonPrice)
      : (this.totalPrice = 0);
    if (this.totalPrice < 0) this.totalPrice = 0;
  }
}
