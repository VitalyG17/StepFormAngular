import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

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
    email: new FormControl(null, Validators.email),
  });

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.aboutInfoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formSubmitted.emit(this.aboutInfoForm.valid);
    });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    alert('Спасибо за заявку!');
  }
}
