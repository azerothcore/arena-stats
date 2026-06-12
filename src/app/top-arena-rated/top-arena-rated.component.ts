import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_URL } from 'config';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { Paginated } from '../types/paginated.interface';
import { ARENA_TYPE_3v3_SOLO_QUEUE } from '../utils/arena-type';
import { getFaction } from '../utils/get-faction';

const PAGE_SIZE = 20;

interface Character {
  guid: number;
  name: string;
  race: number;
  class: number;
  gender: number;
  level: number;
}

interface GameByType {
  type: number;
  game: number;
}

interface TopArenaPlayer {
  character: Character;
  totalGames: number;
  gamesByType: GameByType[];
}

@Component({
  selector: 'app-top-arena-rated',
  templateUrl: './top-arena-rated.component.html',
  styleUrls: ['./top-arena-rated.component.scss'],
  imports: [FormsModule, PlayerIconComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopArenaRatedComponent implements OnInit {
  protected players = signal<TopArenaPlayer[]>([]);
  protected loading = signal(true);
  protected error = signal<string | null>(null);
  protected expandedPlayers = signal<Set<number>>(new Set());

  protected filterYear = signal<number | null>(new Date().getFullYear());
  protected filterMonth = signal<number | null>(new Date().getMonth() + 1);

  protected readonly currentPage = signal(1);
  protected readonly totalItems = signal(0);
  protected readonly pageSize = PAGE_SIZE;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly getFaction = getFaction;
  protected readonly ARENA_TYPE_3v3_SOLO_QUEUE = ARENA_TYPE_3v3_SOLO_QUEUE;

  ngOnInit(): void {
    this.fetchPlayers();
  }

  protected fetchPlayers(): void {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams().set('excludeType', '1').set('page', this.currentPage().toString()).set('limit', PAGE_SIZE.toString());

    if (this.filterYear() !== null) {
      params = params.set('year', this.filterYear()!.toString());
    }
    if (this.filterMonth() !== null) {
      params = params.set('month', this.filterMonth()!.toString());
    }

    this.http
      .get<Paginated<TopArenaPlayer>>(`${API_URL}/characters/players_monthly_games`, { params })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.players.set(response.data);
          this.totalItems.set(response.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load top arena players');
          console.error('Error fetching top arena players:', err);
          this.loading.set(false);
        },
      });
  }

  protected applyFilters(): void {
    this.currentPage.set(1);
    this.fetchPlayers();
  }

  protected clearFilters(): void {
    this.filterYear.set(null);
    this.filterMonth.set(null);
    this.currentPage.set(1);
    this.fetchPlayers();
  }

  protected onPageChanged(event: PageChangedEvent): void {
    if (event.page === this.currentPage()) {
      return;
    }
    this.currentPage.set(event.page);
    this.fetchPlayers();
  }

  protected navigateToPlayer(player: TopArenaPlayer): void {
    this.router.navigate(['/player', player.character.guid]);
  }

  protected getRank(index: number): number {
    const pageOffset = (this.currentPage() - 1) * PAGE_SIZE;
    const currentPlayer = this.players()[index];
    if (index === 0) {
      return pageOffset + 1;
    }

    const previousPlayer = this.players()[index - 1];
    if (currentPlayer.totalGames === previousPlayer.totalGames) {
      return this.getRank(index - 1);
    }

    return pageOffset + index + 1;
  }

  protected togglePlayerDetails(guid: number, event: Event): void {
    event.stopPropagation();
    const expanded = new Set(this.expandedPlayers());
    if (expanded.has(guid)) {
      expanded.delete(guid);
    } else {
      expanded.add(guid);
    }
    this.expandedPlayers.set(expanded);
  }

  protected isPlayerExpanded(guid: number): boolean {
    return this.expandedPlayers().has(guid);
  }
}
