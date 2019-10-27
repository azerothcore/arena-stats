import { Component } from '@angular/core';
import { AppService } from './app.service';
import { SERVER_NAME } from 'config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public service: AppService) { }

  public readonly serverName = SERVER_NAME;
}
