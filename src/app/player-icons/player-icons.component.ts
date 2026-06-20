import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-player-icons',
  templateUrl: './player-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerIconComponent {
  readonly charClass = input<number>();
  readonly race = input<number>();
  readonly gender = input<number>();
  readonly size = input<number>(32);
  readonly spacing = input<boolean>(false);
}
