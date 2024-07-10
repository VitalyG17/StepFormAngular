import {Component, ViewChild} from '@angular/core';
import {MaterialFormContactsComponent} from './components/material-form-contacts/material-form-contacts.component';
import {MaterialFormEventComponent} from './components/material-form-event/material-form-event.component';
import {EventInfoForm} from './types/eventForm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('stepper') protected stepper: {selectedIndex: number} | undefined;
  @ViewChild(MaterialFormContactsComponent) protected contactsForm: MaterialFormContactsComponent | undefined;
  @ViewChild(MaterialFormEventComponent) protected eventForm: MaterialFormEventComponent | undefined;

  protected isEditable: boolean = true;

  public formData: EventInfoForm | null = null;

  // Передаем данные в компонент SummaryInfoComponent через Input свойства
  public get selectedEventCost(): number | null {
    return this.eventForm ? this.eventForm.selectedEventCost : null;
  }

  public get totalAdditionalServicesCost(): number {
    return this.eventForm ? this.eventForm.totalAdditionalServicesCost : 0;
  }

  // public get formData(): EventInfoForm | null {
  //     return this.eventForm ? this.eventForm.eventInfoForm.value : null;
  // }
}
