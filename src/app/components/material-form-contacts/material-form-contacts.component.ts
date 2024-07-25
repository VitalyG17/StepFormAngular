import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, Subject, takeUntil} from 'rxjs';

interface AboutInfoForm {
  userName: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  email: FormControl<string | null>;
}

@Component({
  selector: 'app-material-form-contacts',
  templateUrl: './material-form-contacts.component.html',
  styleUrls: ['./material-form-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialFormContactsComponent implements OnInit, OnDestroy, ControlValueAccessor {
  protected onTouched: (() => void) | undefined;

  private onChange: ((value: AboutInfoForm) => void) | undefined;

  private readonly destroy$: Subject<void> = new Subject<void>();

  public readonly aboutInfoForm: FormGroup<AboutInfoForm> = new FormGroup<AboutInfoForm>({
    userName: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.email, Validators.required]),
  });

  public ngOnInit(): void {
    this.aboutInfoForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {});
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public registerOnChange(fn: (value: AboutInfoForm | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(obj: AboutInfoForm): void {
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
