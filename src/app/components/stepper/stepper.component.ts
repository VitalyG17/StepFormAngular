import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';

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
export class StepperComponent implements OnInit {
  public activeIndex: number = 0;

  public items: Items[] = [
    {label: 'Мероприятие', completed: true},
    {label: 'Контакты', completed: false},
  ];

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]): void => {
      if (segments.length > 0 && segments[0].path === 'contacts') {
        this.activeIndex = 1;
      }
    });
  }
}
