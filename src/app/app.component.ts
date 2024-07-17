import {Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {MaterialFormContactsComponent} from './components/material-form-contacts/material-form-contacts.component';
import {MaterialFormEventComponent} from './components/material-form-event/material-form-event.component';
import {MatStepper} from '@angular/material/stepper';
import {NullUnd} from './components/summary-info/summary-info.component';
import {SubmittingFormDataService} from './services/submitting-form-data.service';
import {EventInfoFormValue, FormData} from './types/eventForm';
import {Subject, takeUntil} from 'rxjs';

import {SnackbarService} from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  @ViewChild('stepper') protected stepper: MatStepper | undefined;

  @ViewChild(MaterialFormContactsComponent) protected contactsForm: MaterialFormContactsComponent | undefined;

  @ViewChild(MaterialFormEventComponent) protected eventForm: MaterialFormEventComponent | undefined;

  protected isEditable: boolean = true;

  private readonly formDataService: SubmittingFormDataService = inject(SubmittingFormDataService);

  private destroy$: Subject<void> = new Subject<void>();

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
  constructor(private snackbarService: SnackbarService) {}
  public onSubmit(): void {
    if (this.eventForm && this.contactsForm) {
      const eventFormData: Partial<EventInfoFormValue> = this.eventForm.eventInfoForm.value;
      const contactsFormData: Partial<FormData> = this.contactsForm.aboutInfoForm.value;

      const formData: FormData = {...eventFormData, ...contactsFormData};

      this.formDataService
        .postData(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: Object) => {
            this.snackbarService.successShow('Данные успешно отправлены!', 'Успех!');
            console.log(response);
          },
          error: (error: unknown) => {
            this.snackbarService.errorShow('Ошибка при отправке данных!', 'Ошибка!');
            console.log(error);
          },
        });
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
