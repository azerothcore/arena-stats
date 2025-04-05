import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { ArenaTeamMemberComponent } from "./arena-team-member.component";
import { ArenaTeamMemberService } from "./arena-team-member.service";

describe("ArenaTeamMemberComponent", () => {
  let component: ArenaTeamMemberComponent;
  let fixture: ComponentFixture<ArenaTeamMemberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        ArenaTeamMemberComponent],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: { paramMap: of(convertToParamMap({ id: 1 })) },
        },
        provideHttpClient(withInterceptorsFromDi()),
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaTeamMemberComponent);
    component = fixture.componentInstance;
  });

  it("ngOinit should work correctly", () => {
    const initSpy = spyOn(TestBed.get(ArenaTeamMemberService), "init");

    fixture.detectChanges();

    expect(initSpy).toHaveBeenCalledTimes(1);
  });
});
