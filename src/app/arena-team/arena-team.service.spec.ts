import { TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { ArenaTeamComponent } from './arena-team.component';
import { ArenaTeamService } from './arena-team.service';
import { ArenaTeam } from '../types/arena-team.type';
import { API_URL } from 'config';

describe('ArenaTeamService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  const router = { navigate: jasmine.createSpy('navigate') };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TabsModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        ArenaTeamComponent
      ],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('processTeams() should work correctly', () => {
    const service = TestBed.get(ArenaTeamService);
    let mockDataTeams: ArenaTeam[] = [{
      captainName: 'Helias',
      captainRace: 2,
      arenaTeamId: 10,
      name: 'Helias',
      captainGuid: 10,
      type: 10,
      rating: 10,
      seasonGames: 10,
      seasonWins: 10,
      seasonLosses: 10,
      weekGames: 10,
      weekWins: 10,
      weekLosses: 10,
      rank: 10,
      backgroundColor: 10,
      emblemStyle: 10,
      emblemColor: 10,
      borderStyle: 10,
      borderColor: 10,
      faction: ''
    }];

    mockDataTeams = service['processTeams'](mockDataTeams);

    expect(mockDataTeams[0].faction).toBe('horde');
    expect(mockDataTeams[0].rank).toBe(10);

    mockDataTeams[0].captainRace = 1;
    mockDataTeams[0].rank = 0;

    mockDataTeams = service['processTeams'](mockDataTeams);

    expect(mockDataTeams[0].faction).toBe('alliance');
    expect(mockDataTeams[0].rank).toBe(9999);

    expect(service['processTeams']()).not.toBeDefined();
  });

  it('assignTeamData() shjould work correctly', () => {
    const service: ArenaTeamService = TestBed.get(ArenaTeamService);
    const mockData: ArenaTeam[] = [{
      captainName: 'Helias',
      captainRace: 2,
      arenaTeamId: 10,
      name: 'Helias',
      captainGuid: 10,
      type: 10,
      rating: 10,
      seasonGames: 10,
      seasonWins: 10,
      seasonLosses: 10,
      weekGames: 10,
      weekWins: 10,
      weekLosses: 10,
      rank: 10,
      backgroundColor: 10,
      emblemStyle: 10,
      emblemColor: 10,
      borderStyle: 10,
      borderColor: 10,
      faction: ''
    }];

    service.teams2$.subscribe((data) => expect(data).toEqual(mockData));

    const req = httpMock.expectOne(`${API_URL}/characters/arena_team/type/2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

  });

  it('showTeam() should work correctly', () => {
    const service: ArenaTeamService = TestBed.get(ArenaTeamService);
    const param = 1;

    service.showTeam(param);
    expect(router.navigate).toHaveBeenCalledWith(['/team', param]);
  });
});
