import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

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
export class FormContactsComponent implements OnInit, OnDestroy {
  @Output() public formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected readonly aboutInfoForm: FormGroup<AboutInfoForm> = new FormGroup<AboutInfoForm>({
    userName: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  private formChangesSubscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.formChangesSubscription = this.aboutInfoForm.valueChanges.subscribe(() => {
      this.formSubmitted.emit(this.aboutInfoForm.valid);
    });
  }

  public ngOnDestroy(): void {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }
}
