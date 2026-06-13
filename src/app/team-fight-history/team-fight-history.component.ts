import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_URL } from 'config';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { DetailedScoreMemberComponent } from '../detailed-score-member/detailed-score-member.component';
import { ArenaFightLog } from '../types/arena-fight-log.interface';
import { ArenaFightMember } from '../types/arena-fight-member.interface';
import { ArenaTeamFight } from '../types/arena-team-fight.interface';
import { Paginated } from '../types/paginated.interface';
import { ARENA_TYPE_1v1, ARENA_TYPE_3v3_SOLO_QUEUE } from '../utils/arena-type';
import { getFaction } from '../utils/get-faction';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-team-fight-history',
  templateUrl: './team-fight-history.component.html',
  imports: [DatePipe, DecimalPipe, FormsModule, PaginationComponent, DetailedScoreMemberComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamFightHistoryComponent {
  readonly teamId = input.required<number>();
  // 3v3 solo queue fights aren't tied to a persistent arena team, so history is
  // queried by the captain's character guid instead of teamId.
  readonly isSolo = input<boolean>(false);
  readonly playerGuid = input<number>();

  protected readonly fights = signal<ArenaTeamFight[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly currentPage = signal(1);
  protected readonly totalItems = signal(0);
  protected readonly pageSize = PAGE_SIZE;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly ARENA_TYPE_1v1 = ARENA_TYPE_1v1;
  protected readonly ARENA_TYPE_3v3_SOLO_QUEUE = ARENA_TYPE_3v3_SOLO_QUEUE;

  constructor() {
    effect(() => {
      this.teamId();
      untracked(() => {
        this.currentPage.set(1);
        this.fetchFights();
      });
    });
  }

  private fetchFights(): void {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams().set('page', this.currentPage().toString()).set('limit', PAGE_SIZE.toString());

    if (this.isSolo()) {
      params = params.set('playerGuid', this.playerGuid()!.toString()).set('type', this.ARENA_TYPE_3v3_SOLO_QUEUE.toString());
    } else {
      params = params.set('teamId', this.teamId().toString());
    }

    this.http
      .get<Paginated<ArenaFightLog>>(`${API_URL}/characters/log_arena_fights`, { params })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.fights.set(response.data.map((fight) => this.toTeamPerspective(fight)));
          this.totalItems.set(response.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load match history');
          console.error('Error fetching team fight history:', err);
          this.loading.set(false);
        },
      });
  }

  private toTeamPerspective(fight: ArenaFightLog): ArenaTeamFight {
    const winnerMembers = fight.winner_members.filter((member): member is ArenaFightMember => member !== null);
    const loserMembers = fight.loser_members.filter((member): member is ArenaFightMember => member !== null);

    // For solo queue, laf.winner/loser are ephemeral team ids unrelated to teamId,
    // so the side is identified by which roster contains the queried player.
    const won = this.isSolo() ? winnerMembers.some((member) => member.guid === this.playerGuid()) : fight.winner === this.teamId();

    return {
      fight_id: fight.fight_id,
      time: fight.time,
      type: fight.type,
      duration: fight.duration,
      won,
      team_rating: won ? fight.winner_tr : fight.loser_tr,
      team_mmr: won ? fight.winner_mmr : fight.loser_mmr,
      rating_change: won ? fight.winner_tr_change : fight.loser_tr_change,
      opponent_id: won ? fight.loser : fight.winner,
      opponent_name: won ? fight.loser_name : fight.winner_name,
      team_members: won ? winnerMembers : loserMembers,
      opponent_members: won ? loserMembers : winnerMembers,
    };
  }

  protected onPageChanged(event: PageChangedEvent): void {
    if (event.page === this.currentPage()) {
      return;
    }
    this.currentPage.set(event.page);
    this.fetchFights();
  }

  protected sumStat(members: ArenaFightMember[], stat: 'damage' | 'heal'): number {
    return members.reduce((total, member) => total + (member[stat] ?? 0), 0);
  }

  protected getOpponentFaction(fight: ArenaTeamFight): string {
    if (fight.opponent_members.length > 0) {
      return getFaction(fight.opponent_members[0]!.race);
    }
    return '';
  }

  protected formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  protected navigateToFight(fightId: number): void {
    this.router.navigate(['/fight', fightId]);
  }

  protected navigateToOpponent(fight: ArenaTeamFight, event: Event): void {
    // Solo queue opponents have no persistent team page; fall through to the row's
    // fight-detail navigation instead.
    if (this.isSolo()) {
      return;
    }
    event.stopPropagation();
    this.router.navigate(['/team', fight.opponent_id]);
  }
}
