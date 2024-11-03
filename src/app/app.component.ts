import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SERVER_NAME } from 'config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly serverName = SERVER_NAME;

  protected isCollapsed = true;
}
