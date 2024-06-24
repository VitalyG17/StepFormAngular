import {FormControl} from '@angular/forms';

export interface EventInfoForm {
  formEventName: FormControl<string | null>;
  countGuests: FormControl<number | null>;
  date: FormControl<Date | null>;
  additionService: FormControl<string[] | null>;
  menuWishes: FormControl<string | null>;
}
