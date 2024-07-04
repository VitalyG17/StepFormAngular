import {Component, Input} from '@angular/core';

interface Items {
  label: string;
}
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  @Input() public activeStepsCount: number = 1;

  protected items: Items[] = [{label: 'Мероприятие'}, {label: 'Контакты'}];
}
