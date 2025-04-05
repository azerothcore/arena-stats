import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ArenaTeamComponent } from "./arena-team.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("ArenaTeamComponent", () => {
  let component: ArenaTeamComponent;
  let fixture: ComponentFixture<ArenaTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TabsModule.forRoot(),
        RouterTestingModule,
        ArenaTeamComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
