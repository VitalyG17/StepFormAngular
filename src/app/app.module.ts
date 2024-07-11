import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubmitButtonComponent} from './components/submit-button/submit-button.component';
import {HttpClientModule} from '@angular/common/http';
import {SummaryInfoComponent} from './components/summary-info/summary-info.component';
import {PhoneMaskDirective} from './directives/phone-mask.directive';
import {RubCurrencyPipe} from './pipes/rub-currency.pipe';
import {NgOptimizedImage} from '@angular/common';
import {EventFormatService} from './services/event-format.service';
import {FormStatusService} from './services/form-status.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MaterialSubmitButtonComponent} from './components/material-submit-button/material-submit-button.component';
import {MaterialFormEventComponent} from './components/material-form-event/material-form-event.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatNativeDateModule} from '@angular/material/core';
import {MaterialFormContactsComponent} from './components/material-form-contacts/material-form-contacts.component';
import {MatChipsModule} from '@angular/material/chips';
import {IntegerOnlyDirective} from './directives/integer-only.directive';
import {MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {HeaderComponent} from './components/header/header.component';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    SubmitButtonComponent,
    SummaryInfoComponent,
    PhoneMaskDirective,
    RubCurrencyPipe,
    MaterialSubmitButtonComponent,
    MaterialFormEventComponent,
    MaterialFormContactsComponent,
    IntegerOnlyDirective,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgOptimizedImage,
    FormsModule,
    NoopAnimationsModule,
    CdkStepperModule,
    MatStepperModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatChipsModule,
  ],
  providers: [
    EventFormatService,
    FormStatusService,
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
