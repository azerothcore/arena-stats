import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { ArenaFightLog } from '../types/arena-fight-log.interface';
import { ArenaFightMember } from '../types/arena-fight-member.interface';
import { ARENA_TYPE_1v1, ARENA_TYPE_3v3_SOLO_QUEUE } from '../utils/arena-type';
import { getFaction } from '../utils/get-faction';

@Component({
  selector: 'app-detailed-score',
  templateUrl: './detailed-score.component.html',
  styleUrls: ['./detailed-score.component.scss'],
  imports: [DatePipe, PlayerIconComponent, FormsModule],
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
  protected filterMinLevel = signal<number | null>(null);
  protected filterMaxLevel = signal<number | null>(null);

  private readonly http = inject(HttpClient);

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
    if (this.filterMinLevel() !== null) {
      params = params.set('minLevel', this.filterMinLevel()!.toString());
    }
    if (this.filterMaxLevel() !== null) {
      params = params.set('maxLevel', this.filterMaxLevel()!.toString());
    }

    this.http.get<ArenaFightLog[]>('http://localhost:3000/characters/log_arena_fights', { params }).subscribe({
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
    this.filterMinLevel.set(null);
    this.filterMaxLevel.set(null);
    this.fetchArenaFights();
  }

  protected onLevelFilterChange(value: string): void {
    if (!value) {
      this.filterMinLevel.set(null);
      this.filterMaxLevel.set(null);
    } else if (value === '80') {
      this.filterMinLevel.set(80);
      this.filterMaxLevel.set(80);
    } else if (value === '71-79') {
      this.filterMinLevel.set(71);
      this.filterMaxLevel.set(79);
    } else if (value === '70') {
      this.filterMinLevel.set(70);
      this.filterMaxLevel.set(70);
    }

    this.applyFilters();
  }

  protected filterNullMembers(members: (ArenaFightMember | null)[]): ArenaFightMember[] {
    return members.filter((member): member is ArenaFightMember => member !== null);
  }

  protected getTeamFaction(members: (ArenaFightMember | null)[]): string {
    const validMembers = this.filterNullMembers(members);
    if (validMembers.length > 0) {
      return getFaction(validMembers[0].race);
    }
    return '';
  }
}
