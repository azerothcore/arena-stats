import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from 'config';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
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
      shareReplay(),
      map((data: ArenaTeam[]) => {
        data[0].seasonLosses = data[0].seasonGames - data[0].seasonWins;
        data[0].weekLosses = data[0].weekGames - data[0].weekWins;
        data[0].faction = getFaction(data[0].captainRace);

        return data[0];
      }),
    );
  }

  private loadTeamMemberDetail(): void {
    this.members$ = combineLatest([
      this.http.get<ArenaTeamMember[]>(API_URL + '/characters/arena_team_member/' + this.arenaTeamId),
      this.teamDetails$,
    ]).pipe(
      map(([data, teamdetails]: [ArenaTeamMember[], ArenaTeam]) => {
        // To get points, a player has to participate in at least 30% of the matches
        const neededGames = teamdetails.weekGames >= 10 ? Math.ceil(teamdetails.weekGames * 0.3) : 10;

        data.forEach((value: ArenaTeamMember, idx: number) => {
          data[idx].seasonLosses = value.seasonGames - value.seasonWins;
          data[idx].weekLosses = value.weekGames - value.weekWins;
          data[idx].weekNeeded = value.weekGames > neededGames ? 0 : neededGames - value.weekGames;
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
