import {Component, ViewEncapsulation} from '@angular/core';

interface Items {
  label: string;
  completed: boolean;
}
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StepperComponent {
  public activeIndex: number = 0;

  public items: Items[] = [
    {label: 'Мероприятие', completed: true},
    {label: 'Контакты', completed: false},
  ];

  protected setActiveIndex(): void {
    this.activeIndex = this.activeIndex === 0 ? 1 : 0;
  }
}
