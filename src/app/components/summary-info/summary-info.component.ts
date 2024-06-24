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
  private eventCostSubscription: Subscription = new Subscription();
  private additionalServicesCostSubscription: Subscription = new Subscription();

  public formState: EventInfoForm | null = null;
  protected totalPrice: number = 0;
  protected onePersonPrice: number = 0;
  protected totalAdditionalServicesCost: number = 0;

  private formDataService: FormDataService = inject(FormDataService);

  public ngOnInit(): void {
    this.formStateSubscription = this.formDataService.formData$.subscribe((state: EventInfoForm | null): void => {
      this.formState = state;
      this.updateTotalPrice();
    });

    this.eventCostSubscription = this.formDataService.eventCost$.subscribe((cost: number | null): void => {
      this.onePersonPrice = cost || 0;
      this.updateTotalPrice();
    });

    this.additionalServicesCostSubscription = this.formDataService.additionalServicesCost$.subscribe(
      (cost: number): void => {
        this.totalAdditionalServicesCost = cost || 0;
        this.updateTotalPrice();
      },
    );
  }

  public ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
    this.eventCostSubscription.unsubscribe();
    this.additionalServicesCostSubscription.unsubscribe();
  }

  private updateTotalPrice(): void {
    const guestsCount: number = this.formState ? Number(this.formState.countGuests) : 0;
    this.totalPrice = guestsCount * this.onePersonPrice + this.totalAdditionalServicesCost;
    if (this.totalPrice < 0) this.totalPrice = 0;
  }
}
