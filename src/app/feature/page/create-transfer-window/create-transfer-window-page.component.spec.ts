import { ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { TransferWindowApiService } from '@app/core/api';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeTransferWindow, fakeSeason } from '@app/test';
import { render } from '@testing-library/angular';
import { CreateTransferWindowPageComponent } from './create-transfer-window-page.component';

describe('CreateTransferWindowPageComponent', () => {
  let fixture: ComponentFixture<CreateTransferWindowPageComponent>;
  let mockCurrentService: {
    season: ReturnType<typeof signal<ReturnType<typeof fakeSeason> | undefined>>;
  };
  let mockPageContextService: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCurrentService = { season: signal(undefined) };
    mockPageContextService = { register: vi.fn() };

    ({ fixture } = await render(CreateTransferWindowPageComponent, {
      providers: [
        {
          provide: TransferWindowApiService,
          useValue: { createTransferWindow: vi.fn().mockReturnValue(of(fakeTransferWindow())) },
        },
        { provide: RouterService, useValue: { navigateToTransferWindow: vi.fn() } },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: PageContextService, useValue: mockPageContextService },
      ],
    }));
  });

  it('renders the create transfer window form', () => {
    expect(
      fixture.nativeElement.querySelector('app-create-transfer-window-form'),
    ).toBeInTheDocument();
  });

  // page context ----------------------------------------------------------------------------------

  describe('page context', () => {
    it('registers with title New Transfer Window', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.title()).toBe('New Transfer Window');
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
