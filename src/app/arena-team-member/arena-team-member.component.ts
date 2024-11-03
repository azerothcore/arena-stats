import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArenaPointsMultiplier } from 'config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { ArenaTeamMember } from '../types/arena-team-member.type';
import { ArenaTeam } from '../types/arena-team.type';
import { ArenaTeamMemberService } from './arena-team-member.service';

@Component({
  selector: 'app-arena-team-member',
  templateUrl: './arena-team-member.component.html',
  styleUrls: ['./arena-team-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, PlayerIconComponent],
})
export class ArenaTeamMemberComponent implements OnInit {
  protected readonly service: ArenaTeamMemberService = inject(ArenaTeamMemberService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  private readonly destroy$ = new Subject();

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.service.init(params.get('id'));
    });
  }

  protected getNextArenaPoints(rating: ArenaTeamMember['personalRating'], type: ArenaTeam['type']): number {
    /**
     * formula sources
     * wowwiki-archive https://wowwiki-archive.fandom.com/wiki/Arena_point_calculator#:~:text=If%20%5BRating%5D>1500,a%20fives%20team
     * azerothcore https://github.com/azerothcore/azerothcore-wotlk/blob/master/src/server/game/Battlegrounds/ArenaTeam.cpp#L652
     */

    const keyMultiplier = type === 4 ? `t3v3soloQ` : `t${type}v${type}`;
    let ARENA_POINTS_BASE = 344;

    if (rating > 1500) {
      ARENA_POINTS_BASE = 1511.26 / (1.0 + 1639.28 * Math.exp(-0.00412 * rating));
    }

    return Math.round(ARENA_POINTS_BASE * ArenaPointsMultiplier[keyMultiplier]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
