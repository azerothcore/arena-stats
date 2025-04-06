import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-player-icons',
  standalone: true,
  templateUrl: './player-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerIconComponent {
  readonly charClass = input<number>(undefined);
  readonly race = input<number>(undefined);
  readonly gender = input<number>(undefined);
}
