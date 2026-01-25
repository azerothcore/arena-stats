import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_URL } from 'config';
import { DetailedScoreMemberComponent } from '../detailed-score-member/detailed-score-member.component';
import { ArenaFightLog } from '../types/arena-fight-log.interface';
import { ArenaFightMember } from '../types/arena-fight-member.interface';
import { ARENA_TYPE_1v1, ARENA_TYPE_3v3_SOLO_QUEUE } from '../utils/arena-type';
import { getFaction } from '../utils/get-faction';

@Component({
  selector: 'app-detailed-score',
  templateUrl: './detailed-score.component.html',
  styleUrls: ['./detailed-score.component.scss'],
  imports: [DatePipe, FormsModule, DetailedScoreMemberComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedScoreComponent implements OnInit {
  protected arenaFights: ArenaFightLog[] = [];
  protected loading = signal(true);
  protected error: string | null = null;

  protected filterType = signal<number | null>(null);
  protected filterYear = signal<number | null>(null);
  protected filterMonth = signal<number | null>(null);
  protected filterLimit = signal<number | null>(null);

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly ARENA_TYPE_3v3_SOLO_QUEUE = ARENA_TYPE_3v3_SOLO_QUEUE;
  protected readonly ARENA_TYPE_1v1 = ARENA_TYPE_1v1;

  ngOnInit(): void {
    this.fetchArenaFights();
  }

  protected fetchArenaFights(): void {
    this.loading.set(true);
    this.error = null;

    let params = new HttpParams();

    if (this.filterType() !== null) {
      params = params.set('type', this.filterType()!.toString());
    }
    if (this.filterYear() !== null) {
      params = params.set('year', this.filterYear()!.toString());
    }
    if (this.filterMonth() !== null) {
      params = params.set('month', this.filterMonth()!.toString());
    }
    if (this.filterLimit() !== null) {
      params = params.set('limit', this.filterLimit()!.toString());
    }

    this.http
      .get<ArenaFightLog[]>(`${API_URL}/characters/log_arena_fights`, { params })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.arenaFights = data;
          this.loading.set(false);
        },
        error: (err) => {
          this.error = 'Failed to load arena fight logs';
          console.error('Error fetching arena fights:', err);
          this.loading.set(false);
        },
      });
  }

  protected applyFilters(): void {
    this.fetchArenaFights();
  }

  protected clearFilters(): void {
    this.filterType.set(null);
    this.filterYear.set(null);
    this.filterMonth.set(null);
    this.filterLimit.set(null);
    this.fetchArenaFights();
  }

  protected getTeamFaction(members: ArenaFightMember[]): string {
    if (members.length > 0) {
      return getFaction(members[0]!.race);
    }
    return '';
  }

  protected navigateToFight(fightId: number): void {
    this.router.navigate(['/fight', fightId]);
  }
}
