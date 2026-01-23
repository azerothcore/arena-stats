import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SERVER_NAME } from 'config';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ReactiveFormsModule, TabsModule],
})
export class AppComponent {
  protected readonly serverName = SERVER_NAME;

  protected isCollapsed = true;
}
