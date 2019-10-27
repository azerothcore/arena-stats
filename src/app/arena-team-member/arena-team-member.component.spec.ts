import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute} from '@angular/router';

import { ArenaTeamMemberComponent } from './arena-team-member.component';
import { ArenaTeamMemberService } from './arena-team-member.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArenaTeamMemberComponent', () => {
  let component: ArenaTeamMemberComponent;
  let fixture: ComponentFixture<ArenaTeamMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ ArenaTeamMemberComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({id: 1})) }
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaTeamMemberComponent);
    component = fixture.componentInstance;
  });

  it('ngOinit should work correctly', () => {
    const initSpy = spyOn(TestBed.get(ArenaTeamMemberService), 'init');

    fixture.detectChanges();

    expect(initSpy).toHaveBeenCalledTimes(1);
  });
});
