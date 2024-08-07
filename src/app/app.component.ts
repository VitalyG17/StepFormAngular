import {Component, ViewChild} from '@angular/core';
import {MaterialFormContactsComponent} from './components/material-form-contacts/material-form-contacts.component';
import {MaterialFormEventComponent} from './components/material-form-event/material-form-event.component';
import {MatStepper} from '@angular/material/stepper';
import {NullUnd} from './components/summary-info/summary-info.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('stepper') protected stepper: MatStepper | undefined;

  @ViewChild(MaterialFormContactsComponent) protected contactsForm: MaterialFormContactsComponent | undefined;

  @ViewChild(MaterialFormEventComponent) protected eventForm: MaterialFormEventComponent | undefined;

  protected isEditable: boolean = true;

  public get selectedEventCost(): number | null {
    return this.eventForm ? this.eventForm.selectedEventCost : 0;
  }

  public get totalAdditionalServicesCost(): number {
    return this.eventForm ? this.eventForm.totalAdditionalServicesCost : 0;
  }

  public get selectDate(): Date | NullUnd {
    return this.eventForm ? this.eventForm.eventInfoForm.get('date')?.value : null;
  }

  public get selectCountGuest(): number | NullUnd {
    return this.eventForm ? this.eventForm.eventInfoForm.get('countGuests')?.value : null;
  }

  public get selectedEventName(): string | NullUnd {
    return this.eventForm ? this.eventForm.eventInfoForm.get('formEventName')?.value : null;
  }
}
