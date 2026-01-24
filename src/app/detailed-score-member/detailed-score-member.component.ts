import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { ArenaFightMember } from '../types/arena-fight-member.interface';

@Component({
  selector: 'app-detailed-score-member',
  templateUrl: './detailed-score-member.component.html',
  imports: [PlayerIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedScoreMemberComponent {
  readonly members = input<ArenaFightMember[]>([]);
  readonly showName = input<boolean>(true);
}
