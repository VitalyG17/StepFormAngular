import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
})
export class SubmitButtonComponent {
  @Input() public title: string = 'Продолжить';
  @Input() public isFormValid: boolean = false;

  public onSubmit(): void {
    if (!this.isFormValid) {
      alert('Форма не заполнена корректно!');
      return;
    }
  }
}
