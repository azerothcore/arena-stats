import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ArenaTeamService } from '../arena-team/arena-team.service';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { ArenaTeam } from '../types/arena-team.type';

@Component({
  selector: 'app-arena-team-tab',
  imports: [TabsModule, CommonModule, PlayerIconComponent],
  templateUrl: './arena-team-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaTeamTabComponent {
  readonly teams = input<ArenaTeam[]>([]);
  readonly isSolo = input(false);

  protected readonly service: ArenaTeamService = inject(ArenaTeamService);
}
