import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

interface AboutInfoForm {
  userName: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  email: FormControl<string | null>;
}

@Component({
  selector: 'app-form-contacts',
  templateUrl: './form-contacts.component.html',
  styleUrls: ['./form-contacts.component.scss'],
})
export class FormContactsComponent {
  protected readonly aboutInfoForm: FormGroup<AboutInfoForm> = new FormGroup<AboutInfoForm>({
    userName: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.email),
  });
}
