import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ENABLE_1v1, ENABLE_3V3_SOLO_QUEUE } from 'config';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ArenaTeamTabComponent } from '../arena-team-tab/arena-team-tab.component';
import { DetailedScoreComponent } from '../detailed-score/detailed-score.component';
import { NextArenaPointsComponent } from '../next-arena-points/next-arena-points.component';
import { SearchPlayerComponent } from '../search-player/search-player.component';
import { ARENA_TYPE_1v1, ARENA_TYPE_3v3_SOLO_QUEUE } from '../utils/arena-type';
import { ArenaTeamService } from './arena-team.service';

@Component({
  selector: 'app-arena-team',
  templateUrl: './arena-team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsModule, ArenaTeamTabComponent, AsyncPipe, DetailedScoreComponent, NextArenaPointsComponent, SearchPlayerComponent],
})
export class ArenaTeamComponent implements AfterViewInit {
  protected readonly service: ArenaTeamService = inject(ArenaTeamService);
  protected readonly teams = [
    ENABLE_1v1 ? { tabName: '1v1', arenaType: ARENA_TYPE_1v1, solo: true } : {},
    { tabName: '2v2', arenaType: 2 },
    { tabName: '3v3', arenaType: 3 },
    ENABLE_3V3_SOLO_QUEUE ? { tabName: '3v3soloQ', arenaType: ARENA_TYPE_3v3_SOLO_QUEUE, solo: true } : {},
    { tabName: '5v5', arenaType: 5 },
  ].filter((t) => t.hasOwnProperty('tabName'));

  protected readonly afterViewInit = signal(false);

  ngAfterViewInit(): void {
    this.afterViewInit.set(true);
  }
}
