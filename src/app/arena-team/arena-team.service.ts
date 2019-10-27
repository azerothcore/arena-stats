import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ArenaTeam } from '../types/arena-team.type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'config';
import { getFaction } from '../utils/get-faction';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArenaTeamService {

  teams2$: Observable<ArenaTeam[]> = this.assignTeamData(2);
  teams3$: Observable<ArenaTeam[]> = this.assignTeamData(3);
  teams5$: Observable<ArenaTeam[]> = this.assignTeamData(5);

  constructor(private http: HttpClient,
              private router: Router) { }

  private processTeams(teams: ArenaTeam[]): ArenaTeam[] {
    if (!teams) { return; }

    for (const team of teams) {

      if (team.rank === 0) {
        team.rank = 9999; // we need to put teams with rank 0 at bottom
      }

      team.faction = getFaction(team.captainRace);

    }

    return teams;
  }

  private assignTeamData(type: number): Observable<ArenaTeam[]> {
    return this.http.get<ArenaTeam[]>(API_URL + '/characters/arena_team/type/' + type)
      .pipe(
        map(data => this.processTeams(data))
      );
  }

  public showTeam(arenaTeamId: number): void {
    this.router.navigate(['/team', arenaTeamId]);
  }

}
