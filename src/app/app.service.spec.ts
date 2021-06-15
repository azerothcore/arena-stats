import { TestBed, getTestBed, ComponentFixture, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { AppService } from './app.service';
import { Worldstate } from './types/worldstate.type';
import { API_URL } from 'config';

describe('AppService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
      ]
    })
    .compileComponents();

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should load arena time dist. and get arena time dist correctly works', () => {
    const service: AppService = TestBed.get(AppService);
    const mockData: Worldstate[] = [{
      entry: 20001,
      value: 1454691600,
      comment: 'NextArenaPointDistributionTime'
    }];

    service.nextArenaPointsDistributionTime$.subscribe((data) => expect(data).toEqual(mockData[0].value));

    const req = httpMock.expectOne(`${API_URL}/characters/search/worldstates?comment=NextArenaPointDistributionTime`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

  });
});
