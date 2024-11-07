import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { API_URL } from 'config';
import { NgxSelectModule } from 'ngx-select-ex';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import { PlayerIconComponent } from '../player-icons/player-icons.component';
import { Player } from './search-player.model';

@Component({
  standalone: true,
  selector: 'app-search-player',
  templateUrl: './search-player.component.html',
  styleUrls: ['./search-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxSelectModule, ReactiveFormsModule, PlayerIconComponent],
  encapsulation: ViewEncapsulation.None,
})
export class SearchPlayerComponent implements OnInit, OnDestroy {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly router: Router = inject(Router);

  private readonly unsubscribe$ = new Subject<void>();

  protected readonly charNameText$ = new Subject<string>();
  protected readonly charNameSelected = new FormControl<Player['guid']>(null);
  protected charList: Player[] = [];

  ngOnInit(): void {
    this.charNameTyping();
    this.onSelectCharacter();
  }

  protected style(data: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(data);
  }

  private charNameTyping(): void {
    this.charNameText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((name) => name?.length >= 2 && name?.length <= 12),
        switchMap((charName) => this.http.get<Player[]>(`${API_URL}/characters/search_characters?name=${charName}`)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((values) => {
        this.charList = values;
        this.cdRef.markForCheck();
      });
  }

  private onSelectCharacter(): void {
    this.charNameSelected.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(filter((value) => !!value))
      .subscribe((playerGuid) => {
        this.router.navigate(['/player', playerGuid]);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
