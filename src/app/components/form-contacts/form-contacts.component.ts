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
  private onChange: (value: AboutInfoForm) => void = () => {};
  private onTouched: () => void = () => {};

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

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public writeValue(obj: any): void {
    this.aboutInfoForm.patchValue(obj);
  }
}
