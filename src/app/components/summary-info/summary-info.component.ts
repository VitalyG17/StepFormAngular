import {Component, OnDestroy, OnInit, Input, OnChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {EventInfoForm} from '../../types/eventForm';

@Component({
  selector: 'app-summary-info',
  templateUrl: './summary-info.component.html',
  styleUrls: ['./summary-info.component.scss'],
})
export class SummaryInfoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public costPerPerson: number | null = null;
  @Input() public totalAdditionalServicesCost: number = 0;
  @Input() public formState: EventInfoForm | null = null;
  protected totalPrice: number = 0;

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.updateTotalPrice();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnChanges(): void {
    this.updateTotalPrice();
    console.log('Итоговая цена: ', this.totalPrice);
  }

  private updateTotalPrice(): void {
    const guestsCount: number = this.formState ? Number(this.formState.countGuests) : 0;
    this.totalPrice = guestsCount * (this.costPerPerson ?? 0) + this.totalAdditionalServicesCost;
    if (this.totalPrice < 0) {
      this.totalPrice = 0;
    }
  }
}
