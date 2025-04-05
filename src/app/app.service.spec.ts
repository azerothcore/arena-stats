import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, getTestBed, waitForAsync } from "@angular/core/testing";

import { API_URL } from "config";
import { AppService } from "./app.service";
import { Worldstate } from "./types/worldstate.type";

describe("AppService", () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it("should load arena time dist. and get arena time dist correctly works", () => {
    const service: AppService = TestBed.get(AppService);
    const mockData: Worldstate[] = [
      {
        entry: 20001,
        value: 1454691600,
        comment: "NextArenaPointDistributionTime",
      },
    ];

    service.nextArenaPointsDistributionTime$.subscribe((data) =>
      expect(data).toEqual(mockData[0].value)
    );

    const req = httpMock.expectOne(
      `${API_URL}/characters/search/worldstates?comment=NextArenaPointDistributionTime`
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockData);
  });
});
