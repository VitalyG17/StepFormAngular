import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected currentView: string = 'about';

  public switchView(): void {
    this.currentView = this.currentView === 'about' ? 'contacts' : 'about';
  }
}
