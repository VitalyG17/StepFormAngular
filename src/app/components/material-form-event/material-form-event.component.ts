import {Component, forwardRef, inject, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import {EventFormType, EventInfoFormValue} from '../../types/eventForm';
import {ServerResponse} from '../../types/serverResponse';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {EventFormatService} from '../../services/event-format.service';

@Component({
  selector: 'app-material-form-event',
  templateUrl: './material-form-event.component.html',
  styleUrls: ['./material-form-event.component.scss'],
  providers: [
    HttpService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaterialFormEventComponent),
      multi: true,
    },
  ],
})
export class MaterialFormEventComponent implements OnInit, ControlValueAccessor {
  public selectedEventCost: number = 0; // Стоимость выбранного мероприятия

  public totalAdditionalServicesCost: number = 0; // Общая стоимость выбранных доп услуг

  protected startDate: Date = new Date(2024, 0, 1); // Начальная дата выбора календаря

  protected eventName: ServerResponse[] = []; // Название мероприятия

  protected addServices: ServerResponse[] = []; // Дополнительные услуги

  private destroy$: Subject<void> = new Subject<void>(); // Для управления подписками

  private readonly dataService: HttpService = inject(HttpService); // Сервис для получения информации о доп услугах

  private readonly eventFormatService: EventFormatService = inject(EventFormatService); // Cервис для получения форматов мероприятий

  public readonly eventInfoForm: FormGroup<EventFormType> = new FormGroup<EventFormType>({
    formEventName: new FormControl(null, Validators.required),
    countGuests: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(100)]),
    date: new FormControl(null, Validators.required),
    additionService: new FormControl([]),
    menuWishes: new FormControl(''),
  });

  // Методы ControlValueAccessor
  private onChange?: (value: EventInfoFormValue) => void;
  protected onTouched?: () => void;

  public writeValue(value: EventInfoFormValue): void {
    this.eventInfoForm.patchValue(value);
  }

  public registerOnChange(fn: (value: EventInfoFormValue) => void): void {
    this.onChange = (value: EventInfoFormValue): void => {
      fn(value);
    };
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public ngOnInit(): void {
    this.eventFormatService
      .getEventFormats()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ServerResponse[]) => {
        this.eventName = data;
      });

    this.dataService
      .getAddServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ServerResponse[]) => {
        this.addServices = data;
      });

    // Поиск стоимости за человека в зависимости от типа мероприятия
    const formEventNameControl: AbstractControl<string | null, string | null> | null =
      this.eventInfoForm.get('formEventName');
    if (formEventNameControl) {
      formEventNameControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((eventName: string | null) => {
        const selectedEvent: ServerResponse | undefined = this.eventName.find(
          (event: ServerResponse): boolean => event.name === eventName,
        );
        if (selectedEvent) {
          this.selectedEventCost = selectedEvent.costPerPerson;
        }
      });
    }

    // Вычисление стоимости доп услуг
    const additionServiceControl: AbstractControl<string[] | null, string[] | null> | null =
      this.eventInfoForm.get('additionService');
    if (additionServiceControl) {
      additionServiceControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((selectedServices: string[] | null) => {
          this.totalAdditionalServicesCost = this.calculateTotalAdditionalServicesCost(selectedServices);
        });
    }

    this.eventInfoForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {});
  }

  // Метод для получения текста для отображения в label select
  public getAdditionalServicesText(): string {
    const selectedServices: string[] | null | undefined = this.eventInfoForm.get('additionService')?.value;
    if (!selectedServices || selectedServices.length === 0) {
      return 'Дополнительные услуги';
    } else if (selectedServices.length <= 2) {
      return selectedServices.join(', ');
    } else {
      return `${selectedServices.slice(0, 2).join(', ')} +${selectedServices.length - 2}`;
    }
  }

  // Вычисление стоимости доп услуг
  private calculateTotalAdditionalServicesCost(selectedServices: string[] | null): number {
    if (!selectedServices) {
      return 0;
    }
    return selectedServices.reduce((total: number, serviceName: string): number => {
      const service: ServerResponse | undefined = this.addServices.find(
        (service: ServerResponse): boolean => service.name === serviceName,
      );
      return service ? total + service.cost : total;
    }, 0);
  }
}
