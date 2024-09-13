import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { API_URL } from "config";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { ArenaTeam } from "../types/arena-team.type";
import { getFaction } from "../utils/get-faction";
import { ArenaTypes } from "./arena-team.model";

@Injectable({
  providedIn: "root",
})
export class ArenaTeamService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);

  readonly teams$: { [arenaType: number]: Observable<ArenaTeam[]> } = {
    [ArenaTypes.ARENA_TYPE_1v1]: this.assignTeamData(ArenaTypes.ARENA_TYPE_1v1),
    [ArenaTypes.ARENA_TYPE_2v2]: this.assignTeamData(ArenaTypes.ARENA_TYPE_2v2),
    [ArenaTypes.ARENA_TYPE_3v3]: this.assignTeamData(ArenaTypes.ARENA_TYPE_3v3),
    [ArenaTypes.ARENA_TYPE_3v3_SOLO_QUEUE]: this.assignTeamData(
      ArenaTypes.ARENA_TYPE_3v3_SOLO_QUEUE
    ),
    [ArenaTypes.ARENA_TYPE_5v5]: this.assignTeamData(ArenaTypes.ARENA_TYPE_5v5),
  };

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

    return teams.sort((a: ArenaTeam, b: ArenaTeam) => {
      if (a.rank < b.rank) {
        return -1;
      }

      if (a.rank > b.rank) {
        return 1;
      }

      return 0;
    });
  }

  private assignTeamData(arenaType: ArenaTypes): Observable<ArenaTeam[]> {
    return this.http
      .get<ArenaTeam[]>(API_URL + "/characters/arena_team/type/" + arenaType)
      .pipe(
        map((data) => this.processTeams(data)),
        shareReplay()
      );
  }

  showTeam(arenaTeamId: number): void {
    this.router.navigate(["/team", arenaTeamId]);
  }
}
