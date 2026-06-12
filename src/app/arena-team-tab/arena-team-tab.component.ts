import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ArenaTeamService } from '../arena-team/arena-team.service';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { ArenaTeam } from '../types/arena-team.type';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-arena-team-tab',
  imports: [TabsModule, CommonModule, FormsModule, PaginationComponent, PlayerIconComponent],
  templateUrl: './arena-team-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaTeamTabComponent {
  readonly teams = input<ArenaTeam[]>([]);
  readonly isSolo = input(false);

  protected readonly currentPage = signal(1);
  protected readonly pageSize = PAGE_SIZE;
  protected readonly totalItems = computed(() => this.teams()?.length ?? 0);
  protected readonly pagedTeams = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return (this.teams() ?? []).slice(start, start + PAGE_SIZE);
  });

  protected readonly service: ArenaTeamService = inject(ArenaTeamService);

  protected onPageChanged(event: PageChangedEvent): void {
    this.currentPage.set(event.page);
  }
}
