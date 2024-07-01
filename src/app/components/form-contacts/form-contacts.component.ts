import {Component, EventEmitter, forwardRef, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormContactsComponent),
      multi: true,
    },
  ],
})
export class FormContactsComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private destroy$: Subject<void> = new Subject<void>();
  @Output() public formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  private onChange?: (value: AboutInfoForm) => void;
  protected onTouched?: () => void;

  protected readonly aboutInfoForm: FormGroup<AboutInfoForm> = new FormGroup<AboutInfoForm>({
    userName: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.email),
  });

  public ngOnInit(): void {
    this.aboutInfoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // При каждом изменении формы проверка валидности
      this.formSubmitted.emit(this.aboutInfoForm.valid);
    });
  }

  // Отписка от всех потокв
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    alert('Спасибо за заявку!');
  }

  public registerOnChange(fn: (value: AboutInfoForm | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(obj: AboutInfoForm | null): void {
    if (obj) {
      this.aboutInfoForm.patchValue({
        userName: obj.userName.value,
        phoneNumber: obj.phoneNumber.value,
        email: obj.email.value,
      });
    } else {
      this.aboutInfoForm.reset();
    }
  }
}
