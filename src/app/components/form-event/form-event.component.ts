import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ServerResponse} from 'src/app/types/serverResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Subscription} from 'rxjs';

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

  public eventInfoForm: FormGroup = new FormGroup({
    formEventName: new FormControl('', Validators.required),
    countGuests: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    additionService: new FormControl(''),
    menuWishes: new FormControl(''),
  });

  private eventNameSubscription: Subscription = new Subscription();
  private addServiceSubscription: Subscription = new Subscription();

  private readonly dataService: HttpService = inject(HttpService);

  public ngOnInit(): void {
    this.eventNameSubscription = this.dataService.getEventFormats().subscribe((data: ServerResponse[]) => {
      this.eventName = data;
    });

    this.addServiceSubscription = this.dataService.getAddServices().subscribe((data: ServerResponse[]) => {
      this.addService = data;
    });
  }

  public ngOnDestroy(): void {
    this.eventNameSubscription.unsubscribe();
    this.addServiceSubscription.unsubscribe();
  }

  public onRadioChange(selectedValue: string): void {
    this.selectedEventName = selectedValue;
  }
}
