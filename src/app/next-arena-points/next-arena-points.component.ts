import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ArenaPointsMultiplier, ENABLE_1v1, ENABLE_3V3_SOLO_QUEUE } from 'config';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppService } from '../app.service';

@Component({
  selector: 'app-next-arena-points',
  templateUrl: './next-arena-points.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CollapseModule, AsyncPipe, DatePipe],
})
export class NextArenaPointsComponent {
  protected readonly service: AppService = inject(AppService);
  protected readonly ENABLE_1v1 = ENABLE_1v1;
  protected readonly ENABLE_3V3_SOLO_QUEUE = ENABLE_3V3_SOLO_QUEUE;
  protected readonly ArenaPointsMultiplier = ArenaPointsMultiplier;

  protected isCollapsed = true;
}
