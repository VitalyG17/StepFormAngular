import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
})
export class SubmitButtonComponent {
  @Input() public title: string = 'Продолжить';
  @Input() public isFormValid: boolean = false;

  constructor(private router: Router) {}

  public onSubmit(): void {
    if (!this.isFormValid) {
      alert('Форма не заполнена корректно!');
      return;
    }

    const currentUrl: string = this.router.url;
    if (currentUrl === '/') {
      this.router.navigate(['/contacts']);
    } else if (currentUrl === '/contacts') {
      alert('Спасибо за заявку!');
      this.router.navigate(['/']);
    }
  }
}
