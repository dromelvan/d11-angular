import { ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CurrentApiService } from '@app/core/api';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeSeason } from '@app/test';
import { MessageService } from 'primeng/api';
import { render } from '@testing-library/angular';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockCurrentService: {
    season: ReturnType<typeof signal<ReturnType<typeof fakeSeason> | undefined>>;
  };
  let mockPageContextService: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCurrentService = { season: signal(undefined) };
    mockPageContextService = { register: vi.fn() };

    ({ fixture } = await render(LoginPageComponent, {
      providers: [
        { provide: UserSessionService, useValue: { authenticate: vi.fn() } },
        { provide: CurrentApiService, useValue: { getCurrent: vi.fn().mockReturnValue(of(null)) } },
        { provide: RouterService, useValue: { navigateToMatchWeekMatches: vi.fn() } },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: PageContextService, useValue: mockPageContextService },
      ],
    }));
  });

  it('renders the login form', () => {
    expect(fixture.nativeElement.querySelector('app-login-form')).toBeInTheDocument();
  });

  // page context ----------------------------------------------------------------------------------

  describe('page context', () => {
    it('registers with title Sign In', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.title()).toBe('Sign In');
    });

    it('sets subtitle to Season name when current season is set', () => {
      const season = fakeSeason();
      mockCurrentService.season.set(season);

      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBe(`Season ${season.name}`);
    });

    it('has no subtitle when there is no current season', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBeUndefined();
    });

    it('registers with empty background color', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.backgroundColor()).toBe('');
    });
  });
});
