import {Directive, HostListener, ElementRef} from '@angular/core';

@Directive({
  selector: '[appPhoneMask]',
})
export class PhoneMaskDirective {
  private previousValue: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const inputValue: string = input.value.replace(/\D/g, '');
    let formattedValue: string = '+7 (';

    if (inputValue.length > 1) {
      formattedValue += inputValue.substring(1, 4);
    }
    if (inputValue.length >= 4) {
      formattedValue += ') ' + inputValue.substring(4, 7);
    }
    if (inputValue.length >= 7) {
      formattedValue += '-' + inputValue.substring(7, 9);
    }
    if (inputValue.length >= 9) {
      formattedValue += '-' + inputValue.substring(9, 11);
    }

    this.el.nativeElement.value = formattedValue.substring(0, 18);
    this.previousValue = formattedValue;
  }

  @HostListener('blur', ['$event'])
  public onBlur(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const inputValue: string = input.value;

    if (inputValue.length !== 18) {
      this.el.nativeElement.value = this.previousValue;
    }
  }
}
