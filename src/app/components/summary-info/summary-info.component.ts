import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {EventInfoForm} from '../../types/eventForm';

@Component({
  selector: 'app-summary-info',
  templateUrl: './summary-info.component.html',
  styleUrls: ['./summary-info.component.scss'],
})
export class SummaryInfoComponent implements OnInit, OnChanges {
  @Input() public costPerPerson: number | null = null;

  @Input() public totalAdditionalServicesCost: number = 0;

  @Input() public formState: EventInfoForm | null = null;

  protected totalPrice: number = 0;

  public ngOnInit(): void {
    this.updateTotalPrice();
  }

  public ngOnChanges(): void {
    this.updateTotalPrice();
  }

  private updateTotalPrice(): void {
    const guestsCount: number = this.formState ? Number(this.formState.countGuests) : 0;
    this.totalPrice = guestsCount * (this.costPerPerson ?? 0) + this.totalAdditionalServicesCost;
    if (this.totalPrice < 0) {
      this.totalPrice = 0;
    }
  }
}
