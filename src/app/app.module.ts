import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AboutEventComponent} from './steps/about-event/about-event.component';
import {ContactsComponent} from './steps/contacts/contacts.component';
import {StepperComponent} from './components/stepper/stepper.component';
import {HeaderComponent} from './components/header/header.component';
import {FormEventComponent} from './components/form-event/form-event.component';
import {SubmitButtonComponent} from './components/submit-button/submit-button.component';
import {HttpClientModule} from '@angular/common/http';
import {SummaryInfoComponent} from './components/summary-info/summary-info.component';
import {FormContactsComponent} from './components/form-contacts/form-contacts.component';
import {PhoneMaskDirective} from './directives/phone-mask.directive';
import {RubCurrencyPipe} from './pipes/rub-currency.pipe';
import {FormDataService} from './services/form-data.service';
import {NgOptimizedImage} from '@angular/common';
import {EventFormatService} from './services/event-format.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutEventComponent,
    ContactsComponent,
    StepperComponent,
    HeaderComponent,
    FormEventComponent,
    SubmitButtonComponent,
    SummaryInfoComponent,
    FormContactsComponent,
    PhoneMaskDirective,
    RubCurrencyPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule, NgOptimizedImage, FormsModule],
  providers: [FormDataService, EventFormatService],
  bootstrap: [AppComponent],
})
export class AppModule {}
