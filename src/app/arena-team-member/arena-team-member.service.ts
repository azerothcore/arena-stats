import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ArenaTeamMember } from '../types/arena-team-member.type';
import { API_URL } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getFaction } from '../utils/get-faction';
import { ArenaTeam } from '../types/arena-team.type';

@Injectable({
  providedIn: 'root'
})
export class ArenaTeamMemberService {

  get teamDetails$() { return this._teamDetails$; }
  get members$()     { return this._members$;     }

  private _teamDetails$: Observable<ArenaTeam>;
  private _members$: Observable<ArenaTeamMember[]>;
  private arenaTeamId: number;

  constructor(private http: HttpClient,
              private router: Router) { }

  public goBack(): void {
    this.router.navigate(['/']);
  }

  private loadTeamDetail(): void {

    this._teamDetails$ = this.http.get<ArenaTeam[]>(API_URL + '/characters/arena_team/id/' + this.arenaTeamId)
      .pipe(
        map((data: ArenaTeam[]) => {

          data[0].seasonLosses = data[0].seasonGames - data[0].seasonWins;
          data[0].weekLosses   = data[0].weekGames   - data[0].weekWins;
          data[0].faction      = getFaction(data[0].captainRace);

          return data[0];
        })
      );
  }

  private loadTeamMemberDetail(): void {

    this._members$ = this.http.get<ArenaTeamMember[]>(API_URL + '/characters/arena_team_member/' + this.arenaTeamId)
      .pipe(
        map((data: ArenaTeamMember[]) => {

          data.forEach((value: ArenaTeamMember, idx: number) => {
            data[idx].seasonLosses = value.seasonGames - value.seasonWins;
            data[idx].weekLosses   = value.weekGames   - value.weekWins;
            data[idx].weekNeeded   = value.weekGames > 9 ? 0 : 10 - value.weekGames;
            data[idx].faction      = getFaction(value.race);
          });

          return data;
        })
      );
  }

  public init(routeParam): void {
    this.arenaTeamId = routeParam;
    this.loadTeamDetail();
    this.loadTeamMemberDetail();
  }

}
