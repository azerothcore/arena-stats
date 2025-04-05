import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SERVER_NAME } from 'config';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NextArenaPointsComponent } from './next-arena-points/next-arena-points.component';
import { SearchPlayerComponent } from './search-player/search-player.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TabsModule, NextArenaPointsComponent, SearchPlayerComponent],
})
export class AppComponent {
  protected readonly serverName = SERVER_NAME;

  protected isCollapsed = true;
}
