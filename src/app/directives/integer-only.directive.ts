import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appIntegerOnly]',
})
export class IntegerOnlyDirective {
  @Input() public appIntegerOnly: string | undefined;

  @HostListener('input', ['$event']) protected onInputChange(event: KeyboardEvent): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const intValue: number = parseInt(target.value, 10);

    if (intValue >= 0) {
      target.value = intValue.toString();
    } else {
      target.value = '';
    }
  }
}
