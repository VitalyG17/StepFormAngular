import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {ServerResponse} from 'src/app/types/serverResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {debounceTime, Subscription} from 'rxjs';
import {EventInfoForm} from '../../types/eventForm';
import {FormDataService} from '../../services/form-data.service';
import {NavigationEnd, Router} from '@angular/router';

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

  private readonly dataService: HttpService = inject(HttpService);
  private formDataService: FormDataService = inject(FormDataService);
  private router: Router = inject(Router);

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
      });

    // Сохранение/удаление данных localeStorage
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects !== '/') {
          this.formDataService.updateFormData(this.eventInfoForm.value);
        } else {
          this.formDataService.clearFormData();
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this.eventNameSubscription.unsubscribe();
    this.addServiceSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
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
    if (index > -1) {
      selectedServices.splice(index, 1);
    } else {
      selectedServices.push(serviceName);
    }

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
}
