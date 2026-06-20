import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { ENABLE_1v1, ENABLE_3V3_SOLO_QUEUE } from 'config';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ArenaTeamTabComponent } from '../arena-team-tab/arena-team-tab.component';
import { DetailedScoreComponent } from '../detailed-score/detailed-score.component';
import { NextArenaPointsComponent } from '../next-arena-points/next-arena-points.component';
import { SearchPlayerComponent } from '../search-player/search-player.component';
import { TopArenaRatedComponent } from '../top-arena-rated/top-arena-rated.component';
import { ARENA_TYPE_1v1, ARENA_TYPE_3v3_SOLO_QUEUE } from '../utils/arena-type';
import { ArenaTeamService } from './arena-team.service';

@Component({
  selector: 'app-arena-team',
  templateUrl: './arena-team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TabsModule,
    ArenaTeamTabComponent,
    AsyncPipe,
    DetailedScoreComponent,
    NextArenaPointsComponent,
    SearchPlayerComponent,
    TopArenaRatedComponent,
  ],
})
export class ArenaTeamComponent implements AfterViewInit {
  readonly arenaTabset = viewChild<TabsetComponent>('arenaTabset');

  private readonly lastTabSignal = signal<string | null>(this.getStoredTab());

  protected readonly service: ArenaTeamService = inject(ArenaTeamService);
  protected readonly teams = [
    ENABLE_1v1 ? { tabName: '1v1', arenaType: ARENA_TYPE_1v1, solo: true } : {},
    { tabName: '2v2', arenaType: 2 },
    { tabName: '3v3', arenaType: 3 },
    ENABLE_3V3_SOLO_QUEUE ? { tabName: '3v3soloQ', arenaType: ARENA_TYPE_3v3_SOLO_QUEUE, solo: true } : {},
    { tabName: '5v5', arenaType: 5 },
  ].filter((t): t is { tabName: string; arenaType: number; solo?: boolean } => t.hasOwnProperty('tabName'));
  private readonly LAST_TAB_KEY = this.teams[0].tabName;

  protected readonly afterViewInit = signal(false);

  ngAfterViewInit(): void {
    this.afterViewInit.set(true);
    this.restoreLastTab();
  }

  protected onTabChange(tabId: string): void {
    this.saveCurrentTab(tabId);
  }

  private getStoredTab(): string | null {
    return localStorage.getItem(this.LAST_TAB_KEY);
  }

  private restoreLastTab(): void {
    const lastTabId = this.getStoredTab();
    if (lastTabId && this.arenaTabset()?.tabs) {
      setTimeout(() => {
        const arenaTabset = this.arenaTabset();
        const tabIndex = arenaTabset?.tabs.findIndex((tab) => tab.id === lastTabId);
        if (tabIndex !== undefined && tabIndex !== -1 && arenaTabset?.tabs[tabIndex]) {
          arenaTabset.tabs[tabIndex].active = true;
        }
      }, 0);
    }
  }

  private saveCurrentTab(tabId: string): void {
    localStorage.setItem(this.LAST_TAB_KEY, tabId);
    this.lastTabSignal.set(tabId);
  }
}
