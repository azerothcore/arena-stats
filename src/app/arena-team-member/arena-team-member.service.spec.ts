import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsModule } from 'ngx-bootstrap/tabs';
import Spy = jasmine.Spy;

import { API_URL } from 'config';
import { ArenaTeamMember } from '../types/arena-team-member.type';
import { ArenaTeam } from '../types/arena-team.type';
import { getFaction } from '../utils/get-faction';
import { ArenaTeamMemberComponent } from './arena-team-member.component';
import { ArenaTeamMemberService } from './arena-team-member.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ArenaTeamMemberService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  const router = { navigate: jasmine.createSpy('navigate') };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TabsModule.forRoot(), RouterTestingModule, ArenaTeamMemberComponent],
    providers: [{ provide: Router, useValue: router }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('loadTeamDetail() should work correctly', () => {
    const service: ArenaTeamMemberService = TestBed.get(ArenaTeamMemberService);
    const mockData: ArenaTeam[] = [
      {
        captainName: 'Helias',
        captainRace: 2,
        captainGender: 1,
        captainClass: 1,
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
        faction: '',
      },
    ];

    service.init(1);

    mockData[0].seasonLosses = mockData[0].seasonGames - mockData[0].seasonWins;
    mockData[0].weekLosses = mockData[0].weekGames - mockData[0].weekWins;
    mockData[0].faction = getFaction(mockData[0].captainRace);

    service.teamDetails$.subscribe((data) => expect(data).toEqual(mockData[0]));

    const req = httpMock.expectOne(API_URL + '/characters/arena_team/id/' + service['arenaTeamId']);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('loadTeamMemberDetail() should work correctly', () => {
    const service: ArenaTeamMemberService = TestBed.get(ArenaTeamMemberService);
    const mockData: ArenaTeamMember[] = [
      {
        arenaTeamId: 1,
        guid: 1,
        weekGames: 1,
        weekWins: 1,
        seasonGames: 1,
        seasonWins: 1,
        personalRating: 1,
        matchmakerRating: 1,
        name: 'Helias',
        class: 1,
        race: 1,
        gender: 1,
      },
    ];

    service.init(1);

    service.members$.subscribe((data) => expect(data).toEqual(mockData));

    httpMock.expectOne(API_URL + '/characters/arena_team/id/' + service['arenaTeamId']);
    const req = httpMock.expectOne(API_URL + '/characters/arena_team_member/' + service['arenaTeamId']);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('init() should work correctly', () => {
    const service: ArenaTeamMemberService = TestBed.get(ArenaTeamMemberService);
    const loadTeamDetailSpy: Spy = spyOn<any>(service, 'loadTeamDetail');
    const loadTeamMemberDetailSpy: Spy = spyOn<any>(service, 'loadTeamMemberDetail');
    const param = 1;

    service.init(param);

    expect(service['arenaTeamId']).toBe(param);
    expect(loadTeamDetailSpy).toHaveBeenCalledTimes(1);
    expect(loadTeamMemberDetailSpy).toHaveBeenCalledTimes(1);
  });

  it('goBack() should work correctly', () => {
    const service: ArenaTeamMemberService = TestBed.get(ArenaTeamMemberService);
    service.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
