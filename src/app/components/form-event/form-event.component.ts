import {Component, EventEmitter, forwardRef, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators, ControlValueAccessor} from '@angular/forms';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {EventFormatService} from '../../services/event-format.service';
import {ServerResponse} from 'src/app/types/serverResponse';
import {EventInfoForm, EventInfoFormValue} from '../../types/eventForm';

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
  public eventName: ServerResponse[] = []; // Название мероприятия

  public addService: ServerResponse[] = []; // Названия доп услуг

  public selectedServices: string[] = []; // Выбранные доп услуги

  public totalAdditionalServicesCost: number = 0; // Общая стоимость выбранных доп услуг

  public selectedEventCost: number | null = null; // Стоимость выбранного мероприятия

  public dropdownOpen: boolean = false; // Флаг видимости выпадающего списка

  protected selectedEventName: string | null = null; // Выбранное название мероприятия

  @Output() public formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(); // Сообщает родительскому компоненту об отправке формы

  @Output() public selectedEventCostChange: EventEmitter<null | number> = new EventEmitter<number | null>();

  @Output() public totalAdditionalServicesCostChange: EventEmitter<number> = new EventEmitter<number>();

  private destroy$: Subject<void> = new Subject<void>(); // Для управления подписками

  private readonly dataService: HttpService = inject(HttpService); // Сервис для получения информации о доп услугах

  private readonly eventFormatService: EventFormatService = inject(EventFormatService); // Сервис для получения информации о мероприятиях

  protected readonly eventInfoForm: FormGroup<EventInfoForm> = new FormGroup<EventInfoForm>({
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

    // Подписка на изменение формы
    this.eventInfoForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((formData: any) => {
      console.log('Текущее состояние формы:', formData);
      console.log('Цена за человека:', this.selectedEventCost);
      console.log('Стоимость доп услуг:', this.totalAdditionalServicesCost);
      if (this.onChange) {
        this.onChange(formData);
      }
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
        } else {
          this.selectedEventCost = null;
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
      });
  }

  // Отписка от всех подписок
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.submitForm();
  }

  // Метод для определения того, какой тип мероприятия выбран
  public onRadioChange(selectedValue: string): void {
    this.selectedEventName = selectedValue;
  }

  // Проверяет валидность формы
  public submitForm(): void {
    if (this.eventInfoForm.valid) {
      this.formSubmitted.emit(true);
    } else {
      this.formSubmitted.emit(false);
    }
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
  public getSelectedServicesText(): string {
    if (this.selectedServices.length > 2) {
      const visibleServices: string[] = this.selectedServices.slice(0, 2);
      const remainingCount: number = this.selectedServices.length - 2;
      return `${visibleServices.join(', ')} +${remainingCount}`;
    }
    return this.selectedServices.join(', ');
  }

  // Вычисление стоимости доп услуг
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
