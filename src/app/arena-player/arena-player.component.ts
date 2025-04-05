import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from 'config';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgxSelectModule } from 'ngx-select-ex';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ArenaTypes } from '../arena-team/arena-team.model';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { Player } from '../search-player/search-player.model';
import { getNextArenaPoints } from '../utils/get-arena-points';
import { PlayerArenaTeams } from './arena-player.model';

@Component({
    selector: 'app-arena-player',
    templateUrl: './arena-player.component.html',
    styleUrls: ['./arena-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgxSelectModule, ReactiveFormsModule, PlayerIconComponent, PopoverModule],
    encapsulation: ViewEncapsulation.None
})
export class ArenaPlayerComponent implements OnInit, OnDestroy {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  private readonly unsubscribe$ = new Subject<void>();

  protected player: Player;
  protected playerArenaTeams: any[];

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(
        switchMap((params) => {
          const guid = params.get('guid');
          return this.http.get<PlayerArenaTeams>(`${API_URL}/characters/player_arena_team/${guid}`);
        }),
      )
      .subscribe(({ playerData, arenaTeamsData, characterArenaStats }) => {
        this.player = playerData;
        const arenaStatsPerType = {};
        for (const charArenaStat of characterArenaStats) {
          const arenaType = this.getArenaTypeBySlot(charArenaStat.slot);
          arenaStatsPerType[arenaType] = charArenaStat;
        }

        this.playerArenaTeams = arenaTeamsData.map((arenaTeamData) => {
          // To get points, a player has to participate in at least 30% of the matches
          const neededGames = arenaTeamData.arenaTeamWeekGames >= 10 ? Math.ceil(arenaTeamData.arenaTeamWeekGames * 0.3) : 10;

          return {
            ...arenaTeamData,
            seasonLosses: arenaTeamData.seasonGames - arenaTeamData.seasonWins,
            weekLosses: arenaTeamData.weekGames - arenaTeamData.weekWins,
            weekNeeded: arenaTeamData.weekGames > neededGames ? 0 : neededGames - arenaTeamData.weekGames,
            nextArenaPoints: getNextArenaPoints(arenaTeamData.personalRating, arenaTeamData.arenaType),
            ...arenaStatsPerType[arenaTeamData.arenaType],
          };
        });

        this.cdRef.markForCheck();
      });
  }

  private getArenaTypeBySlot(slot: number): ArenaTypes {
    const arenaTypeBySlot = {
      0: ArenaTypes.ARENA_TYPE_2v2,
      1: ArenaTypes.ARENA_TYPE_3v3,
      2: ArenaTypes.ARENA_TYPE_5v5,
      3: ArenaTypes.ARENA_TYPE_1v1,
      4: ArenaTypes.ARENA_TYPE_3v3_SOLO_QUEUE,
    };

    return arenaTypeBySlot[slot];
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
