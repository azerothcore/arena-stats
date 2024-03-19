import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { API_URL } from "config";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArenaTeam } from "../types/arena-team.type";
import { getFaction } from "../utils/get-faction";

@Injectable({
  providedIn: "root",
})
export class ArenaTeamService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);

  readonly teams2$: Observable<ArenaTeam[]> = this.assignTeamData(2);
  readonly teams3$: Observable<ArenaTeam[]> = this.assignTeamData(3);
  readonly teams5$: Observable<ArenaTeam[]> = this.assignTeamData(5);

  private processTeams(teams: ArenaTeam[]): ArenaTeam[] {
    if (!teams) {
      return;
    }

    for (const team of teams) {
      if (team.rank === 0) {
        team.rank = 9999; // we need to put teams with rank 0 at bottom
      }

      team.faction = getFaction(team.captainRace);
    }

    return teams;
  }

  private assignTeamData(type: number): Observable<ArenaTeam[]> {
    return this.http
      .get<ArenaTeam[]>(API_URL + "/characters/arena_team/type/" + type)
      .pipe(map((data) => this.processTeams(data)));
  }

  showTeam(arenaTeamId: number): void {
    this.router.navigate(["/team", arenaTeamId]);
  }
}
