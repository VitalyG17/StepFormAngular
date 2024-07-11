import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appIntegerOnly]',
})
export class IntegerOnlyDirective {
  @Input() public appIntegerOnly: string | undefined;

  @HostListener('input', ['$event.target'])
  protected onInputChange(event: HTMLInputElement): void {
    const intValue: number = parseInt(event.value, 10);

    if (intValue >= 0) {
      event.value = intValue.toString();
    } else {
      event.value = '';
    }
  }
}
