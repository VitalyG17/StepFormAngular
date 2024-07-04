import {Component, EventEmitter, forwardRef, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators, ControlValueAccessor} from '@angular/forms';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {EventFormatService} from '../../services/event-format.service';
import {ServerResponse} from 'src/app/types/serverResponse';
import {EventFormType, EventInfoFormValue} from '../../types/eventForm';
import {FormStatusService} from '../../services/form-status.service';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss'],
  providers: [
    HttpService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormEventComponent),
      multi: true,
    },
  ],
})
export class FormEventComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Output() public formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(); // Сообщает родительскому компоненту об отправке формы

  @Output() public selectedEventCostChange: EventEmitter<null | number> = new EventEmitter<number | null>();

  @Output() public totalAdditionalServicesCostChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() public isFormValid: boolean = false;

  public totalAdditionalServicesCost: number = 0; // Общая стоимость выбранных доп услуг

  protected eventName: ServerResponse[] = []; // Название мероприятия

  protected addService: ServerResponse[] = []; // Названия доп услуг

  protected dropdownOpen: boolean = false; // Флаг видимости выпадающего списка

  protected formattedServicesText: string = ''; //Строка выбранных доп.услуг

  protected selectedEventName: string | null = null; // Выбранное название мероприятия

  protected selectedServices: string[] = []; // Выбранные доп услуги

  private destroy$: Subject<void> = new Subject<void>(); // Для управления подписками

  private selectedEventCost: number = 0; // Стоимость выбранного мероприятия

  private readonly dataService: HttpService = inject(HttpService); // Сервис для получения информации о доп услугах

  private readonly eventFormatService: EventFormatService = inject(EventFormatService); // Сервис для получения информации о мероприятиях

  private readonly formStatusService: FormStatusService = inject(FormStatusService);

  protected readonly eventInfoForm: FormGroup<EventFormType> = new FormGroup<EventFormType>({
    formEventName: new FormControl(null, Validators.required),
    countGuests: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(100)]),
    date: new FormControl(null, Validators.required),
    additionService: new FormControl([]),
    menuWishes: new FormControl(''),
  });

  // Методы ControlValueAccessor
  private onChange?: (value: EventInfoFormValue) => void;
  protected onTouched?: () => void;

  // Установка значения формы извне
  public writeValue(value: EventInfoFormValue): void {
    this.eventInfoForm.patchValue(value);
  }

  // Обработчик изменений в форме
  public registerOnChange(fn: (value: EventInfoFormValue) => void): void {
    this.onChange = fn;
  }

  // Обработчик потери фокуса в форме
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public ngOnInit(): void {
    // Получение данных с сервера при инициализации
    this.eventFormatService
      .getEventFormats('eventFormat')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ServerResponse[]) => {
        this.eventName = data;
      });

    this.dataService
      .getAddServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ServerResponse[]) => {
        this.addService = data;
      });

    // Подписка на изменение формы formData: EventInfoFormValue
    this.eventInfoForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((formData: any) => {
      console.log('Текущее состояние формы:', formData);
      console.log('Цена за человека:', this.selectedEventCost);
      console.log('Стоимость доп услуг:', this.totalAdditionalServicesCost);
      console.log(this.formattedServicesText);
      if (this.onChange) {
        this.onChange(formData);
      }
      this.submitForm();
    });

    // Поиск стоимости за человека в зависимости от типа мероприятия
    this.eventInfoForm
      .get('formEventName')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((eventName: string | null) => {
        const selectedEvent: ServerResponse | undefined = this.eventName.find(
          (event: ServerResponse): boolean => event.name === eventName,
        );
        if (selectedEvent) {
          this.selectedEventCost = selectedEvent.costPerPerson;
        }
        this.selectedEventCostChange.emit(this.selectedEventCost);
      });

    // Вычисление стоимости доп услуг
    this.eventInfoForm
      .get('additionService')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedServices: string[] | null) => {
        this.totalAdditionalServicesCost = this.calculateTotalAdditionalServicesCost(selectedServices);
        this.totalAdditionalServicesCostChange.emit(this.totalAdditionalServicesCost);
        this.formattedServicesText = this.calculateServicesText(selectedServices);
      });
  }

  // Отписка от всех подписок
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Метод для определения того, какой тип мероприятия выбран
  public onRadioChange(selectedValue: string): void {
    this.selectedEventName = selectedValue;
  }

  // Проверяет валидность формы
  public submitForm(): void {
    this.isFormValid = this.eventInfoForm.valid;
    this.formSubmitted.emit(this.eventInfoForm.valid);
    this.formStatusService.setFormValid(this.isFormValid);
  }

  // Выбор доп услуг
  public onServiceSelect(event: Event, serviceName: string): void {
    event.stopPropagation();
    const selectedServices: string[] = this.eventInfoForm.get('additionService')?.value ?? [];
    const index: number = selectedServices.indexOf(serviceName);
    index > -1 ? selectedServices.splice(index, 1) : selectedServices.push(serviceName);

    this.eventInfoForm.get('additionService')?.setValue(selectedServices);
    this.selectedServices = selectedServices;
  }

  // Видимость выпадающего списка
  public toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Текст для отображения выбранных услуг
  private calculateServicesText(selectedServices: string[] | null): string {
    if (!selectedServices) {
      return '';
    }
    if (selectedServices.length > 2) {
      const visibleServices: string[] = selectedServices.slice(0, 2);
      const remainingCount: number = selectedServices.length - 2;
      return `${visibleServices.join(', ')} +${remainingCount}`;
    }
    return selectedServices.join(', ');
  }

  // Вычисление стоимости доп услуг
  private calculateTotalAdditionalServicesCost(selectedServices: string[] | null): number {
    if (!selectedServices) {
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
