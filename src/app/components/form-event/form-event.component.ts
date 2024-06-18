import {Component, OnInit} from '@angular/core';
import {ServerResponse} from 'src/app/types/serverResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataReceivingService} from '../../services/data-receiving.service';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss'],
})
export class FormEventComponent implements OnInit {
  public eventName: ServerResponse[] = [];
  protected selectedEventName: string | null = null;

  public eventInfoForm: FormGroup = new FormGroup({
    formEventName: new FormControl('', Validators.required),
    countGuests: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    additionService: new FormControl(''),
    menuWishes: new FormControl(''),
  });

  constructor(private dataService: DataReceivingService) {}

  public ngOnInit(): void {
    this.dataService.getServerData().subscribe((data: ServerResponse[]): void => {
      data.forEach((service: ServerResponse): void => {
        this.eventName.push(service);
      });
    });
  }

  public onRadioChange(selectedValue: string): void {
    this.selectedEventName = selectedValue;
  }
}
