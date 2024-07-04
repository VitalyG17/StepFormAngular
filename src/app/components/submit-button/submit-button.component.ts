import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormStatusService} from '../../services/form-status.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
})
export class SubmitButtonComponent implements OnInit, OnDestroy {
  @Input() public title: string = '';

  @Output() public switchView: EventEmitter<void> = new EventEmitter<void>();

  public isFormValid: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  private formStatusService: FormStatusService = inject(FormStatusService);

  public ngOnInit(): void {
    this.formStatusService.formValid$.pipe(takeUntil(this.destroy$)).subscribe((isValid: boolean) => {
      this.isFormValid = isValid;
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    if (!this.isFormValid) {
      alert('Форма не заполнена корректно!');
      return;
    }
    this.switchView.emit();
  }
}
