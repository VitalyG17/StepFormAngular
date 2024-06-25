import {Component} from '@angular/core';

enum ViewPages {
  About = 'about',
  Contacts = 'contacts',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected currentView: string = ViewPages.About;

  protected switchView(): void {
    this.currentView = this.currentView === ViewPages.About ? ViewPages.Contacts : ViewPages.About;
  }
}
