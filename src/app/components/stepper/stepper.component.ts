import {Component} from '@angular/core';

interface Items {
  label: string;
  completed: boolean;
}
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  public items: Items[] = [
    {label: 'Мероприятие', completed: true},
    {label: 'Контакты', completed: false},
  ];
}
