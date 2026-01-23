import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from 'config';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { map } from 'rxjs/operators';
import { ArenaTeamMemberService } from '../arena-team-member/arena-team-member.service';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { FightStats } from '../types/fight-stats.interface';
import { ARENA_TYPE_1v1, ARENA_TYPE_3v3_SOLO_QUEUE } from '../utils/arena-type';
import { getFaction } from '../utils/get-faction';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss'],
  imports: [DatePipe, PlayerIconComponent, PopoverModule],
})
export class FightComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly arenaTeamMemberService = inject(ArenaTeamMemberService);

  protected readonly ARENA_TYPE_1v1 = ARENA_TYPE_1v1;
  protected readonly ARENA_TYPE_3v3_SOLO_QUEUE = ARENA_TYPE_3v3_SOLO_QUEUE;
  protected readonly getFaction = getFaction;

  protected readonly fightStats = signal<FightStats | null>(null);
  protected readonly winnerMembers = computed(() =>
    this.fightStats()
      .memberStats.filter((m) => m.team === this.fightStats().fight.winner)
      .map((m) => ({ ...m, win: true })),
  );
  protected readonly loserMembers = computed(() =>
    this.fightStats()
      .memberStats.filter((m) => m.team === this.fightStats().fight.loser)
      .map((m) => ({ ...m, win: false })),
  );

  private readonly fightId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const fightId = this.fightId();
      if (fightId) {
        this.fetchFightStats(fightId);
      } else {
        this.loading.set(false);
        this.error.set('No fight ID provided');
      }
    });
  }

  private fetchFightStats(fightId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<FightStats>(`${API_URL}/characters/log_arena_fights_stats/${fightId}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          data.memberStats = data.memberStats.map((ms) => ({ ...ms, faction: getFaction(ms.race) }));
          data.fight.winner_faction = getFaction(data.fight.winner_captain_race);
          data.fight.loser_faction = getFaction(data.fight.loser_captain_race);
          this.fightStats.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load fight statistics');
          console.error('Error fetching fight stats:', err);
          this.loading.set(false);
        },
      });
  }

  protected formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  protected goToFight(fight_id: number): void {
    if (fight_id !== null && fight_id !== undefined) {
      this.router.navigate(['/fight', fight_id]);
    }
  }
}
