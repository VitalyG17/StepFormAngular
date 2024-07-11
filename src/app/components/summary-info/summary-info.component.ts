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

  @Input() public countGuests: number | null = null;

  @Input() public date: Date | null = null;

  @Input() public formEventName: string | null = null;

  protected totalPrice: number = 0;

  public ngOnInit(): void {
    this.updateTotalPrice();
  }

  public ngOnChanges(): void {
    this.updateTotalPrice();
  }

  private updateTotalPrice(): void {
    if (this.countGuests) {
      this.totalPrice = this.countGuests * (this.costPerPerson ?? 0) + this.totalAdditionalServicesCost;
      if (this.totalPrice < 0) {
        this.totalPrice = 0;
      }
    }
  }
}
