import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {ServerResponse} from 'src/app/types/serverResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {debounceTime, Subscription} from 'rxjs';
import {EventInfoForm} from '../../types/eventForm';
import {FormDataService} from '../../services/form-data.service';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss'],
  providers: [HttpService],
})
export class FormEventComponent implements OnInit, OnDestroy {
  public eventName: ServerResponse[] = [];
  public addService: ServerResponse[] = [];
  protected selectedEventName: string | null = null;
  @Output() public formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  public dropdownOpen: boolean = false;
  public selectedServices: string[] = [];
  public selectedEventCost: number | null = null;
  public totalAdditionalServicesCost: number = 0;

  protected readonly eventInfoForm: FormGroup = new FormGroup({
    formEventName: new FormControl(null, Validators.required),
    countGuests: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(100)]),
    date: new FormControl(null, Validators.required),
    additionService: new FormControl([]),
    menuWishes: new FormControl(''),
  });

  private eventNameSubscription: Subscription = new Subscription();
  private addServiceSubscription: Subscription = new Subscription();
  private formChangesSubscription: Subscription = new Subscription();
  private eventNameValueChangesSubscription: Subscription | undefined = new Subscription();
  private additionServiceValueChangesSubscription: Subscription | undefined = new Subscription();

  private readonly dataService: HttpService = inject(HttpService);
  private formDataService: FormDataService = inject(FormDataService);

  public ngOnInit(): void {
    this.eventNameSubscription = this.dataService.getEventFormats().subscribe((data: ServerResponse[]) => {
      this.eventName = data;
    });

    this.addServiceSubscription = this.dataService.getAddServices().subscribe((data: ServerResponse[]) => {
      this.addService = data;
    });

    this.formChangesSubscription = this.eventInfoForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value: EventInfoForm) => {
        this.formDataService.updateFormData(value);
        this.formSubmitted.emit(this.eventInfoForm.valid);
      });

    // Подписка изменения formEventName для обновления стоимости
    this.eventNameValueChangesSubscription = this.eventInfoForm
      .get('formEventName')
      ?.valueChanges.subscribe((eventName: string | null): void => {
        const selectedEvent: ServerResponse | undefined = this.eventName.find(
          (event: ServerResponse): boolean => event.name === eventName,
        );
        if (selectedEvent) {
          this.selectedEventCost = selectedEvent.costPerPerson;
        } else {
          this.selectedEventCost = null;
        }
        console.log(this.selectedEventCost);
      });

    // Подписка обновления общей стоимости доп. услуг
    this.additionServiceValueChangesSubscription = this.eventInfoForm
      .get('additionService')
      ?.valueChanges.subscribe((selectedServices: string[]) => {
        this.totalAdditionalServicesCost = this.calculateTotalAdditionalServicesCost(selectedServices);
        console.log('Цена доп.услуг: ', this.totalAdditionalServicesCost);
      });
  }

  public ngOnDestroy(): void {
    this.eventNameSubscription.unsubscribe();
    this.addServiceSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
    if (this.eventNameValueChangesSubscription) {
      this.eventNameValueChangesSubscription.unsubscribe();
    }
    if (this.additionServiceValueChangesSubscription) {
      this.additionServiceValueChangesSubscription.unsubscribe();
    }
    this.submitForm();
  }

  public onRadioChange(selectedValue: string): void {
    this.selectedEventName = selectedValue;
  }

  // Проверка заполненности формы
  public submitForm(): void {
    if (this.eventInfoForm.valid) {
      this.formSubmitted.emit(true);
      console.log('Форма корректна');
    } else {
      console.error('Форма некорректна');
      this.formSubmitted.emit(false);
    }
  }

  public onServiceSelect(event: Event, serviceName: string): void {
    event.stopPropagation();
    const selectedServices: string[] = this.eventInfoForm.get('additionService')?.value ?? [];
    const index: number = selectedServices.indexOf(serviceName);
    index > -1 ? selectedServices.splice(index, 1) : selectedServices.push(serviceName);

    this.eventInfoForm.get('additionService')?.setValue(selectedServices);
    this.selectedServices = selectedServices;
  }

  public toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  public getSelectedServicesText(): string {
    if (this.selectedServices.length > 2) {
      const visibleServices: string[] = this.selectedServices.slice(0, 2);
      const remainingCount: number = this.selectedServices.length - 2;
      return `${visibleServices.join(', ')} +${remainingCount}`;
    }
    return this.selectedServices.join(', ');
  }

  // Подсчет стоимости дополнительных услуг
  private calculateTotalAdditionalServicesCost(selectedServices: string[]): number {
    return selectedServices.reduce((total: number, serviceName: string): number => {
      const service: ServerResponse | undefined = this.addService.find(
        (service: ServerResponse): boolean => service.name === serviceName,
      );
      return service ? total + service.cost : total;
    }, 0);
  }
}
