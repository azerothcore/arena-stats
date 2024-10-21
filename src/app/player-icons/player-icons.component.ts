import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-icons',
  standalone: true,
  templateUrl: './player-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerIconComponent {
  @Input() charClass: number;
  @Input() race: number;
  @Input() gender: number;
}
