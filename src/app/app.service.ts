import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'config';
import { Worldstate } from './types/worldstate.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  nextArenaPointsDistributionTime$: Observable<number> = this.http
    .get<Worldstate[]>(API_URL + '/characters/search/worldstates?comment=NextArenaPointDistributionTime')
    .pipe(
      map(data => data[0].value)
    );

  constructor(private http: HttpClient) { }
}
