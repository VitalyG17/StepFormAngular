import {Component} from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  public items: any[] = [
    {label: 'Мероприятие', completed: true},
    {label: 'Контакты', completed: false},
  ];
  public activeIndex: number = 0;
}
