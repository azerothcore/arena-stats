import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArenaTeamMember } from '../types/arena-team-member.type';
import { ArenaTeam } from '../types/arena-team.type';
import { getFaction } from '../utils/get-faction';

@Injectable({
  providedIn: 'root',
})
export class ArenaTeamMemberService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);

  teamDetails$: Observable<ArenaTeam>;
  members$: Observable<ArenaTeamMember[]>;
  private arenaTeamId: number;

  goBack(): void {
    this.router.navigate(['/']);
  }

  private loadTeamDetail(): void {
    this.teamDetails$ = this.http.get<ArenaTeam[]>(API_URL + '/characters/arena_team/id/' + this.arenaTeamId).pipe(
      map((data: ArenaTeam[]) => {
        data[0].seasonLosses = data[0].seasonGames - data[0].seasonWins;
        data[0].weekLosses = data[0].weekGames - data[0].weekWins;
        data[0].faction = getFaction(data[0].captainRace);

        return data[0];
      }),
    );
  }

  private loadTeamMemberDetail(): void {
    this.members$ = this.http.get<ArenaTeamMember[]>(API_URL + '/characters/arena_team_member/' + this.arenaTeamId).pipe(
      map((data: ArenaTeamMember[]) => {
        data.forEach((value: ArenaTeamMember, idx: number) => {
          data[idx].seasonLosses = value.seasonGames - value.seasonWins;
          data[idx].weekLosses = value.weekGames - value.weekWins;
          data[idx].weekNeeded = value.weekGames > 9 ? 0 : 10 - value.weekGames;
          data[idx].faction = getFaction(value.race);
        });

        return data;
      }),
    );
  }

  init(routeParam): void {
    this.arenaTeamId = routeParam;
    this.loadTeamDetail();
    this.loadTeamMemberDetail();
  }
}
