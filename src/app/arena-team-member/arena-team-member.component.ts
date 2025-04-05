import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { getNextArenaPoints } from '../utils/get-arena-points';
import { ArenaTeamMemberService } from './arena-team-member.service';

@Component({
    selector: 'app-arena-team-member',
    templateUrl: './arena-team-member.component.html',
    styleUrls: ['./arena-team-member.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, PlayerIconComponent, PopoverModule]
})
export class ArenaTeamMemberComponent implements OnInit {
  protected readonly service: ArenaTeamMemberService = inject(ArenaTeamMemberService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  private readonly destroy$ = new Subject();

  protected readonly getNextArenaPoints = getNextArenaPoints;

  protected redirectToPlayer(playerGuid: number): void {
    this.router.navigate(['/player/', playerGuid]);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.service.init(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
