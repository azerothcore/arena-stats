import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL } from "config";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Worldstate } from "./types/worldstate.type";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private readonly http: HttpClient = inject(HttpClient);

  readonly nextArenaPointsDistributionTime$: Observable<number> = this.http
    .get<Worldstate[]>(
      API_URL +
        "/characters/search/worldstates?comment=NextArenaPointDistributionTime"
    )
    .pipe(map((data) => data[0].value));
}
