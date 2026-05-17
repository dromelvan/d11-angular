import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CountryApiService, PlayerApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeCountry, fakePlayer } from '@app/test';
import { CreatePlayerPageComponent } from './create-player-page.component';

describe('CreatePlayerPageComponent', () => {
  let fixture: ComponentFixture<CreatePlayerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlayerPageComponent],
      providers: [
        {
          provide: CountryApiService,
          useValue: { getCountries: vi.fn().mockReturnValue(of([fakeCountry()])) },
        },
        {
          provide: PlayerApiService,
          useValue: { createPlayer: vi.fn().mockReturnValue(of(fakePlayer())) },
        },
        { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlayerPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the create player component', () => {
    expect(fixture.nativeElement.querySelector('app-create-player')).toBeInTheDocument();
  });
});
