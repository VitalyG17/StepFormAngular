import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-material-submit-button',
  templateUrl: './material-submit-button.component.html',
  styleUrls: ['./material-submit-button.component.scss'],
})
export class MaterialSubmitButtonComponent {
  @Input() public title: string = '';
}
