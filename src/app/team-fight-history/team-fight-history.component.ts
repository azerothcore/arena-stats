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

    const params = new HttpParams()
      .set('teamId', this.teamId().toString())
      .set('page', this.currentPage().toString())
      .set('limit', PAGE_SIZE.toString());

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
    const won = fight.winner === this.teamId();

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
      team_members: (won ? fight.winner_members : fight.loser_members).filter((member) => member !== null),
      opponent_members: (won ? fight.loser_members : fight.winner_members).filter((member) => member !== null),
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
    event.stopPropagation();
    this.router.navigate(['/team', fight.opponent_id]);
  }
}
