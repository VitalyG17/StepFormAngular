import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-about-event',
  templateUrl: './about-event.component.html',
  styleUrls: ['./about-event.component.scss'],
})
export class AboutEventComponent {
  public isFormValid: boolean = false;
  @Output() public switchView: EventEmitter<void> = new EventEmitter<void>();
}
