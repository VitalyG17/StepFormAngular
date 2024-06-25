import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {ServerResponse} from 'src/app/types/serverResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {debounceTime, Subject} from 'rxjs';
import {EventInfoForm} from '../../types/eventForm';
import {FormDataService} from '../../services/form-data.service';
import {EventFormatService} from '../../services/event-format.service';

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

  protected readonly eventInfoForm: FormGroup<EventInfoForm> = new FormGroup<EventInfoForm>({
    formEventName: new FormControl(null, Validators.required),
    countGuests: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(100)]),
    date: new FormControl(null, Validators.required),
    additionService: new FormControl([]),
    menuWishes: new FormControl(''),
  });

  private destroy$: Subject<void> = new Subject<void>();
  private readonly dataService: HttpService = inject(HttpService);
  private readonly eventFormatService: EventFormatService = inject(EventFormatService);
  private readonly formDataService: FormDataService = inject(FormDataService);

  public ngOnInit(): void {
    this.eventFormatService.getEventFormats().subscribe((data: ServerResponse[]) => {
      this.eventName = data;
    });

    this.dataService.getAddServices().subscribe((data: ServerResponse[]) => {
      this.addService = data;
    });

    this.eventInfoForm.valueChanges.pipe(debounceTime(500)).subscribe((value: any) => {
      this.formDataService.updateFormData(value);
      this.formSubmitted.emit(this.eventInfoForm.valid);
    });

    // Подписка изменения formEventName для обновления стоимости
    this.eventInfoForm.get('formEventName')?.valueChanges.subscribe((eventName: string | null) => {
      const selectedEvent: ServerResponse | undefined = this.eventName.find(
        (event: ServerResponse): boolean => event.name === eventName,
      );
      if (selectedEvent) {
        this.selectedEventCost = selectedEvent.costPerPerson;
        this.formDataService.updateEventCost(this.selectedEventCost);
      } else {
        this.selectedEventCost = null;
        this.formDataService.updateEventCost(null);
      }
    });

    // Подписка обновления общей стоимости доп. услуг
    this.eventInfoForm.get('additionService')?.valueChanges.subscribe((selectedServices: string[] | null) => {
      this.totalAdditionalServicesCost = this.calculateTotalAdditionalServicesCost(selectedServices);
      this.formDataService.updateAdditionalServicesCost(this.totalAdditionalServicesCost);
    });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.submitForm();
  }

  public onRadioChange(selectedValue: string) {
    this.selectedEventName = selectedValue;
  }

  // Проверка заполненности формы
  public submitForm() {
    if (this.eventInfoForm.valid) {
      this.formSubmitted.emit(true);
    } else {
      this.formSubmitted.emit(false);
    }
  }

  public onServiceSelect(event: Event, serviceName: string) {
    event.stopPropagation();
    const selectedServices: string[] = this.eventInfoForm.get('additionService')?.value ?? [];
    const index: number = selectedServices.indexOf(serviceName);
    index > -1 ? selectedServices.splice(index, 1) : selectedServices.push(serviceName);

    this.eventInfoForm.get('additionService')?.setValue(selectedServices);
    this.selectedServices = selectedServices;
  }

  public toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  public getSelectedServicesText() {
    if (this.selectedServices.length > 2) {
      const visibleServices: string[] = this.selectedServices.slice(0, 2);
      const remainingCount: number = this.selectedServices.length - 2;
      return `${visibleServices.join(', ')} +${remainingCount}`;
    }
    return this.selectedServices.join(', ');
  }

  // Подсчет стоимости дополнительных услуг
  private calculateTotalAdditionalServicesCost(selectedServices: string[] | null): number {
    if (selectedServices === null) {
      return 0;
    }
    return selectedServices.reduce((total: number, serviceName: string): number => {
      const service: ServerResponse | undefined = this.addService.find(
        (service: ServerResponse): boolean => service.name === serviceName,
      );
      return service ? total + service.cost : total;
    }, 0);
  }
}
