import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  public isFormValid: boolean = false;
  @Output() public switchView: EventEmitter<void> = new EventEmitter<void>();
}
