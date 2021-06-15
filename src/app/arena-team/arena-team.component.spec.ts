import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArenaTeamComponent } from './arena-team.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArenaTeamComponent', () => {
  let component: ArenaTeamComponent;
  let fixture: ComponentFixture<ArenaTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TabsModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ ArenaTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
