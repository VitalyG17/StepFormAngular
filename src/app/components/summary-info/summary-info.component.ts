import {Component, OnInit, Input, OnChanges} from '@angular/core';

export type NullUnd = null | undefined;

@Component({
  selector: 'app-summary-info',
  templateUrl: './summary-info.component.html',
  styleUrls: ['./summary-info.component.scss'],
})
export class SummaryInfoComponent implements OnInit, OnChanges {
  @Input() public costPerPerson: number | NullUnd = null;

  @Input() public totalAdditionalServicesCost: number = 0;

  @Input() public countGuests: number | NullUnd = null;

  @Input() public date: Date | NullUnd = null;

  @Input() public formEventName: string | NullUnd = null;

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
