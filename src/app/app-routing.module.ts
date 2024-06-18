import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutEventComponent} from './steps/about-event/about-event.component';
import {ContactsComponent} from './steps/contacts/contacts.component';

const routes: Routes = [
  {
    path: '',
    component: AboutEventComponent,
  },
  {
    path: 'aboutEvent',
    component: AboutEventComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
