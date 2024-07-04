import {Component} from '@angular/core';
import {EventInfoForm} from '../../types/eventForm';

@Component({
  selector: 'app-about-event',
  templateUrl: './about-event.component.html',
  styleUrls: ['./about-event.component.scss'],
})
export class AboutEventComponent {
  public selectedEventCost: number | null = null;
  public totalAdditionalServicesCost: number = 0;
  public formData: EventInfoForm | null = null;
}
