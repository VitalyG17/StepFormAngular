import {Component, inject, OnDestroy, OnInit} from '@angular/core';
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

  protected readonly eventInfoForm: FormGroup = new FormGroup({
    formEventName: new FormControl(null, Validators.required),
    countGuests: new FormControl(null, Validators.required),
    date: new FormControl(null, Validators.required),
    additionService: new FormControl(''),
    menuWishes: new FormControl(''),
  });

  private eventNameSubscription: Subscription = new Subscription();
  private addServiceSubscription: Subscription = new Subscription();
  private formChangesSubscription: Subscription = new Subscription();

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
      });
  }

  public ngOnDestroy(): void {
    this.eventNameSubscription.unsubscribe();
    this.addServiceSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
  }

  public onRadioChange(selectedValue: string): void {
    this.selectedEventName = selectedValue;
  }
}
