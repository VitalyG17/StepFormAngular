import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'rubCurrency'})
export class RubCurrencyPipe implements PipeTransform {
  public transform(value: number): string {
    if (value !== null && value !== undefined) {
      return value.toLocaleString('ru-RU') + ' ₽';
    }
    return '0₽';
  }
}
